/**
 * Comprehensive Space Haven XML Extraction Utilities
 * Converted from Python analysis code to TypeScript for web application
 * 
 * These utilities provide robust, type-safe extraction of game data
 * with proper error handling and fallback values.
 */

import type {
  Ship,
  CrewMember,
  StarSystem,
  FactionRelation,
  SystemResource,
  Element as _GameElement,
  ShipMetrics,
  CrewMetrics
} from '../types/gameData'

// ============================================================================
// SAFE XML PARSING UTILITIES
// ============================================================================

/**
 * Safely extract attribute from XML element, returning default if missing
 */
export function safeGet(element: Element | null, key: string, defaultValue: string = ''): string {
  if (!element) return defaultValue
  return (element as HTMLElement).getAttribute(key) || defaultValue
}

/**
 * Convert value to int, returning default on failure
 */
export function safeInt(value: string | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Convert value to float, returning default on failure
 */
export function safeFloat(value: string | null | undefined, defaultValue: number = 0.0): number {
  if (value === null || value === undefined || value === '') return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Safely find XML element by path, returning null if not found
 */
export function findElementSafe(root: HTMLElement, selector: string): HTMLElement | null {
  try {
    const elements = root.getElementsByTagName(selector)
    return elements.length > 0 ? (elements[0] as HTMLElement) : null
  } catch (e) {
    console.warn(`Could not find element: ${selector}`, e)
    return null
  }
}

/**
 * Safely find all XML elements matching selector, returning empty array if error
 */
export function findAllElementsSafe(root: HTMLElement, selector: string): HTMLElement[] {
  try {
    const elements = root.getElementsByTagName(selector)
    return Array.from(elements) as HTMLElement[]
  } catch (e) {
    console.warn(`Could not findAll for selector: ${selector}`, e)
    return []
  }
}

// ============================================================================
// FACTION DIPLOMACY EXTRACTION
// ============================================================================

/**
 * Extract faction relationship data from <hostmap> block
 */
export function extractFactionDiplomacy(root: HTMLElement): FactionRelation[] {
  const relations: FactionRelation[] = []
  
  const hostmap = findElementSafe(root, 'hostmap')
  if (!hostmap) {
    console.warn('⚠️ No <hostmap> element found')
    return relations
  }
  
  const hostElements = findAllElementsSafe(hostmap, 'h')
  console.log(`Found ${hostElements.length} faction relationships`)
  
  hostElements.forEach(hElem => {
    const s1 = safeGet(hElem, 's1')
    const s2 = safeGet(hElem, 's2')
    const stance = safeGet(hElem, 'stance', 'neutral')
    const relationship = safeFloat(hElem.getAttribute('relationship'), 0.0)
    
    if (s1 && s2) {
      relations.push({
        faction1: s1,
        faction2: s2,
        stance: normalizeStance(stance),
        relationshipValue: relationship
      })
    }
  })
  
  return relations
}

function normalizeStance(stance: string): 'allied' | 'friendly' | 'neutral' | 'hostile' {
  const lower = stance.toLowerCase()
  if (lower.includes('ally') || lower.includes('allied')) return 'allied'
  if (lower.includes('friend')) return 'friendly'
  if (lower.includes('hostile') || lower.includes('enemy')) return 'hostile'
  return 'neutral'
}

// ============================================================================
// STARMAP SYSTEM EXTRACTION
// ============================================================================

/**
 * Extract all star systems and their resources from <starmap> block
 */
export function extractStarSystems(root: HTMLElement): { systems: StarSystem[], resources: SystemResource[] } {
  const systems: StarSystem[] = []
  const allResources: SystemResource[] = []
  
  const starmap = findElementSafe(root, 'starmap')
  if (!starmap) {
    console.warn('⚠️ No <starmap> element found')
    return { systems, resources: allResources }
  }
  
  const systemsContainer = findElementSafe(starmap, 'systems')
  if (!systemsContainer) {
    return { systems, resources: allResources }
  }
  
  const systemElements = findAllElementsSafe(systemsContainer, 'l')
  console.log(`Found ${systemElements.length} star systems`)
  
  systemElements.forEach(sysElem => {
    const systemId = safeInt(sysElem.getAttribute('systemId'))
    const systemName = decodeHex(safeGet(sysElem, 'sn', `System_${systemId}`))
    const systemType = safeGet(sysElem, 'stype', 'Unknown')
    const x = safeFloat(sysElem.getAttribute('x'))
    const y = safeFloat(sysElem.getAttribute('y'))
    const visited = safeGet(sysElem, 'gen') === '1'
    
    // Extract resources for this system
    const resourceElements = findAllElementsSafe(sysElem, 's')
    const systemResources: SystemResource[] = []
    
    resourceElements.forEach(resElem => {
      const type = safeGet(resElem, 'type')
      if (type === 'Resource') {
        const resourceId = safeGet(resElem, 'elementId', 'unknown')
        const quantity = safeFloat(resElem.getAttribute('howMuch'), 0.0)
        
        systemResources.push({
          resourceId,
          resourceName: resourceId, // TODO: Map to human-readable name
          quantity
        })
      }
    })
    
    systems.push({
      systemId,
      systemName,
      systemType,
      x,
      y,
      visited,
      resources: systemResources,
      stations: [],
      fleets: []
    })
    
    allResources.push(...systemResources)
  })
  
  return { systems, resources: allResources }
}

// ============================================================================
// SHIP HEALTH & METRICS CALCULATION
// ============================================================================

/**
 * Calculate comprehensive ship metrics
 */
export function calculateShipMetrics(ship: Ship): ShipMetrics {
  const totalElements = ship.elements.length
  
  if (totalElements === 0) {
    return {
      hullIntegrity: 100,
      damagedComponentCount: 0,
      criticalComponentCount: 0,
      powerEfficiency: 100,
      lifeSupportStatus: 'Good',
      shieldCoverage: 0,
      storageUtilization: 0,
      criticalShortages: [],
      overstockedItems: [],
      productionQueueSize: 0,
      itemsProducedPerDay: 0
    }
  }
  
  const operationalElements = ship.elements.filter(e => e.status === 'Operational').length
  const damagedElements = ship.elements.filter(e => e.status === 'Damaged').length
  const criticalElements = ship.elements.filter(e => e.status === 'Critical').length
  
  const hullIntegrity = Math.round((operationalElements / totalElements) * 100)
  
  // Calculate power efficiency
  const { totalPower, totalConsumption } = ship.powerGrid
  const powerEfficiency = totalPower > 0 
    ? Math.round((Math.min(totalConsumption, totalPower) / totalPower) * 100)
    : 100
  
  // Assess life support (based on operational systems)
  let lifeSupportStatus: 'Good' | 'Warning' | 'Critical' = 'Good'
  if (hullIntegrity < 30) lifeSupportStatus = 'Critical'
  else if (hullIntegrity < 60) lifeSupportStatus = 'Warning'
  
  // Calculate shield coverage
  const shieldedElements = ship.elements.filter(e => e.shieldStrength > 0).length
  const shieldCoverage = Math.round((shieldedElements / totalElements) * 100)
  
  return {
    hullIntegrity,
    damagedComponentCount: damagedElements,
    criticalComponentCount: criticalElements,
    powerEfficiency,
    lifeSupportStatus,
    shieldCoverage,
    storageUtilization: 0, // TODO: Calculate from inventory
    criticalShortages: [],
    overstockedItems: [],
    productionQueueSize: ship.resourceManager.productionQueue.length,
    itemsProducedPerDay: 0
  }
}

// ============================================================================
// CREW WELLNESS CALCULATION
// ============================================================================

/**
 * Calculate individual crew member wellness score (0-100)
 * Handles raw game values which can exceed 100
 */
export function calculateCrewWellness(crew: CrewMember): number {
  // Normalize vital stats to 0-100 scale
  // Game stores raw values (Health can be 140, Food 100, etc.)
  const normalizeVital = (value: number, max: number = 100): number => {
    return Math.min(100, Math.max(0, (value / max) * 100))
  }
  
  const healthNorm = normalizeVital(crew.health, 140) // Health can go up to 140
  const foodNorm = normalizeVital(crew.food, 100)
  const restNorm = normalizeVital(crew.rest, 100)
  const moodNorm = normalizeVital(crew.mood, 100)
  const oxygenNorm = normalizeVital(crew.oxygen, 100)
  const tempNorm = 100 - Math.abs(crew.temperature - 20) * 2 // Ideal temp is ~20°C
  
  // Weighted average
  const weights = {
    health: 0.3,
    food: 0.2,
    rest: 0.2,
    mood: 0.15,
    oxygen: 0.1,
    temperature: 0.05
  }
  
  const wellness = 
    healthNorm * weights.health +
    foodNorm * weights.food +
    restNorm * weights.rest +
    moodNorm * weights.mood +
    oxygenNorm * weights.oxygen +
    tempNorm * weights.temperature
  
  return Math.round(wellness)
}

/**
 * Get wellness status category
 */
export function getWellnessStatus(wellness: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
  if (wellness >= 90) return 'excellent'
  if (wellness >= 75) return 'good'
  if (wellness >= 50) return 'fair'
  if (wellness >= 25) return 'poor'
  return 'critical'
}

/**
 * Calculate crew metrics for a ship
 */
export function calculateCrewMetrics(ship: Ship): CrewMetrics {
  const playerCrew = ship.crew.filter(c => c.side === 'Player')
  const totalCrew = playerCrew.length
  
  if (totalCrew === 0) {
    return {
      totalCrew: 0,
      crewByStatus: {},
      averageWellness: 0,
      skillCoverage: {},
      criticalSkillGaps: [],
      tasksPerCrewMember: {},
      overworkedCrew: [],
      idleCrew: []
    }
  }
  
  // Calculate wellness for each crew member
  const crewByStatus: Record<string, number> = {}
  let totalWellness = 0
  
  playerCrew.forEach(crew => {
    const wellness = calculateCrewWellness(crew)
    totalWellness += wellness
    
    const status = getWellnessStatus(wellness)
    crewByStatus[status] = (crewByStatus[status] || 0) + 1
  })
  
  // Calculate skill coverage
  const skillCoverage: Record<string, number> = {}
  playerCrew.forEach(crew => {
    crew.skills.forEach(skill => {
      skillCoverage[skill.skillName] = (skillCoverage[skill.skillName] || 0) + 1
    })
  })
  
  return {
    totalCrew,
    crewByStatus,
    averageWellness: Math.round(totalWellness / totalCrew),
    skillCoverage,
    criticalSkillGaps: [], // TODO: Identify missing critical skills
    tasksPerCrewMember: {},
    overworkedCrew: [],
    idleCrew: []
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Decode hex-encoded strings from save file
 */
export function decodeHex(hexString: string): string {
  if (!hexString || hexString.length === 0) return ''
  
  try {
    // Check if it's actually hex
    if (!/^[0-9A-Fa-f]+$/.test(hexString)) return hexString
    
    let result = ''
    for (let i = 0; i < hexString.length; i += 2) {
      const hex = hexString.substr(i, 2)
      result += String.fromCharCode(parseInt(hex, 16))
    }
    return result
  } catch (e) {
    return hexString
  }
}

/**
 * Calculate average ship health across all ships
 */
export function calculateAverageShipHealth(ships: Ship[]): number {
  if (ships.length === 0) return 100
  
  const totalHealth = ships.reduce((sum, ship) => {
    const metrics = calculateShipMetrics(ship)
    return sum + metrics.hullIntegrity
  }, 0)
  
  return Math.round(totalHealth / ships.length)
}

/**
 * Calculate average crew health across all ships
 */
export function calculateAverageCrewHealth(ships: Ship[]): number {
  const allPlayerCrew = ships.flatMap(ship => ship.crew.filter(c => c.side === 'Player'))
  
  if (allPlayerCrew.length === 0) return 100
  
  const totalWellness = allPlayerCrew.reduce((sum, crew) => {
    return sum + calculateCrewWellness(crew)
  }, 0)
  
  return Math.round(totalWellness / allPlayerCrew.length)
}
