/**
 * Space Haven Save File Parser
 * Extracts hierarchical game data from XML save files
 */

import type {
  GameSession,
  Ship,
  CrewMember,
  JobAssignment,
  InventoryItem,
  ConsumableItem,
  StarSystem,
  CelestialBody,
  SystemResource,
  FactionRelation,
  ParserConfig,
  Skill,
  Attribute
} from '../types/gameData'
import type { Element as GameElement } from '../types/gameData'
import { DEFAULT_SKILL_MAPPINGS } from '../types/gameData'

export class SpaceHavenParser {
  private config: ParserConfig
  
  constructor(config?: Partial<ParserConfig>) {
    this.config = {
      attributeMappings: config?.attributeMappings || {},
      skillMappings: config?.skillMappings || DEFAULT_SKILL_MAPPINGS,
      itemMappings: config?.itemMappings || {},
      traitMappings: config?.traitMappings || {},
      occupationMappings: config?.occupationMappings || {},
      elementMaxValues: config?.elementMaxValues || {},
      crewVitalMaxValues: config?.crewVitalMaxValues || {}
    }
  }
  
  /**
   * Load element and crew max values from id_mappings.xml
   * This provides the reference dictionary for calculating health/stat percentages
   */
  async loadMaxValueMappings(): Promise<void> {
    try {
      const response = await fetch('/id_mappings.xml')
      if (!response.ok) {
        console.warn('⚠️ Could not load id_mappings.xml - using defaults')
        return
      }
      
      const xmlText = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      
      // Parse element max values
      const elementNodes = xmlDoc.querySelectorAll('elementMaxValues > element')
      elementNodes.forEach(node => {
        const htmlNode = node as HTMLElement
        const moduleType = parseInt(htmlNode.querySelector('moduleType')?.textContent || '0')
        const name = htmlNode.querySelector('name')?.textContent || 'Unknown'
        const maxHullHealth = parseInt(htmlNode.querySelector('maxHullHealth')?.textContent || '12')
        const maxShieldStrength = parseInt(htmlNode.querySelector('maxShieldStrength')?.textContent || '32')
        const notes = htmlNode.querySelector('notes')?.textContent || undefined

        this.config.elementMaxValues[moduleType] = {
          moduleType,
          name,
          maxHullHealth,
          maxShieldStrength,
          notes
        }
      })
      
      // Parse crew vital max values
      const vitalNodes = xmlDoc.querySelectorAll('crewVitalMaxValues > vital')
      vitalNodes.forEach(node => {
        const htmlNode = node as HTMLElement
        const stat = htmlNode.querySelector('stat')?.textContent || ''
        const baseMax = parseInt(htmlNode.querySelector('baseMax')?.textContent || '100')
        const observedMaxText = htmlNode.querySelector('observedMax')?.textContent
        const observedMax = observedMaxText === 'null' ? null : parseInt(observedMaxText || '100')
        const notes = htmlNode.querySelector('notes')?.textContent || undefined

        this.config.crewVitalMaxValues[stat.toLowerCase()] = {
          stat,
          baseMax,
          observedMax,
          notes
        }
      })
      
      console.log(`✓ Loaded element max values for ${Object.keys(this.config.elementMaxValues).length} module types`)
      console.log(`✓ Loaded crew vital max values for ${Object.keys(this.config.crewVitalMaxValues).length} stats`)
    } catch (error) {
      console.error('❌ Error loading id_mappings.xml:', error)
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
    
    // Create game session
    const gameSession: GameSession = {
      saveFileName: fileName,
      timestamp,
      gameMode,
      daysSurvived,
      ships: [],
      starSystems: [],
      factionRelations: [],
      researchProgress: {}
    }
    
    // Extract hierarchical components
    console.log(`\n🔍 Beginning extraction...`)
    
    // CRITICAL: Build ship-to-system mapping from starmap before extracting ships
    const shipSystemMap = this.buildShipSystemMap(root)
    
    // Extract ships and assign crew from each ship's <characters> section
    gameSession.ships = this.extractShips(root, shipSystemMap)
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
  // @ts-expect-error - Kept for backwards compatibility but not currently used
  private detectPlayerFaction(): string {
    return 'Unknown'
  }
  
  // ==========================================================================
  // SHIP-TO-SYSTEM MAPPING
  // ==========================================================================
  
  /**
   * Build a mapping of shipId -> systemId from the starmap structure
   * Ships are nested as: <starmap><systems><l systemId="31"><sectors><l><fleets><f><createdShips><l createdShipId="43"/>
   */
  private buildShipSystemMap(root: HTMLElement): Map<string, string | number> {
    const shipSystemMap = new Map<string, string | number>()
    
    const starmapNodes = root.getElementsByTagName('starmap')
    if (starmapNodes.length === 0) {
      console.log('⚠️ No <starmap> element found - ships will not have system associations')
      return shipSystemMap
    }
    
    const starmapNode = starmapNodes[0] as HTMLElement
    const systemsContainers = starmapNode.getElementsByTagName('systems')
    if (systemsContainers.length === 0) {
      console.log('⚠️ No <systems> element in starmap')
      return shipSystemMap
    }
    
    const systemsContainer = systemsContainers[0] as HTMLElement
    const systemNodes = Array.from(systemsContainer.getElementsByTagName('l'))
    
    systemNodes.forEach(systemNode => {
      const systemElem = systemNode as HTMLElement
      const systemIdAttr = systemElem.getAttribute('systemId')
      if (!systemIdAttr) return
      
      // Parse systemId as integer to match StarSystem.systemId type
      const systemId = parseInt(systemIdAttr, 10)
      if (isNaN(systemId)) return
      
      // Find all created ships within this system (in fleets)
      const fleetNodes = systemElem.getElementsByTagName('f')
      Array.from(fleetNodes).forEach(fleetNode => {
        const fleetElem = fleetNode as HTMLElement
        const shipNodes = fleetElem.getElementsByTagName('l')  // Ships in <createdShips><l>
        Array.from(shipNodes).forEach(shipNode => {
          const shipElem = shipNode as HTMLElement
          const createdShipId = shipElem.getAttribute('createdShipId')
          if (createdShipId) {
            shipSystemMap.set(createdShipId, systemId)
          }
        })
      })
    })
    
    console.log(`🗺️ Built ship-to-system mapping: ${shipSystemMap.size} ships mapped to systems`)
    return shipSystemMap
  }
  
  // ==========================================================================
  // SHIP & ELEMENT EXTRACTION
  // ==========================================================================
  
  private extractShips(root: HTMLElement, shipSystemMap: Map<string, string | number>): Ship[] {
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
      // Characters are in <characters> tag, crafts are in separate <crafts> tag
      const shipCrew = this.extractCharactersFromShip(shipElem)
      
      // Determine ownership from <settings> tag
      // 'owner' attribute = owner TYPE ("Player", "Civilian", "Pirate", etc.)
      // 'of' attribute = owner faction ID (numeric identifier)
      // CRITICAL: Use querySelectorAll with :scope to get ONLY direct child <settings>,
      // not nested <settings> tags that may exist inside the main settings tag
      let ownerType = 'Unknown'
      let ownerId = 'unknown'
      let isPlayerOwned = false
      const settingsNodes = shipElem.querySelectorAll(':scope > settings')
      if (settingsNodes.length > 0) {
        const settingsNode = settingsNodes[0] as HTMLElement
        ownerType = settingsNode.getAttribute('owner') || 'Unknown'
        ownerId = settingsNode.getAttribute('of') || 'unknown'
        isPlayerOwned = ownerType === 'Player'  // Player-controlled ships have owner="Player"
      }
      
      // Look up system ID from starmap (ships don't have direct systemId attribute)
      const systemIdValue = shipSystemMap.get(shipId)
      const systemId = typeof systemIdValue === 'number' ? systemIdValue : undefined
      
      const ship: Ship = {
        shipId,
        shipName: shipElem.getAttribute('sname') || `Ship_${shipId}`,
        shipType: this.inferShipType(shipElem),
        positionX: this.safeFloat(shipElem, 'sx'),
        positionY: this.safeFloat(shipElem, 'sy'),
        systemId: systemId,  // Looked up from starmap structure
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
      
      // Calculate ship metrics
      ship.metrics = this.calculateShipMetrics(ship)
      
      // Assign crew from <characters> section only
      ship.crew = shipCrew
      const playerCrewCount = ship.crew.filter(c => c.side === 'Player').length
      console.log(`  ├─ Crew: ${ship.crew.length} (Player: ${playerCrewCount})`)
      console.log(`  └─ Owner: ${isPlayerOwned ? '🎮 Player' : `⚪ ${ownerId}`}`)
      
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
      
      // CRITICAL: Skip unconstructed/empty hull sections (m="-2" or negative)
      // These represent planned but not-yet-built sections of the ship
      if (moduleType < 0) {
        return  // Skip this element
      }
      
      // Get human-readable name from ID mapper
      const moduleName = this.getItemName(moduleType.toString(), `Element_${moduleType}`)
      
      // Extract raw attributes from XML - no calculations or assumptions
      const hullHealth = elemHtml.hasAttribute('ht') ? this.safeInt(elemHtml, 'ht') : undefined
      const shieldStrength = elemHtml.hasAttribute('sh') ? this.safeInt(elemHtml, 'sh') : undefined
      
      // Get max values from mappings for this module type
      const maxValues = this.config.elementMaxValues[moduleType]
      const maxHullHealth = maxValues?.maxHullHealth
      const maxShieldStrength = maxValues?.maxShieldStrength
      
      // Calculate percentages if we have both current and max values
      const hullHealthPercent = (hullHealth !== undefined && maxHullHealth) 
        ? (hullHealth / maxHullHealth) * 100 
        : undefined
      const shieldStrengthPercent = (shieldStrength !== undefined && maxShieldStrength)
        ? (shieldStrength / maxShieldStrength) * 100
        : undefined
      
      const element: GameElement = {
        elementId: moduleType,
        x,
        y,
        moduleType,
        moduleName,
        hullHealth,
        maxHullHealth,
        hullHealthPercent,
        shieldStrength,
        maxShieldStrength,
        shieldStrengthPercent,
        inventory: [],
        consumableInventory: []
      }
      
      // Extract inventory from nested <l> node if it exists
      const lNodes = elemNode.getElementsByTagName('l')
      if (lNodes.length > 0) {
        const lNode = lNodes[0] as HTMLElement
        element.inventory = this.extractInventory(lNode, moduleName)
        element.consumableInventory = this.extractConsumableInventory(lNode)
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
      const itemId = htmlSlot.getAttribute('elementaryId') || ''
      const quantity = this.safeInt(htmlSlot, 'inStorage')
      
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
  
  private extractConsumableInventory(lNode: HTMLElement): ConsumableItem[] {
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
  // @ts-expect-error - Legacy method kept for backwards compatibility
  private _extractCharactersFromRoot(): CrewMember[] {
    return []
  }

  // @ts-expect-error - Legacy method kept for backwards compatibility
  private _legacyExtractCharactersFromRoot(): CrewMember[] {
    return []
  }

  /**
   * @deprecated Use extractCharactersFromRoot instead.
   * Legacy method - kept for compatibility but no longer used.
   */
  // @ts-expect-error - Legacy method kept for backwards compatibility
  private _extractCrew(): CrewMember[] {
    return []
  }
  
  /**
   * Extract characters from INSIDE a ship element.
   * These are crew members stationed on the ship.
   * 
   * NOTE: Crafts are in a separate <crafts> tag, NOT in <characters>.
   * We only extract from <characters> here, so no craft filtering needed.
   */
  private extractCharactersFromShip(shipElem: HTMLElement): CrewMember[] {
    const crew: CrewMember[] = []
    
    // Look for <characters> container inside this ship
    // This should ONLY contain actual crew members, not crafts
    const charactersNodes = shipElem.getElementsByTagName('characters')
    
    if (charactersNodes.length === 0) return crew
    
    const charactersNode = charactersNodes[0] as HTMLElement
    // IMPORTANT: Only get DIRECT child <c> tags, not nested ones (conditions, prefs, etc.)
    // Use querySelectorAll with :scope to get only immediate children
    const charNodes = Array.from(charactersNode.querySelectorAll(':scope > c'))
    
    charNodes.forEach(charNode => {
      const htmlChar = charNode as HTMLElement
      
      const name = htmlChar.getAttribute('name') || 'Unknown'
      const lastName = htmlChar.getAttribute('lname') || ''
      
      const crewMember: CrewMember = {
        crewId: htmlChar.getAttribute('entId') || '',
        name,
        lastName,
        side: (htmlChar.getAttribute('side') as 'Player' | 'Civilian' | 'Hostile') || 'Player',
        faction: htmlChar.getAttribute('fac') || '',
        x: this.safeFloat(htmlChar, 'x'),
        y: this.safeFloat(htmlChar, 'y'),
        currentTask: htmlChar.getAttribute('task') || 'Idle',
        health: 100,
        food: 100,
        rest: 100,
        mood: 50,
        oxygen: 0,
        temperature: 100,
        comfort: 100,
        energy: 100,
        attributes: [],
        skills: [],
        jobAssignments: [],
        schedule: {},
        inventory: []
      }
      
      // Extract vital statistics
      const propsNodes = htmlChar.getElementsByTagName('props')
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
      
      // Extract attributes, skills, and jobs from <pers>
      const persNodes = htmlChar.getElementsByTagName('pers')
      if (persNodes.length > 0) {
        const persNode = persNodes[0] as HTMLElement
        crewMember.attributes = this.extractAttributes(persNode)
        crewMember.skills = this.extractSkills(persNode)
        crewMember.jobAssignments = this.extractJobAssignments(persNode)
      }
      
      crew.push(crewMember)
    })
    
    return crew
  }
  
  private extractVitalStat(propsNode: HTMLElement, statName: string, defaultValue = 100): number {
    // Try case-sensitive first
    const statNodes = propsNode.getElementsByTagName(statName)
    
    // If not found, try case-insensitive search (oxygen might be lowercase)
    if (statNodes.length === 0) {
      const allChildren = Array.from(propsNode.children)
      const found = allChildren.find(child => 
        child.tagName.toLowerCase() === statName.toLowerCase()
      )
      if (found) {
        // Special handling for Oxygen: use 'oxs' attribute (oxygen suit/storage out of 1000)
        if (statName.toLowerCase() === 'oxygen') {
          return this.safeFloat(found as HTMLElement, 'oxs', 0)
        }
        return this.safeFloat(found as HTMLElement, 'v', defaultValue)
      }
    }
    
    if (statNodes.length > 0) {
      const statNode = statNodes[0] as HTMLElement
      
      // Special handling for Oxygen: use 'oxs' attribute (oxygen suit/storage out of 1000)
      // - oxs=0: crew is breathing ship air (inside pressurized area)
      // - oxs=970-1000: crew has personal oxygen reserve (spacesuit/tank)
      if (statName.toLowerCase() === 'oxygen') {
        return this.safeFloat(statNode, 'oxs', 0)
      }
      
      // Return raw value, NOT percentage!
      // The game stores absolute values like Health v="140"
      return this.safeFloat(statNode, 'v', defaultValue)
    }
    return defaultValue
  }
  
  private extractAttributes(persNode: HTMLElement): Attribute[] {
    const attributes: Attribute[] = []
    const attrNodes = persNode.getElementsByTagName('attr')
    
    if (attrNodes.length === 0) return attributes
    
    const attrNode = attrNodes[0] as HTMLElement
    const attrElements = Array.from(attrNode.getElementsByTagName('a'))
    attrElements.forEach(attrElement => {
      const htmlAttr = attrElement as HTMLElement
      const attributeId = this.safeInt(htmlAttr, 'id')
      const points = this.safeInt(htmlAttr, 'points')
      
      attributes.push({
        attributeId,
        attributeName: this.getAttributeName(attributeId),
        points
      })
    })
    
    return attributes
  }

  private extractSkills(persNode: HTMLElement): Skill[] {
    const skills: Skill[] = []
    const skillsNodes = persNode.getElementsByTagName('skills')
    
    if (skillsNodes.length === 0) return skills
    
    const skillsNode = skillsNodes[0] as HTMLElement
    const skillElements = Array.from(skillsNode.getElementsByTagName('s'))
    skillElements.forEach(skillElement => {
      const htmlSkill = skillElement as HTMLElement
      const skillId = this.safeInt(htmlSkill, 'sk')
      const level = this.safeInt(htmlSkill, 'level')
      const maxNatural = this.safeInt(htmlSkill, 'mxn')
      const experience = this.safeInt(htmlSkill, 'exp')
      
      skills.push({
        skillId,
        skillName: this.getSkillName(skillId),
        level,
        maxNatural,
        experience
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
      const priorityAttr = htmlJob.getAttribute('priority') || 'Medium'
      const priority = ['High', 'Medium', 'Low'].includes(priorityAttr) ? (priorityAttr as 'High' | 'Medium' | 'Low') : 'Medium'
      
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
      
      // Extract visited status from 'gen' attribute (gen="1" means generated/visited)
      const visited = htmlSys.getAttribute('gen') === '1'
      
      const systemId = this.safeInt(htmlSys, 'systemId')
      
      const system: StarSystem = {
        systemId,
        systemName: this.decodeHex(htmlSys.getAttribute('sn') || ''),
        systemType: this.safeAttr(htmlSys, 'stype', 'Unknown'),
        x: this.safeFloat(htmlSys, 'x'),
        y: this.safeFloat(htmlSys, 'y'),
        visited,
        bodies: this.extractCelestialBodies(htmlSys, systemId),
        resources: [],
        stations: [],
        fleets: []
      }
      
      systems.push(system)
    })
    
    return systems
  }

  /**
   * Extract celestial bodies (stars, planets, asteroid fields) from a system
   */
  private extractCelestialBodies(systemNode: HTMLElement, systemId: number): CelestialBody[] {
    const bodies: CelestialBody[] = []
    const bodiesContainers = systemNode.querySelectorAll(':scope > bodies')
    
    if (bodiesContainers.length === 0) return bodies
    
    const bodiesContainer = bodiesContainers[0] as HTMLElement
    const bodyNodes = Array.from(bodiesContainer.querySelectorAll(':scope > l'))
    
    bodyNodes.forEach(bodyNode => {
      const htmlBody = bodyNode as HTMLElement
      const bodyType = htmlBody.getAttribute('type') || 'Unknown'
      
      // Extract visited status from nested <info> tag
      const infoNodes = htmlBody.getElementsByTagName('info')
      const visited = infoNodes.length > 0 && infoNodes[0].getAttribute('visited') === 'true'
      
      // Extract resources from <stuff> section
      const resources: SystemResource[] = []
      const stuffNodes = htmlBody.getElementsByTagName('stuff')
      if (stuffNodes.length > 0) {
        const stuffNode = stuffNodes[0] as HTMLElement
        const resourceNodes = Array.from(stuffNode.getElementsByTagName('s'))
        resourceNodes.forEach(resNode => {
          const htmlRes = resNode as HTMLElement
          if (htmlRes.getAttribute('type') === 'Resource') {
            const elementId = htmlRes.getAttribute('elementId') || ''
            const quantity = this.safeInt(htmlRes, 'howMuch', 0)
            if (elementId && quantity > 0) {
              resources.push({
                resourceId: elementId,
                resourceName: this.getItemName(elementId, `Resource ${elementId}`),
                quantity
              })
            }
          }
        })
      }
      
      const body: CelestialBody = {
        bodyId: this.safeInt(htmlBody, 'id'),
        bodyType: bodyType as CelestialBody['bodyType'],
        systemId,
        x: this.safeFloat(htmlBody, 'x'),
        y: this.safeFloat(htmlBody, 'y'),
        visited,
        resources,
        seed: htmlBody.getAttribute('seed') || undefined
      }
      
      // Add star-specific fields
      if (bodyType === 'Star') {
        body.starType = htmlBody.getAttribute('starType') || undefined
        body.starClass = htmlBody.getAttribute('starClass') || undefined
      }
      
      bodies.push(body)
    })
    
    return bodies
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
  // SHIP METRICS CALCULATION
  // ==========================================================================
  
  private calculateShipMetrics(ship: Ship): import('../types/gameData').ShipMetrics {
    const elements = ship.elements
    const totalElements = elements.length
    
    if (totalElements === 0) {
      return {
        hullIntegrity: 100,
        damagedComponentCount: 0,
        criticalComponentCount: 0,
        powerEfficiency: 100,
        shieldCoverage: 0,
        storageUtilization: 0,
        criticalShortages: [],
        overstockedItems: [],
        productionQueueSize: 0,
        itemsProducedPerDay: 0
      }
    }
    
    // Calculate hull integrity using the percentage values from id_mappings.xml
    // Each element has hullHealthPercent calculated from (current / max) * 100
    // We average the percentages of all elements that have health tracking
    let elementsWithHealth = 0
    let totalHealthPercent = 0
    
    elements.forEach(elem => {
      if (elem.hullHealthPercent !== undefined) {
        elementsWithHealth++
        totalHealthPercent += elem.hullHealthPercent
      }
    })
    
    // Average hull health percentage across all elements with health tracking
    const hullIntegrity = elementsWithHealth > 0 ? totalHealthPercent / elementsWithHealth : 100
    
    // Calculate power efficiency
    const totalPower = ship.powerGrid.generators.reduce((sum, g) => sum + (g.powerOutput || 0), 0)
    const totalDemand = ship.powerGrid.consumers.reduce((sum, c) => sum + (c.powerDemand || 0), 0)
    const powerEfficiency = totalDemand > 0 ? (totalPower / totalDemand) * 100 : 100
    
    return {
      hullIntegrity,
      damagedComponentCount: 0,  // Can't determine without health thresholds defined
      criticalComponentCount: 0,  // Can't determine without health thresholds defined
      powerEfficiency,
      shieldCoverage: 0, // TODO: Calculate from shield elements
      storageUtilization: 0, // TODO: Calculate from storage rules
      criticalShortages: [],
      overstockedItems: [],
      productionQueueSize: ship.resourceManager.productionQueue.length,
      itemsProducedPerDay: 0 // TODO: Calculate from production queue
    }
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
  
  private getAttributeName(attributeId: number): string {
    return this.config.attributeMappings[attributeId] || `Unknown Attribute ${attributeId}`
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

// Export singleton instance (uses default mappings)
export const gameParser = new SpaceHavenParser()

/**
 * Create a parser instance with loaded id_mappings.xml
 * This should be the preferred way to create parsers going forward
 */
export async function createParserWithMappings(): Promise<SpaceHavenParser> {
  const { getParserConfig } = await import('./mappingsLoader')
  const config = await getParserConfig()
  const parser = new SpaceHavenParser(config)
  
  // Load element and crew max values from id_mappings.xml
  await parser.loadMaxValueMappings()
  
  return parser
}
