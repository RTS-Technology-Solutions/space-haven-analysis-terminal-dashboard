// @ts-nocheck - Future implementation, not used in beta wireframe
/**
 * Space Haven Save File Parser
 * Extracts hierarchical game data from XML save files
 */

import type {
  GameSession,
  Ship,
  CrewMember,
  Skill,
  JobAssignment,
  InventoryItem,
  ConsumableItem,
  StarSystem,
  FactionRelation,
  ParserConfig
} from '../types/gameData'
import type { Element as GameElement } from '../types/gameData'
import { DEFAULT_SKILL_MAPPINGS } from '../types/gameData'

export class SpaceHavenParser {
  private config: ParserConfig
  
  constructor(config?: Partial<ParserConfig>) {
    this.config = {
      skillMappings: config?.skillMappings || DEFAULT_SKILL_MAPPINGS,
      itemMappings: config?.itemMappings || {},
      traitMappings: config?.traitMappings || {},
      occupationMappings: config?.occupationMappings || {}
    }
  }
  
  /**
   * Parse XML save file into structured GameSession
   */
  async parseGameSave(xmlText: string, fileName: string): Promise<GameSession> {
    console.log(`🔧 Starting parse of ${fileName}`)
    console.log(`📄 File size: ${xmlText.length} bytes`)
    
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Check for parse errors
    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      throw new Error(`XML Parse Error: ${parseError.textContent}`)
    }
    
    const root = xmlDoc.documentElement
    console.log(`📦 Root element: <${root.tagName}>`)
    console.log(`   Root attributes: mode="${root.getAttribute('mode')}"`)
    
    // Extract timestamp from filename (e.g., game_20260531_1505.xml)
    const timestamp = this.extractTimestamp(fileName)
    
    // Extract top-level game metadata
    const gameMode = root.getAttribute('mode') || 'Unknown'
    const daysSurvived = this.extractGameTime(root)
    console.log(`⏰ Days survived: ${daysSurvived}`)
    
    // Detect player faction ID for ownership filtering
    const playerFactionId = this.detectPlayerFaction(root)
    console.log(`🎮 Player faction ID: ${playerFactionId}`)
    
    // Create game session
    const gameSession: GameSession = {
      saveFileName: fileName,
      timestamp,
      gameMode,
      daysSurvived,
      playerFactionId,
      ships: [],
      starSystems: [],
      factionRelations: [],
      researchProgress: {}
    }
    
    // Extract hierarchical components
    console.log(`\n🔍 Beginning extraction...`)
    
    // Extract characters first (they're at root level, not inside ships)
    const allCharacters = this.extractCharactersFromRoot(root)
    console.log(`👥 Extracted ${allCharacters.length} total characters from root`)
    
    // Extract ships and assign crew by shipId
    gameSession.ships = this.extractShips(root, allCharacters, playerFactionId)
    gameSession.starSystems = this.extractStarSystems(root)
    gameSession.factionRelations = this.extractFactionRelations(root)
    
    console.log(`\n✓ Parsed ${fileName}:`, {
      ships: gameSession.ships.length,
      systems: gameSession.starSystems.length,
      factions: gameSession.factionRelations.length
    })
    
