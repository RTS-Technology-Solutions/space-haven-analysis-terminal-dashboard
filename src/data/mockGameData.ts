import type { GameSession } from '../types/gameData'

/**
 * Mock game data for wireframe/layout development
 * Based on hierarchical game structure: Game → Star System → Sector → Ship → Crew
 * This represents a realistic mid-game save file
 */

// ============================================================================
// GAME LEVEL (Root - always singular)
// ============================================================================
export const mockGameSession: GameSession = {
  saveFileName: 'game_20260604_1430.xml',
  timestamp: new Date('2026-06-04T14:30:00'),
  gameMode: 'Normal',
  daysSurvived: 42,
  
  ships: [], // Populated below
  starSystems: [],
  factionRelations: [],
  researchProgress: {}
}

// ============================================================================
// STAR SYSTEM LEVEL (Can have multiple - need selector)
// ============================================================================
export const mockStarSystems = [
  {
    systemId: '42',
    systemName: 'Kepler-442',
    sectorsCount: 2,
    bodiesCount: 5,
    asteroidsCount: 12,
    factionsPresent: 2
  },
  {
    systemId: '87',
    systemName: 'Proxima Centauri',
    sectorsCount: 1,
    bodiesCount: 3,
    asteroidsCount: 8,
    factionsPresent: 1
  }
]

// ============================================================================
// SECTOR LEVEL (Can have multiple per system - need selector)
// ============================================================================
export const mockSectors = [
  {
    sectorId: 'sector_north',
    sectorName: 'Northern Asteroid Field',
    systemId: '42',
    shipsCount: 3,
    objectsCount: 127,
    asteroidsCount: 45,
    debrisCount: 23,
    stationsCount: 2,
    factionsPresent: ['Player', 'Civilian', 'Merchant']
  },
  {
    sectorId: 'sector_south',
    sectorName: 'Trade Route Alpha',
    systemId: '42',
    shipsCount: 1,
    objectsCount: 34,
    asteroidsCount: 12,
    debrisCount: 8,
    stationsCount: 1,
    factionsPresent: ['Merchant']
  }
]

// ============================================================================
// SHIP LEVEL (Multiple per sector - need selector)
// ============================================================================
export const mockShips = [
  {
    shipId: '43',
    shipName: 'OSNX7-1',
    shipType: 'ship',
    sectorId: 'sector_north',
    faction: 'Player',
    
    // Ship stats
    mass: 8500,
    crewCount: 5,
    robotsCount: 2,
    
    // Condition stats
    hullIntegrity: 1534,
    hullMax: 1800,
    hullPercent: 85.2,
    hullStatus: 'Minor Damage',
    
    powerCurrent: 620,
    powerMax: 850,
    powerPercent: 72.9,
    
    oxygenLevel: 98,
    foodStores: 450,
    creditsOnBoard: 2400,
    averageMood: 67,
    
    // Systems
    hyperspaceJumpCount: 12,
    craftsOnboard: 1,
    
    positionX: 1500,
    positionY: 2000
  },
  {
    shipId: '87',
    shipName: 'MINING RIG ALPHA',
    shipType: 'station',
    sectorId: 'sector_north',
    faction: 'Player',
    
    mass: 15000,
    crewCount: 8,
    robotsCount: 4,
    
    hullIntegrity: 2100,
    hullMax: 2100,
    hullPercent: 100,
    hullStatus: 'Operational',
    
    powerCurrent: 980,
    powerMax: 1200,
    powerPercent: 81.7,
    
    oxygenLevel: 100,
    foodStores: 1200,
    creditsOnBoard: 8900,
    averageMood: 82,
    
    hyperspaceJumpCount: 0,
    craftsOnboard: 0,
    
    positionX: 3200,
    positionY: 1800
  },
  {
    shipId: '124',
    shipName: 'THE WANDERER',
    shipType: 'ship',
    sectorId: 'sector_north',
    faction: 'Merchant',
    
    mass: 6000,
    crewCount: 3,
    robotsCount: 0,
    
    hullIntegrity: 1100,
    hullMax: 1200,
    hullPercent: 91.7,
    hullStatus: 'Operational',
    
    powerCurrent: 450,
    powerMax: 600,
    powerPercent: 75.0,
    
    oxygenLevel: 95,
    foodStores: 200,
    creditsOnBoard: 15000,
    averageMood: 75,
    
    hyperspaceJumpCount: 34,
    craftsOnboard: 0,
    
    positionX: 5400,
    positionY: 3100
  }
]

