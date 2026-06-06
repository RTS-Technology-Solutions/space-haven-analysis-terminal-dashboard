# ID Mappings Integration Guide

## Overview

The dashboard now uses `id_mappings.xml` as a **data translator** to convert Space Haven save file IDs into human-readable names. This creates a single source of truth for all game object mappings.

## File Location

- **Source**: `e:\Programming Stuff\Gaming Projects\proj20260531_space_haven_insights\space-haven-insights\data\id_mappings.xml`
- **Dashboard**: `public/id_mappings.xml` (copied from source)

## Structure

The `id_mappings.xml` file follows a consistent dictionary-like pattern:

```xml
<mappings>
    <!-- Game object mappings (ID-based) -->
    <skills>
        <skill><id>1</id><name>Construct</name></skill>
    </skills>
    
    <!-- Attribute mappings (name-based) -->
    <tileAttributes>
        <attribute>
            <name>hf</name>
            <description>Heat/Fuel value</description>
            <valueType>integer</valueType>
            <classification>TILE_HEAT_FUEL</classification>
        </attribute>
    </tileAttributes>
</mappings>
```

## Available Categories

### Original Game Objects
- **skills**: Crew skill IDs (1-22, 210-214)
- **traits**: Character trait IDs
- **occupations**: Job/occupation IDs
- **characters**: Character type IDs
- **crafts**: Craft/shuttle IDs
- **explosions**: Explosion type IDs
- **items**: Item/resource IDs (70+ entries)
- **processes**: Manufacturing process IDs (100+ entries)
- **modules**: Ship module/facility IDs (20+ entries)

### New Attribute Mappings
- **tileAttributes**: Ship tile attributes (hf, atm, fg, sh, etc.)
- **tileTypes**: Tile type categories (HULL, WALLS, DOORS, etc.)
- **starmapAttributes**: Starmap-level attributes
- **systemAttributes**: Star system attributes
- **relationshipAttributes**: NPC relationship values
- **elementTypes**: Element type classifications
- **shipAttributes**: Ship element attributes

## Usage in Code

### 1. Load All Mappings

```typescript
import { loadIdMappings } from '@/utils/xmlParser'

const mappings = await loadIdMappings()
console.log(`Loaded ${mappings.totalCount} total mappings`)
console.log(`Skills: ${mappings.skills.length}`)
console.log(`Tile Attributes: ${mappings.tileAttributes.length}`)
```

### 2. Create Game Parser with Mappings

```typescript
import { createParserWithMappings } from '@/utils/gameParser'

// Preferred method - uses loaded id_mappings.xml
const parser = await createParserWithMappings()
const gameSession = await parser.parseGameSave(xmlText, fileName)
```

### 3. Get Individual Mappings

```typescript
import { getSkillName, getTraitName, getItemName } from '@/utils/mappingsLoader'

const skillName = await getSkillName(1)  // "Construct"
const traitName = await getTraitName('210')  // "Bravery"
const itemName = await getItemName('46')  // "Base Metals"
```

### 4. Get Attribute Descriptions

```typescript
import { getAttributeDescription } from '@/utils/mappingsLoader'

const desc = await getAttributeDescription('hf', 'tile')
// "Heat/Fuel value (observed range: 116-394)"
```

### 5. Search Mappings

```typescript
import { searchMappings } from '@/utils/xmlParser'

const results = searchMappings(mappings, 'medical')
// Returns all mappings containing "medical" in ID, name, or description
```

### 6. Convert to Parser Format

```typescript
import { toNumericMappings, toStringMappings } from '@/utils/xmlParser'

// For skills (numeric IDs)
const skillMap = toNumericMappings(mappings.skills)
// { 1: "Construct", 2: "Mining", ... }

// For traits/items (string IDs)
const traitMap = toStringMappings(mappings.traits)
// { "210": "Bravery", "212": "Zest", ... }
```

## Data Sheet Page Updates

The Data Sheet page (`/data`) now displays all 16 categories:

1. Skills
2. Traits
3. Occupations
4. Characters
5. Crafts
6. Explosions
7. Items
8. Processes
9. Modules
10. **Tile Attributes** (NEW)
11. **Tile Types** (NEW)
12. **Starmap Attributes** (NEW)
13. **System Attributes** (NEW)
14. **Relationship Attributes** (NEW)
15. **Element Types** (NEW)
16. **Ship Attributes** (NEW)

### Enhanced Display

- **ID + Name** columns for all categories
- **Description** column for attribute mappings (shows valueType, classification, range, etc.)
- **Search** across ID, name, AND description fields
- **Download** button exports the full `id_mappings.xml`

## Benefits

### For Development
- ✅ **Single source of truth** - All mappings in one file
- ✅ **Type-safe** - TypeScript interfaces for all mapping types
- ✅ **Cacheable** - Mappings loaded once and cached
- ✅ **Extensible** - Easy to add new categories
- ✅ **Testable** - Pure functions for conversion

### For Users
- ✅ **Accurate names** - Community-verified mappings
- ✅ **Searchable** - Find any mapping quickly
- ✅ **Documented** - Descriptions explain what each ID represents
- ✅ **Downloadable** - Export XML for external tools

### For Community
- ✅ **Shareable** - Standard XML format
- ✅ **Collaborative** - Easy to update and contribute
- ✅ **Versioned** - Track changes over time
- ✅ **Modder-friendly** - Use in tools, mods, analysis

## File Updates

When the source `id_mappings.xml` is updated:

1. Copy to dashboard: 
   ```powershell
   Copy-Item -Path "e:\...\space-haven-insights\data\id_mappings.xml" -Destination "public\id_mappings.xml" -Force
   ```

2. Rebuild dashboard:
   ```powershell
   npm run build
   ```

3. Test locally:
   ```powershell
   npm run dev
   ```

4. Deploy:
   ```powershell
   npm run deploy
   ```

## Type Definitions

See `src/types/mappings.ts` for complete type definitions:

- `MappingItem` - Basic ID+name mapping
- `AttributeMapping` - Extended mapping with metadata
- `IdMappings` - All 16 category collections
- `ParsedMappings` - Includes totalCount

## Future Enhancements

- [ ] Auto-sync id_mappings.xml from insights repo
- [ ] Add version tracking to mappings
- [ ] Create mapping editor UI
- [ ] Add community contribution workflow
- [ ] Generate TypeScript constants from XML
- [ ] Add mapping validation tests

## Related Files

- `src/types/mappings.ts` - Type definitions
- `src/utils/xmlParser.ts` - XML loading and parsing
- `src/utils/mappingsLoader.ts` - Helper functions
- `src/utils/gameParser.ts` - Game save parser
- `src/components/DataSheets.tsx` - Data dictionary UI
- `public/id_mappings.xml` - The data file itself

---

**Last Updated**: 2026-06-05  
**Total Mappings**: 700+ entries across 16 categories  
**Source**: Community research + Space Haven Editor project