    return gameSession
  }
  
  // ==========================================================================
  // TIMESTAMP & METADATA EXTRACTION
  // ==========================================================================
  
  private extractTimestamp(fileName: string): Date {
    // Try to parse timestamp from filename (e.g., game_20260531_1505.xml)
    const match = fileName.match(/(\d{8})_(\d{4})/)
    
    if (match) {
      const [, dateStr, timeStr] = match
      const year = parseInt(dateStr.substr(0, 4))
      const month = parseInt(dateStr.substr(4, 2)) - 1  // JS months are 0-indexed
      const day = parseInt(dateStr.substr(6, 2))
      const hour = parseInt(timeStr.substr(0, 2))
      const minute = parseInt(timeStr.substr(2, 2))
      
      return new Date(year, month, day, hour, minute)
    }
    
    // Fallback to current time
    return new Date()
  }
  
  private extractGameTime(root: HTMLElement): number {
    const clocks = root.getElementsByTagName('clock')
    if (clocks.length > 0) {
      const clock = clocks[0] as HTMLElement
      const days = clock.getAttribute('days')
      return days ? parseInt(days) : 0
    }
    return 0
  }
  
  /**
   * Detect the player's faction ID from the save file
   * This is used to identify all player-owned entities (ships, crew, crafts, etc.)
   */
  private detectPlayerFaction(root: HTMLElement): string {
    // Strategy 1: Look for explicit player faction in <factions> or root attributes
    const playerAttr = root.getAttribute('player') || root.getAttribute('playerFaction')
    if (playerAttr) {
      console.log(`  ✓ Found player faction via root attribute: ${playerAttr}`)
      return playerAttr
    }
    
    // Strategy 2: Find faction marked as player or human-controlled
    const factionsNodes = root.getElementsByTagName('factions')
    if (factionsNodes.length > 0) {
      const factions = Array.from(factionsNodes[0].getElementsByTagName('f'))
      for (const fac of factions) {
        const htmlFac = fac as HTMLElement
        const isPlayer = htmlFac.getAttribute('player') === 'true' || 
                        htmlFac.getAttribute('isPlayer') === '1' ||
                        htmlFac.getAttribute('type') === 'player'
        if (isPlayer) {
          const facId = htmlFac.getAttribute('id') || htmlFac.getAttribute('fid') || '0'
          console.log(`  ✓ Found player faction in <factions>: ${facId}`)
          return facId
        }
      }
    }
    
    // Strategy 3: Find characters with side="Player" and get their faction
    const charactersNodes = root.getElementsByTagName('characters')
    if (charactersNodes.length > 0) {
      const chars = Array.from(charactersNodes[0].getElementsByTagName('c'))
      for (const char of chars) {
        const htmlChar = char as HTMLElement
        const side = htmlChar.getAttribute('side')
        if (side === 'Player') {
          const facId = htmlChar.getAttribute('fac') || htmlChar.getAttribute('faction') || '0'
          console.log(`  ✓ Detected player faction from Player crew: ${facId}`)
          return facId
        }
      }
    }
    
    // Strategy 4: Look for ships owned by player
    const shipsNodes = root.getElementsByTagName('ships')
    if (shipsNodes.length > 0) {
      const ships = Array.from(shipsNodes[0].getElementsByTagName('ship'))
      for (const ship of ships) {
        const htmlShip = ship as HTMLElement
        const owner = htmlShip.getAttribute('owner') || htmlShip.getAttribute('oid')
        const isPlayerShip = htmlShip.getAttribute('player') === 'true' ||
                            owner === 'player' ||
                            owner === 'Player'
        if (isPlayerShip) {
          console.log(`  ✓ Found player-owned ship, faction: ${owner || '0'}`)
          return owner || '0'
        }
      }
    }
    
    // Fallback: Assume faction "0" is the player (common in Space Haven)
    console.log(`  ⚠️ Could not detect player faction, defaulting to "0"`)
    return '0'
  }
  
  // ==========================================================================
  // SHIP & ELEMENT EXTRACTION
  // ==========================================================================
  
  private extractShips(root: HTMLElement, allCharacters: CrewMember[], playerFactionId: string): Ship[] {
    const ships: Ship[] = []
    
    console.log(`🚢 Searching for ships...`)
    
    // CRITICAL: getElementsByTagName returns ALL <ships> elements in the document,
    // including nested ones inside starmap systems. We need the DIRECT child of root.
    // Cannot use shipsContainers[0] because nested elements appear first in document order!
    let shipsContainer: HTMLElement | null = null
    
    // Find the <ships> element that is a direct child of root
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i] as HTMLElement
      if (child.tagName.toLowerCase() === 'ships') {
        shipsContainer = child
        console.log(`   ✅ Found <ships> container as direct child of root`)
        break
      }
    }
    
    if (!shipsContainer) {
      console.warn('❌ No <ships> container found as direct child of root')
      
      // Debug: List all child element names
      const children = root.children
      console.log(`   Root has ${children.length} children:`)
      for (let i = 0; i < Math.min(children.length, 10); i++) {
        console.log(`     - <${children[i].tagName}>`)
      }
      
      return ships
    }
    const shipElements = shipsContainer.getElementsByTagName('ship')
    
    console.log(`🚀 Found ${shipElements.length} ships in save file`)
    
    if (shipElements.length === 0) {
      console.warn(`❌ <ships> container exists but has 0 <ship> children`)
      console.log(`   <ships> container has ${shipsContainer.children.length} children`)
      
      // Debug: Show what elements ARE in the ships container
      console.log(`   📋 Children of <ships> container:`)
      for (let i = 0; i < shipsContainer.children.length; i++) {
        const child = shipsContainer.children[i]
        console.log(`     [${i}] <${child.tagName}> with ${child.attributes.length} attributes`)
        // Show first few attributes
        const attrs: string[] = []
        for (let j = 0; j < Math.min(child.attributes.length, 5); j++) {
          const attr = child.attributes[j]
          attrs.push(`${attr.name}="${attr.value}"`)
        }
        if (attrs.length > 0) {
          console.log(`         Attributes: ${attrs.join(', ')}`)
        }
      }
      
      return ships
    }
    
    for (let i = 0; i < shipElements.length; i++) {
      const shipElem = shipElements[i] as HTMLElement
      const shipId = shipElem.getAttribute('sid') || ''
      
      // Extract characters from INSIDE this ship element
      const shipCrew = this.extractCharactersFromShip(shipElem, shipId)
      
      // Also include fighters/shuttles from allCharacters (from <space>) that have this homeSid
      const fightersAndShuttles = allCharacters.filter(char => char.currentTask === shipId)
      const allShipCrew = [...shipCrew, ...fightersAndShuttles]
      
      // Determine ownership by checking if ship has crew from player faction
      const hasPlayerCrew = allShipCrew.some(c => c.side === 'Player')
      const ownerId = hasPlayerCrew ? playerFactionId : 'unknown'
      const isPlayerOwned = hasPlayerCrew
      
      const ship: Ship = {
        shipId,
        shipName: shipElem.getAttribute('sname') || `Ship_${shipId}`,
        shipType: this.inferShipType(shipElem),
        positionX: this.safeFloat(shipElem, 'sx'),
        positionY: this.safeFloat(shipElem, 'sy'),
        ownerId,
        isPlayerOwned,
        elements: [],
        crew: [],
        powerGrid: {
          generators: [],
          consumers: [],
          totalPower: 0,
          totalConsumption: 0,
          efficiency: 100
        },
        resourceManager: {
          storageRules: [],
          productionQueue: [],
          autoOrders: []
        }
      }
      
      // Extract ship's elements (hull tiles/components)
      ship.elements = this.extractElements(shipElem)
      console.log(`  ├─ Elements: ${ship.elements.length}`)
      
      // Assign all crew (from inside ship + fighters/shuttles)
      ship.crew = allShipCrew
      const playerCrewCount = ship.crew.filter(c => c.side === 'Player').length
      console.log(`  ├─ Crew: ${ship.crew.length} (Player: ${playerCrewCount})`)
      console.log(`  ├─ Owner: ${isPlayerOwned ? '🎮 Player' : `⚪ ${ownerId}`}`)
      
      ships.push(ship)
      console.log(`  └─ Ship complete: ${ship.shipName}`)
    }
    
    return ships
  }
  
  private inferShipType(shipElem: HTMLElement): 'ship' | 'station' {
    // Check for explicit station attribute (sta="1" means it's a station)
    const isStation = shipElem.getAttribute('sta') === '1'
    
    if (isStation) {
      return 'station'
    }
    
    return 'ship'
  }
  
  private extractElements(shipElem: HTMLElement): GameElement[] {
    const elements: GameElement[] = []
    const elementNodes = Array.from(shipElem.getElementsByTagName('e'))
    
    elementNodes.forEach((elemNode: Element) => {
      const elemHtml = elemNode as HTMLElement
      const x = this.safeInt(elemHtml, 'x')
      const y = this.safeInt(elemHtml, 'y')
      const moduleType = this.safeInt(elemHtml, 'm')
      
      // Get human-readable name from ID mapper
      const moduleName = this.getItemName(moduleType.toString(), `Element_${moduleType}`)
      
      // Extract health and shields from ATTRIBUTES (not nested elements)
      // ht = health, sh = shield strength
      const hullHealth = this.safeInt(elemHtml, 'ht', 0)  // Direct attribute, not percentage
      const shieldStrength = this.safeInt(elemHtml, 'sh', 0)  // Direct attribute
      const maxHealth = hullHealth > 0 ? hullHealth : 100  // If no ht attribute, assume full health
      
      // Determine status based on health
      const healthPct = maxHealth > 0 ? (hullHealth / maxHealth * 100) : 100
      let status: GameElement['status'] = 'Operational'
      if (hullHealth === 0 || healthPct < 1) status = 'Destroyed'
      else if (healthPct < 25) status = 'Critical'
      else if (healthPct < 75) status = 'Damaged'
      
      const element: GameElement = {
        elementId: moduleType,
        x,
        y,
        moduleType,
        moduleName,
        hullHealth,
        shieldStrength,
        maxHealth,
        status,
        inventory: [],
        consumableInventory: []
      }
      
      // Extract inventory from nested <l> node if it exists
      const lNodes = elemNode.getElementsByTagName('l')
      if (lNodes.length > 0) {
        const lNode = lNodes[0] as HTMLElement
        element.inventory = this.extractInventory(lNode, moduleName)
        element.consumableInventory = this.extractConsumableInventory(lNode, moduleName)
      }
      
      elements.push(element)
    })
    
    return elements
  }
  
  private extractInventory(lNode: HTMLElement, location: string): InventoryItem[] {
    const inventory: InventoryItem[] = []
    const invNodes = lNode.getElementsByTagName('inv')
    
    if (invNodes.length === 0) return inventory
    
    const invNode = invNodes[0] as HTMLElement
    const slots = Array.from(invNode.getElementsByTagName('s'))
    slots.forEach(slot => {
      const htmlSlot = slot as HTMLElement
      const itemId = htmlSlot.getAttribute('element') || ''
      const quantity = this.safeInt(htmlSlot, 'amount')
      
      if (itemId && quantity > 0) {
        inventory.push({
          itemId,
          itemName: this.getItemName(itemId, itemId),
          quantity,
          location
        })
      }
    })
    
    return inventory
  }
  
  private extractConsumableInventory(lNode: HTMLElement, _location: string): ConsumableItem[] {
    const consumables: ConsumableItem[] = []
    const cinvNodes = lNode.getElementsByTagName('cinv')
    
    if (cinvNodes.length === 0) return consumables
    
    const cinvNode = cinvNodes[0] as HTMLElement
    const foodItems = Array.from(cinvNode.getElementsByTagName('f'))
    foodItems.forEach(foodNode => {
      const htmlFood = foodNode as HTMLElement
      const elementId = htmlFood.getAttribute('element') || ''
      const quantity = this.safeFloat(htmlFood, 'amount')
      
      if (elementId && quantity > 0) {
        consumables.push({
          elementId,
          elementName: this.getItemName(elementId, elementId),
          quantity,
          protein: this.safeFloat(htmlFood, 'protein', 0),
          carbs: this.safeFloat(htmlFood, 'carbs', 0),
          fat: this.safeFloat(htmlFood, 'fat', 0),
          vitamins: this.safeFloat(htmlFood, 'vitamins', 0),
          toxins: this.safeFloat(htmlFood, 'toxin', 0)
        })
      }
    })
    
    return consumables
  }
  
  // ==========================================================================
  // CREW EXTRACTION (from root level)
  // ==========================================================================
  
  /**
   * Extract fighters and shuttles from the <space> element.
   * These have homeSid attribute linking them back to their parent ship.
   * Regular crew members are extracted from inside ship elements separately.
   */
  private extractCharactersFromRoot(root: HTMLElement): CrewMember[] {
    const crew: CrewMember[] = []
    
    // Get ALL <c> elements from entire document (includes fighters/shuttles in <space>)
    const charNodes = Array.from(root.getElementsByTagName('c'))
    
    console.log(`Found ${charNodes.length} character nodes`)
    
    charNodes.forEach(charNode => {
      const htmlChar = charNode as HTMLElement
      
      // TODO: Add homeShipId field to CrewMember type for cleaner separation
      // For now, we store homeSid in currentTask for crew-to-ship assignment
      const homeShipId = htmlChar.getAttribute('homeSid') || ''
      const _actualTask = htmlChar.getAttribute('task') || 'Idle'
      
      // Only process if this character has homeSid (fighter/shuttle)
      // Regular crew inside ships will be extracted separately
      if (!homeShipId) return
      
      // Check if this is a craft (fighters/shuttles are OK here, but filter out other crafts)
      const isCraft = htmlChar.getAttribute('craft') === '1'
      if (isCraft) {
        console.log(`  ⏭️ Skipping craft in space: ${htmlChar.getAttribute('cname')}`)
        return
      }
      
      const crewMember: CrewMember = {
        crewId: htmlChar.getAttribute('cid') || htmlChar.getAttribute('id') || '',
        name: htmlChar.getAttribute('cname') || 'Unknown',  // Fighters use cname, not name
        lastName: '',
        side: (htmlChar.getAttribute('side') as any) || 'Player',
        faction: htmlChar.getAttribute('fac') || '', // fac = faction ID
        x: this.safeFloat(htmlChar, 'x'),
        y: this.safeFloat(htmlChar, 'y'),
        currentTask: homeShipId, // Store homeSid for crew assignment
        health: 100,
        food: 100,
        rest: 100,
        mood: 50,
        oxygen: 100,
        temperature: 20,
        comfort: 100,
        energy: 100,
        skills: [],
        jobAssignments: [],
        schedule: {},
        inventory: []
      }
      
      // Extract vital statistics from <props>
      const propsNodes = charNode.getElementsByTagName('props')
      if (propsNodes.length > 0) {
        const propsNode = propsNodes[0] as HTMLElement
        crewMember.health = this.extractVitalStat(propsNode, 'Health')
        crewMember.food = this.extractVitalStat(propsNode, 'Food')
        crewMember.rest = this.extractVitalStat(propsNode, 'Rest')
        crewMember.mood = this.extractVitalStat(propsNode, 'Mood')
        crewMember.oxygen = this.extractVitalStat(propsNode, 'Oxygen')
        crewMember.temperature = this.extractVitalStat(propsNode, 'Temperature')
        crewMember.comfort = this.extractVitalStat(propsNode, 'Comfort', 100)
        crewMember.energy = this.extractVitalStat(propsNode, 'Energy', 100)
      }
      
      // Extract skills and jobs from <pers>
      const persNodes = charNode.getElementsByTagName('pers')
      if (persNodes.length > 0) {
        const persNode = persNodes[0] as HTMLElement
        crewMember.skills = this.extractSkills(persNode)
        crewMember.jobAssignments = this.extractJobAssignments(persNode)
      }
      
      crew.push(crewMember)
    })
    
    return crew
  }
  
  /**
   * @deprecated Use extractCharactersFromRoot instead.
   * Legacy method - kept for compatibility but no longer used.
   */
  private _extractCrew(shipElem: HTMLElement): CrewMember[] {
    const crew: CrewMember[] = []
    const charactersNodes = shipElem.getElementsByTagName('characters')
    
    if (charactersNodes.length === 0) return crew
    
    const charactersNode = charactersNodes[0] as HTMLElement
    const charNodes = Array.from(charactersNode.getElementsByTagName('c'))
    
    charNodes.forEach(charNode => {
      const htmlChar = charNode as HTMLElement
      const crewMember: CrewMember = {
        crewId: htmlChar.getAttribute('cid') || '',
        name: htmlChar.getAttribute('name') || 'Unknown',
        lastName: htmlChar.getAttribute('lname') || '',
        side: (htmlChar.getAttribute('side') as any) || 'Player',
        faction: htmlChar.getAttribute('fac') || '',
        x: this.safeFloat(htmlChar, 'x'),
        y: this.safeFloat(htmlChar, 'y'),
        currentTask: 'Idle',
        health: 100,
        food: 100,
        rest: 100,
        mood: 50,
        oxygen: 100,
        temperature: 100,
        skills: [],
        jobAssignments: [],
        schedule: {},
        inventory: []
      }
      
      // Extract vital statistics
      const propsNodes = charNode.getElementsByTagName('props')
      if (propsNodes.length > 0) {
        const propsNode = propsNodes[0] as HTMLElement
        const htmlProps = propsNode as HTMLElement
        crewMember.health = this.extractVitalStat(htmlProps, 'Health')
        crewMember.food = this.extractVitalStat(htmlProps, 'Food')
        crewMember.rest = this.extractVitalStat(htmlProps, 'Rest')
        crewMember.mood = this.extractVitalStat(htmlProps, 'Mood')
        crewMember.oxygen = this.extractVitalStat(htmlProps, 'Oxygen')
        crewMember.temperature = this.extractVitalStat(htmlProps, 'Temperature')
      }
      
      // Extract skills
      const persNodes = charNode.getElementsByTagName('pers')
      if (persNodes.length > 0) {
        const persNode = persNodes[0] as HTMLElement
        crewMember.skills = this.extractSkills(persNode)
        crewMember.jobAssignments = this.extractJobAssignments(persNode)
      }
      
      crew.push(crewMember)
    })
    
    return crew
  }
  
  /**
   * Extract characters from INSIDE a ship element.
   * These are crew members stationed on the ship.
   */
  private extractCharactersFromShip(shipElem: HTMLElement, _shipId: string): CrewMember[] {
    const crew: CrewMember[] = []
    
    // Look for <characters> container inside this ship
    const charactersNodes = shipElem.getElementsByTagName('characters')
    
    if (charactersNodes.length === 0) return crew
    
    const charactersNode = charactersNodes[0] as HTMLElement
    const charNodes = Array.from(charactersNode.getElementsByTagName('c'))
    
    charNodes.forEach(charNode => {
      const htmlChar = charNode as HTMLElement
      
      // Check if this is a craft/shuttle/fighter instead of crew
      // Crafts typically have "craft" attribute or lack personality data
      const isCraft = htmlChar.getAttribute('craft') === '1' || 
                     htmlChar.getAttribute('craftType') !== null ||
                     htmlChar.getAttribute('shuttleType') !== null
      
      // Skip crafts - they should not be in crew list
      if (isCraft) {
        console.log(`  ⏭️ Skipping craft: ${htmlChar.getAttribute('name') || htmlChar.getAttribute('cname')}`)
        return
      }
      
      const name = htmlChar.getAttribute('name') || 'Unknown'
      const lastName = htmlChar.getAttribute('lname') || ''
      
      // Additional craft detection: check if has no personality node
      const persNodes = charNode.getElementsByTagName('pers')
      const hasPersNode = persNodes.length > 0
      
      // If no personality node AND name patterns suggest it's a craft, skip it
      // Common craft naming: "BU1", "BU2", "SH1", "NX71BU2", etc.
      const craftNamePatterns = /^(BU\d+|SH\d+|NX\d+|Shuttle|Fighter|Craft)/i
      if (!hasPersNode && (craftNamePatterns.test(name) || name === 'Unknown')) {
        console.log(`  ⏭️ Skipping likely craft (no pers): ${name}`)
        return
      }
      
      const crewMember: CrewMember = {
        crewId: htmlChar.getAttribute('cid') || '',
        name,
        lastName,
        side: (htmlChar.getAttribute('side') as any) || 'Player',
        faction: htmlChar.getAttribute('fac') || '',
        x: this.safeFloat(htmlChar, 'x'),
        y: this.safeFloat(htmlChar, 'y'),
        currentTask: htmlChar.getAttribute('task') || 'Idle',
        health: 100,
        food: 100,
        rest: 100,
        mood: 50,
        oxygen: 100,
        temperature: 100,
        comfort: 100,
        energy: 100,
        skills: [],
        jobAssignments: [],
        schedule: {},
        inventory: []
      }
      
      // Extract vital statistics
      const propsNodes = charNode.getElementsByTagName('props')
      if (propsNodes.length > 0) {
        const propsNode = propsNodes[0] as HTMLElement
        crewMember.health = this.extractVitalStat(propsNode, 'Health')
        crewMember.food = this.extractVitalStat(propsNode, 'Food')
        crewMember.rest = this.extractVitalStat(propsNode, 'Rest')
        crewMember.mood = this.extractVitalStat(propsNode, 'Mood')
        crewMember.oxygen = this.extractVitalStat(propsNode, 'Oxygen')
        crewMember.temperature = this.extractVitalStat(propsNode, 'Temperature')
        crewMember.comfort = this.extractVitalStat(propsNode, 'Comfort', 100)
        crewMember.energy = this.extractVitalStat(propsNode, 'Energy', 100)
      }
      
      // Extract skills from personality node
      if (hasPersNode) {
        const persNode = persNodes[0] as HTMLElement
        crewMember.skills = this.extractSkills(persNode)
        crewMember.jobAssignments = this.extractJobAssignments(persNode)
      }
      
      crew.push(crewMember)
    })
    
    return crew
  }
  
  private extractVitalStat(propsNode: HTMLElement, statName: string, defaultValue = 100): number {
    const statNodes = propsNode.getElementsByTagName(statName)
    if (statNodes.length > 0) {
      const statNode = statNodes[0] as HTMLElement
      // Return raw value, NOT percentage!
      // The game stores absolute values like Health v="140"
      return this.safeFloat(statNode, 'v', defaultValue)
    }
    return defaultValue
  }
  
  private extractSkills(persNode: HTMLElement): Skill[] {
    const skills: Skill[] = []
    const attrNodes = persNode.getElementsByTagName('attr')
    
    if (attrNodes.length === 0) return skills
    
    const attrNode = attrNodes[0] as HTMLElement
    const skillNodes = Array.from(attrNode.getElementsByTagName('a'))
    skillNodes.forEach(skillNode => {
      const htmlSkill = skillNode as HTMLElement
      const skillId = this.safeInt(htmlSkill, 'id')
      const points = this.safeInt(htmlSkill, 'points')
      
      skills.push({
        skillId,
        skillName: this.getSkillName(skillId),
        level: points,
        experience: 0
      })
    })
    
    return skills
  }
  
  private extractJobAssignments(persNode: HTMLElement): JobAssignment[] {
    const jobs: JobAssignment[] = []
    const jobsNodes = persNode.getElementsByTagName('jobs')
    
    if (jobsNodes.length === 0) return jobs
    
    const jobsNode = jobsNodes[0] as HTMLElement
    const jobNodes = Array.from(jobsNode.getElementsByTagName('j'))
    jobNodes.forEach(jobNode => {
      const htmlJob = jobNode as HTMLElement
      const profession = htmlJob.getAttribute('profession') || 'Unknown'
      const priority = (htmlJob.getAttribute('priority') as any) || 'Medium'
      
      jobs.push({
        profession,
        priority
      })
    })
    
    return jobs
  }
  
  // ==========================================================================
  // STAR SYSTEM & FACTION EXTRACTION
  // ==========================================================================
  
  private extractStarSystems(root: HTMLElement): StarSystem[] {
    const systems: StarSystem[] = []
    const starmapNodes = root.getElementsByTagName('starmap')
    
    if (starmapNodes.length === 0) return systems
    
    const starmapNode = starmapNodes[0] as HTMLElement
    const systemsContainers = starmapNode.getElementsByTagName('systems')
    if (systemsContainers.length === 0) return systems
    
    const systemsContainer = systemsContainers[0] as HTMLElement
    const systemNodes = Array.from(systemsContainer.getElementsByTagName('l'))
    
    systemNodes.forEach(sysNode => {
      const htmlSys = sysNode as HTMLElement
      const system: StarSystem = {
        systemId: this.safeInt(htmlSys, 'systemId'),
        systemName: this.decodeHex(htmlSys.getAttribute('sn') || ''),
        systemType: this.safeAttr(htmlSys, 'stype', 'Unknown'),
        x: this.safeFloat(htmlSys, 'x'),
        y: this.safeFloat(htmlSys, 'y'),
        visited: htmlSys.getAttribute('gen') === '1',
        resources: [],
        stations: [],
        fleets: []
      }
      
      systems.push(system)
    })
    
    return systems
  }
  
  /**
   * Extract faction diplomatic relations from <hostmap>
   */
  private extractFactionRelations(root: HTMLElement): FactionRelation[] {
    const relations: FactionRelation[] = []
    const hostmapNodes = root.getElementsByTagName('hostmap')
    
    if (hostmapNodes.length === 0) {
      console.log('⚠️ No <hostmap> element found')
      return relations
    }
    
    const hostmapNode = hostmapNodes[0] as HTMLElement
    const hostNodes = Array.from(hostmapNode.getElementsByTagName('h'))
    
    console.log(`Found ${hostNodes.length} faction relationships`)
    
    hostNodes.forEach(hostNode => {
      const htmlHost = hostNode as HTMLElement
      const s1 = htmlHost.getAttribute('s1') || ''
      const s2 = htmlHost.getAttribute('s2') || ''
      const stance = htmlHost.getAttribute('stance') || 'neutral'
      const relationship = this.safeFloat(htmlHost, 'relationship', 0)
      
      if (s1 && s2) {
        relations.push({
          faction1: s1,
          faction2: s2,
          stance: this.normalizeStance(stance),
          relationshipValue: relationship
        })
      }
    })
    
    return relations
  }
  
  private normalizeStance(stance: string): 'allied' | 'friendly' | 'neutral' | 'hostile' {
    const lower = stance.toLowerCase()
    if (lower.includes('ally') || lower.includes('allied')) return 'allied'
    if (lower.includes('friend')) return 'friendly'
    if (lower.includes('hostile') || lower.includes('enemy')) return 'hostile'
    return 'neutral'
  }
  
  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================
  
  private safeInt(elem: HTMLElement | null, attr: string, defaultValue: number = 0): number {
    if (!elem) return defaultValue
    const value = elem.getAttribute(attr)
    return value ? parseInt(value) : defaultValue
  }
  
  private safeFloat(elem: HTMLElement | null, attr: string, defaultValue: number = 0): number {
    if (!elem) return defaultValue
    const value = elem.getAttribute(attr)
    return value ? parseFloat(value) : defaultValue
  }
  
  private safeAttr(elem: HTMLElement | null, attr: string, defaultValue: string = ''): string {
    if (!elem) return defaultValue
    return elem.getAttribute(attr) || defaultValue
  }
  
  private getItemName(itemId: string, defaultValue: string): string {
    return this.config.itemMappings[itemId] || defaultValue
  }
  
  private getSkillName(skillId: number): string {
    return this.config.skillMappings[skillId] || `Unknown Skill ${skillId}`
  }
  
  private decodeHex(hexString: string): string {
    try {
      // Hex-encoded strings in save file
      const bytes: number[] = []
      for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16))
      }
      return new TextDecoder().decode(new Uint8Array(bytes))
    } catch {
      return hexString
    }
  }
}

// Export singleton instance
export const gameParser = new SpaceHavenParser()