// ============================================================================
// CREW LEVEL (Multiple per ship - need selector)
// ============================================================================
export const mockCrew = [
  // OSNX7-1 crew
  {
    crewId: 'crew_001',
    shipId: '43',
    name: 'Sarah',
    lastName: 'Chen',
    occupation: 'Engineer',
    
    // Status/Vitals (health can exceed 100, others are 0-100)
    health: 85,
    mood: 67,
    energy: 72,
    food: 88,
    comfort: 65,
    oxygen: 100,
    temperature: 22,
    
    // Skills (0-10 points, no XP system in game)
    skills: [
      { skillName: 'Engineering', level: 7 },
      { skillName: 'Construct', level: 6 },
      { skillName: 'Operations', level: 4 }
    ],
    
    // Traits
    traits: ['Hardworking', 'Optimistic'],
    
    // Modifiers
    conditions: [],
    
    // Schedule
    currentTask: 'Repairing Hull Breach (Sector 4B)',
    workingLocation: 'OSNX7-1'
  },
  {
    crewId: 'crew_002',
    shipId: '43',
    name: 'Marcus',
    lastName: 'Rodriguez',
    occupation: 'Medic',
    
    health: 140,
    mood: 78,
    energy: 85,
    food: 90,
    comfort: 80,
    oxygen: 100,
    temperature: 22,
    
    skills: [
      { skillName: 'Medical', level: 8 },
      { skillName: 'Botany', level: 5 },
      { skillName: 'Operations', level: 3 }
    ],
    
    traits: ['Caring', 'Quick Learner'],
    conditions: [],
    currentTask: 'Treating Crew Injuries',
    workingLocation: 'OSNX7-1'
  },
  {
    crewId: 'crew_003',
    shipId: '43',
    name: 'Yuki',
    lastName: 'Tanaka',
    occupation: 'Pilot',
    
    health: 78,
    mood: 55,
    energy: 45,
    food: 62,
    comfort: 50,
    oxygen: 100,
    temperature: 22,
    
    skills: [
      { skillName: 'Piloting', level: 8 },
      { skillName: 'Navigation', level: 7 },
      { skillName: 'Industry', level: 3 }
    ],
    
    traits: ['Focused', 'Loner'],
    conditions: ['Fatigued'],
    currentTask: 'Resting in Quarters',
    workingLocation: 'OSNX7-1'
  },
  {
    crewId: 'crew_004',
    shipId: '43',
    name: 'James',
    lastName: 'O\'Brien',
    occupation: 'Security',
    
    health: 95,
    mood: 88,
    energy: 92,
    food: 95,
    comfort: 85,
    oxygen: 100,
    temperature: 22,
    
    skills: [
      { skillName: 'Combat', level: 9 },
      { skillName: 'Security', level: 8 },
      { skillName: 'Operations', level: 4 }
    ],
    
    traits: ['Brave', 'Leader'],
    conditions: [],
    currentTask: 'Patrolling Corridors',
    workingLocation: 'OSNX7-1'
  },
  {
    crewId: 'crew_005',
    shipId: '43',
    name: 'Elena',
    lastName: 'Volkov',
    occupation: 'Scientist',
    
    health: 125,
    mood: 72,
    energy: 68,
    food: 85,
    comfort: 70,
    oxygen: 100,
    temperature: 22,
    
    skills: [
      { skillName: 'Research', level: 9 },
      { skillName: 'Botany', level: 7 },
      { skillName: 'Medical', level: 5 }
    ],
    
    traits: ['Intellectual', 'Curious'],
    conditions: [],
    currentTask: 'Analyzing Samples',
    workingLocation: 'OSNX7-1'
  }
]

// ============================================================================
// STORAGE/INVENTORY (Per ship)
// ============================================================================
export const mockStorage = [
  {
    shipId: '43',
    storageLocations: [
      {
        locationName: 'Main Cargo Bay',
        capacity: 1000,
        used: 687,
        items: [
          { itemName: 'Metal', quantity: 450, category: 'Raw Material' },
          { itemName: 'Water', quantity: 120, category: 'Life Support' },
          { itemName: 'Food Rations', quantity: 85, category: 'Consumable' },
          { itemName: 'Hull Plating', quantity: 32, category: 'Construction' }
        ]
      },
      {
        locationName: 'Medical Storage',
        capacity: 200,
        used: 142,
        items: [
          { itemName: 'Medical Supplies', quantity: 75, category: 'Medical' },
          { itemName: 'Painkillers', quantity: 45, category: 'Medical' },
          { itemName: 'Bandages', quantity: 22, category: 'Medical' }
        ]
      }
    ]
  }
]

// ============================================================================
// CONSTRUCTION/HULL ELEMENTS (Per ship - for detailed views)
// ============================================================================
export const mockHullElements = {
  shipId: '43',
  totalElements: 1800,
  operational: 1534,
  damaged: 234,
  critical: 32,
  destroyed: 0,
  
  // Breach location for alert
  breaches: [
    {
      location: { x: 42, y: 18 },
      severity: 'Minor',
      affectedElements: 3,
      oxygenLeak: true
    }
  ]
}
