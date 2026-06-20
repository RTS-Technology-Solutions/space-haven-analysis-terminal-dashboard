# Max Value Mapping Implementation

## Overview
Implemented a dynamic max value mapping system to correctly interpret absolute health/stat values from Space Haven save files. Values like hull health, shield strength, and crew vital stats are **NOT percentages** - they are absolute values with dynamic maximums that vary by module type, character traits, and upgrades.

## Problem
The game stores raw absolute values:
- **Crew Health**: 80, 120, 140 (not 0-100%)
- **Hull Health**: 0-13 (varies by module type and upgrade level)
- **Shield Strength**: 32 or 144 (varies by module type)
- **Crew Rest**: Can exceed 100 (e.g., 168 when over-rested)
- **Crew Mood**: Can exceed 100 (e.g., 110 with bonuses)

## Solution Architecture

### 1. id_mappings.xml Dictionary (Source of Truth)
Added two new sections to `/public/id_mappings.xml`:

#### `<elementMaxValues>`
Defines max hull health and shield strength for each module type:
```xml
<element>
    <moduleType>46</moduleType>
    <name>Floor/Hull Section</name>
    <maxHullHealth>13</maxHullHealth>
    <maxShieldStrength>144</maxShieldStrength>
</element>
```

#### `<crewVitalMaxValues>`
Defines base and observed max values for crew stats:
```xml
<vital>
    <stat>Health</stat>
    <baseMax>100</baseMax>
    <observedMax>140</observedMax>
    <notes>Base health is 100, but can be increased by traits...</notes>
</vital>
```

### 2. Type System Updates (`src/types/gameData.ts`)

#### Element Interface
Added max value and percentage fields:
```typescript
hullHealth?: number  // Raw value (e.g., 4, 12)
maxHullHealth?: number  // From id_mappings
hullHealthPercent?: number  // Calculated: (hullHealth / maxHullHealth) * 100

shieldStrength?: number  // Raw value (e.g., 32, 144)
maxShieldStrength?: number  // From id_mappings
shieldStrengthPercent?: number  // Calculated
```

#### CrewMember Interface
Updated comments to reflect absolute values (not percentages):
```typescript
// Vital statistics (raw absolute values, NOT percentages)
// Values can exceed 100 based on traits, upgrades, and game progression
health: number  // Raw value (e.g., 80, 120, 140)
food: number  // Raw value (typically caps at 100)
rest: number  // Raw value (can exceed 100 when over-rested)
```

#### ParserConfig Interface
Added mapping structures:
```typescript
elementMaxValues: Record<number, ElementMaxValues>
crewVitalMaxValues: Record<string, VitalMaxValues>
```

### 3. Parser Implementation (`src/utils/gameParser.ts`)

#### `loadMaxValueMappings()` Method
Loads max values from `/id_mappings.xml`:
```typescript
async loadMaxValueMappings(): Promise<void> {
  const response = await fetch('/id_mappings.xml')
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  
  // Parse elementMaxValues section
  const elementNodes = xmlDoc.querySelectorAll('elementMaxValues > element')
  // Store in this.config.elementMaxValues
  
  // Parse crewVitalMaxValues section  
  const vitalNodes = xmlDoc.querySelectorAll('crewVitalMaxValues > vital')
  // Store in this.config.crewVitalMaxValues
}
```

#### `extractElements()` Enhancement
Calculates percentages using mapped max values:
```typescript
// Get max values from mappings for this module type
const maxValues = this.config.elementMaxValues[moduleType]
const maxHullHealth = maxValues?.maxHullHealth
const maxShieldStrength = maxValues?.maxShieldStrength

// Calculate percentages if we have both current and max values
const hullHealthPercent = (hullHealth !== undefined && maxHullHealth) 
  ? (hullHealth / maxHullHealth) * 100 
  : undefined
```

#### `createParserWithMappings()` Update
Automatically loads max values when parser is created:
```typescript
export async function createParserWithMappings(): Promise<SpaceHavenParser> {
  const config = await getParserConfig()
  const parser = new SpaceHavenParser(config)
  
  // Load element and crew max values from id_mappings.xml
  await parser.loadMaxValueMappings()
  
  return parser
}
```

## Data Analysis Results

### Element Max Values (from game_20260605_1841.xml)
| Module Type | Name | Max Hull | Max Shield | Count |
|------------|------|----------|-----------|-------|
| 46 | Floor/Hull Section | 13 | 144 | 168 |
| 44 | Standard Module | 12 | 32 | 43 |
| 2956 | Production Module | 12 | 32 | 384 |
| 2977 | Storage Module | 12 | 32 | 114 |

### Crew Vital Stat Ranges (6 crew sample)
| Stat | Min | Max | Notes |
|------|-----|-----|-------|
| Health | 80 | 140 | Can exceed 100 with traits/upgrades |
| Food | 100 | 100 | All at max (recently fed) |
| Rest | 79 | 168 | Can exceed 100 (over-rested) |
| Mood | 82 | 110 | Can exceed 100 with bonuses |
| Oxygen | 0 | 0 | All zero (inside ship with life support) |
| Temperature | 100 | 100 | All comfortable |

## Usage Pattern

### Before (Incorrect)
```typescript
// Hardcoded assumption that health is out of 100
const healthPercent = (crewMember.health / 100) * 100
```

### After (Correct)
```typescript
// Get max from mappings, calculate dynamic percentage
const maxHealth = this.config.crewVitalMaxValues['health']?.baseMax || 100
const healthPercent = (crewMember.health / maxHealth) * 100

// Or use element-specific max values
const maxHull = this.config.elementMaxValues[moduleType]?.maxHullHealth || 12
const hullPercent = (element.hullHealth / maxHull) * 100
```

## Benefits

1. **No Hardcoded Values**: All max values defined in single source of truth (id_mappings.xml)
2. **Easy Updates**: When game adds upgrades that increase max values, just update the mappings file
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Flexibility**: Can handle different max values per module type, character traits, etc.
5. **Documentation**: Each mapping includes notes explaining what the values mean
6. **Accurate Calculations**: Percentages calculated from actual observed game data

## Future Enhancements

1. **Dynamic Max Detection**: Parse individual character's actual max values from save file if available
2. **Upgrade Level Support**: Track upgrade tiers that increase max values
3. **Trait Modifiers**: Apply trait-based max value modifiers (e.g., "Strong" trait +20% health)
4. **Historical Tracking**: Compare max values across multiple save files to detect progression

## Files Modified

- `/public/id_mappings.xml` - Added elementMaxValues and crewVitalMaxValues sections
- `src/types/gameData.ts` - Updated Element, CrewMember, ParserConfig interfaces
- `src/utils/gameParser.ts` - Added loadMaxValueMappings() and updated extractElements()

## Testing

Load the example file and check console output:
```
✓ Loaded element max values for 11 module types
✓ Loaded crew vital max values for 8 stats
```

Verify element data includes percentages:
```typescript
GameSession.ships[0].elements[0] = {
  hullHealth: 12,
  maxHullHealth: 13,
  hullHealthPercent: 92.3,
  shieldStrength: 144,
  maxShieldStrength: 144,
  shieldStrengthPercent: 100
}
```
