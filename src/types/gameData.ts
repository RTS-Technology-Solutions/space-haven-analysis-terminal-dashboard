/**
 * Core TypeScript interfaces for Space Haven game data
 * Mirrors the hierarchical "has a" ownership structure
 */

// ============================================================================
// GAME SESSION (Root Entity)
// ============================================================================

export interface GameSession {
  saveFileName: string
  timestamp: Date
  gameMode: string
  daysSurvived: number
  
  // Child collections (hierarchical relationships)
  ships: Ship[]
  starSystems: StarSystem[]
  factionRelations: FactionRelation[]
  researchProgress: Record<string, unknown>
}

// ============================================================================
// SHIP/STATION ENTITIES
// ============================================================================

export interface Ship {
  shipId: string
  shipName: string
  shipType: 'ship' | 'station'
  positionX: number
  positionY: number
  systemId?: number  // Star system this ship is located in (matches StarSystem.systemId type)
  ownerId?: string  // Faction ID of the ship owner
  isPlayerOwned?: boolean  // Convenience flag
  
  // Child collections
  elements: Element[]
  crew: CrewMember[]
  powerGrid: PowerGrid
  resourceManager: ResourceManager
  
  // Derived metrics (calculated, not stored in save)
  metrics?: ShipMetrics
}

export interface Element {
  elementId: number
  x: number
  y: number
  moduleType: number  // ID from id_mappings.xml
  moduleName: string  // Human-readable name
  
  // Component state (raw absolute values from XML, NOT percentages)
  hullHealth?: number  // 'ht' attribute - raw value (e.g., 4, 12, etc.)
  maxHullHealth?: number  // Max health for this module type from id_mappings
  hullHealthPercent?: number  // Calculated: (hullHealth / maxHullHealth) * 100
  
  shieldStrength?: number  // 'sh' attribute - raw value (e.g., 32, 144, etc.)
  maxShieldStrength?: number  // Max shield for this module type from id_mappings
  shieldStrengthPercent?: number  // Calculated: (shieldStrength / maxShieldStrength) * 100
  
  // Inventory (if element has storage)
  inventory: InventoryItem[]
  consumableInventory: ConsumableItem[]
}

export interface InventoryItem {
  itemId: string
  itemName: string
  quantity: number
  location: string  // Which element owns this
}

export interface ConsumableItem {
  elementId: string
  elementName: string
  quantity: number
  
  // Nutritional properties (for food)
  protein?: number
  carbs?: number
  fat?: number
  vitamins?: number
  toxins?: number
}

export interface PowerGrid {
  generators: PowerGenerator[]
  consumers: PowerConsumer[]
  totalPower: number
  totalConsumption: number
  efficiency: number
}

export interface PowerGenerator {
  elementId: number
  elementName: string
  powerOutput: number
  fuelType?: string
  fuelRemaining?: number
}

export interface PowerConsumer {
  elementId: number
  elementName: string
  powerDemand: number
  priority: number
}

export interface ResourceManager {
  storageRules: StorageRule[]
  productionQueue: ProductionItem[]
  autoOrders: AutoOrder[]
}

export interface StorageRule {
  itemId: string
  itemName: string
  minQuantity: number
  maxQuantity: number
}

export interface ProductionItem {
  recipeId: string
  recipeName: string
  queuePosition: number
  progress: number
}

export interface AutoOrder {
  itemId: string
  itemName: string
  enabled: boolean
  threshold: number
}

// ============================================================================
// CREW ENTITIES
// ============================================================================

export interface CrewMember {
  crewId: string
  name: string
  lastName: string
  side: 'Player' | 'Civilian' | 'Hostile'
  faction: string
  
  // Position
  x: number
  y: number
  currentTask: string
  
  // Vital statistics (raw absolute values, NOT percentages)
  // Values can exceed 100 based on traits, upgrades, and game progression
  health: number  // Raw value (e.g., 80, 120, 140)
  food: number  // Raw value (typically caps at 100)
  rest: number  // Raw value (can exceed 100 when over-rested)
  mood: number  // Raw value (can exceed 100 with bonuses)
  oxygen: number  // 0 = inside ship with life support
  temperature: number  // 100 = comfortable
  comfort?: number  // Raw comfort level
  energy?: number  // Raw energy level (may not be present in all saves)
  
  // Attributes (Bravery, Zest, Intelligence, Perception)
  attributes: Attribute[]
  
  // Skills and jobs
  skills: Skill[]
  jobAssignments: JobAssignment[]
  schedule: Record<string, string>
  
  // Personal inventory
  inventory: InventoryItem[]
  
  // Derived metrics
  wellnessScore?: number
  statusSeverity?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
}

export interface Attribute {
  attributeId: number
  attributeName: string
  points: number
}

export interface Skill {
  skillId: number
  skillName: string
  level: number
  maxNatural: number  // mxn in XML
  experience: number
}

export interface JobAssignment {
  profession: string
  priority: 'High' | 'Medium' | 'Low'
}

// ============================================================================
// STAR SYSTEM ENTITIES
// ============================================================================

export interface StarSystem {
  systemId: number
  systemName: string
  systemType: string
  x: number
  y: number
  visited: boolean
  
  // Celestial bodies in this system
  bodies: CelestialBody[]
  // Resources available in this system
  resources: SystemResource[]
  // Stations/fleets present
  stations: StationInfo[]
  fleets: FleetInfo[]
}

export interface CelestialBody {
  bodyId: number
  bodyType: 'Star' | 'Planet' | 'AsteroidField' | 'Moon' | 'Unknown'
  systemId: number
  x: number
  y: number
  visited: boolean
  resources: SystemResource[]
  // Additional metadata
  starType?: string  // MainSequence, etc.
  starClass?: string // A, B, F, G, K, M, etc.
  seed?: string
}

export interface SystemResource {
  resourceId: string
  resourceName: string
  quantity: number
}

export interface StationInfo {
  stationId: string
  stationType: string
  factionId: string
}

export interface FleetInfo {
  fleetId: string
  factionId: string
  isPlayer: boolean
  shipCount: number
}

// ============================================================================
// FACTION ENTITIES
// ============================================================================

export interface FactionRelation {
  faction1: string
  faction2: string
  stance: 'hostile' | 'neutral' | 'friendly' | 'allied'
  relationshipValue: number
}

// ============================================================================
// DERIVED METRICS (Not in save file, calculated)
// ============================================================================

export interface ShipMetrics {
  // Hull Integrity
  hullIntegrity: number  // % of elements at full health
  damagedComponentCount: number
  criticalComponentCount: number
  
  // System Status
  powerEfficiency: number  // % of power demand being met
  shieldCoverage: number  // % of ship with shields
  
  // Storage
  storageUtilization: number  // % capacity used
  criticalShortages: string[]  // Items below minimum
  overstockedItems: string[]  // Items above maximum
  
  // Production
  productionQueueSize: number
  itemsProducedPerDay: number
}

export interface CrewMetrics {
  // Overview
  totalCrew: number
  crewByStatus: Record<string, number>
  averageWellness: number
  
  // Skills
  skillCoverage: Record<string, number>  // skill name → crew count
  criticalSkillGaps: string[]  // Missing critical skills
  
  // Workload
  tasksPerCrewMember: Record<string, number>
  overworkedCrew: string[]  // Crew with excessive tasks
  idleCrew: string[]  // Crew with no assignments
}

export interface GameSessionMetrics {
  // Game progression
  daysSurvived: number
  systemsExplored: number
  researchCompleted: number
  
  // Overall health
  overallHealthScore: number  // Composite 0-100
  shipHealth: number
  crewHealth: number
  resourceHealth: number
  
  // Economy
  totalResourcesValue: number
  credits: number
  tradingVolume: number
  
  // Faction standing
  averageFactionRelation: number
  alliesCount: number
  enemiesCount: number
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface ParserConfig {
  attributeMappings: Record<number, string>  // Attribute ID -> name (Bravery, Zest, Intelligence, Perception)
  skillMappings: Record<number, string>
  itemMappings: Record<string, string>
  traitMappings: Record<string, string>
  occupationMappings: Record<string, string>
  elementMaxValues: Record<number, ElementMaxValues>  // Module type -> max values
  crewVitalMaxValues: Record<string, VitalMaxValues>  // Stat name -> max values
}

// Max values for element health/shields by module type
export interface ElementMaxValues {
  moduleType: number
  name: string
  maxHullHealth: number
  maxShieldStrength: number
  notes?: string
}

// Max values for crew vital statistics
export interface VitalMaxValues {
  stat: string
  baseMax: number
  observedMax: number | null
  notes?: string
}

export const DEFAULT_SKILL_MAPPINGS: Record<number, string> = {
  1: 'Construct',
  2: 'Mining',
  3: 'Botany',
  4: 'Construction',
  5: 'Industry',
  6: 'Medical',
  7: 'Gunner',
  8: 'Shielding',
  9: 'Operations',
  10: 'Weapons',
  12: 'Carry',
  13: 'Unknown',
  14: 'Navigation',
  16: 'Research',
  22: 'Piloting'
}

export const CRITICAL_SKILLS = ['Medical', 'Construct', 'Industry', 'Operations']

export const RESOURCE_THRESHOLDS = {
  critical: 10,
  low: 50,
  good: 100,
  abundant: 500
}

export const WELLNESS_THRESHOLDS = {
  critical: 20,
  poor: 40,
  fair: 60,
  good: 80,
  excellent: 95
}
