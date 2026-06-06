# Space Haven Save File - Data Discovery Summary

**Generated**: 2026-06-06  
**Analysis of**: game_20260605_1841.xml (35 days survived, 2 ships, 181 characters)

## Executive Summary

Analyzed **291 unique XML tags** containing **5,413 unique ID values**. The data reveals a complex relationship mesh with **`<l>`** and **`<e>`** as mega-hubs. We're currently extracting ~15% of available data. This document identifies all missing attributes and relationship connections.

---

## 🎯 HIGH-CONNECTIVITY FOCAL POINTS (Your Hypothesis: CONFIRMED)

The top 10 hub tags by total connections (parent types + child types):

| Rank | Tag | Total Connections | Occurrences | Has IDs | Notes |
|------|-----|-------------------|-------------|---------|-------|
| 1 | **`<l>`** | **80** | 2,644 | 🔑 | **MEGA-HUB** - Used for layers, star systems, asteroids, planets, crew relationships, warp gates |
| 2 | **`<game>`** | 29 | 1 | 🔑 | Root container - connects to all top-level systems |
| 3 | **`<feat>`** | 24 | 248 | 🔑 | Features/facilities on modules |
| 4 | **`<c>`** | 22 | 198 | 🔑 | **Characters AND Crafts** (contains both!) |
| 5 | **`<inv>`** | 22 | 128 | 🔑 | Inventory containers |
| 6 | **`<ship>`** | 19 | 2 | 🔑 | **CONFIRMED HUB** - Core entity |
| 7 | **`<s>`** | 17 | 709 | 🔑 | Storage/sector data |
| 8 | **`<m>`** | 13 | 239 | 🔑 | Module/material definitions |
| 9 | **`<pers>`** | 13 | 16 | 🔑 | Personality/skills container |
| 10 | **`<craft>`** | 12 | 1 | 🔑 | Craft vessels (shuttles, etc.) |

**Special Mention**:
- **`<e>` (Elements)**: 9,388 occurrences - Most common tag in the entire save file (ship modules/tiles)

**Your Prediction Accuracy**: ✅ Ships, crew, crafts, sectors, star systems ALL confirmed as high-connectivity nodes.

---

## 📦 WHAT WE'RE CURRENTLY EXTRACTING (vs. What Exists)

### 🚀 Ships (`<ship>`) - Extracting ~30% of data

**Currently Extracting**:
- `sid` - System ID
- `sname` - Ship name
- Owner detection from `<settings owner="...">`

**MISSING Attributes**:
```typescript
sx: number         // Ship size X (56x56 grid)
sy: number         // Ship size Y  
idCnt: number      // ID counter for entities (7352 on player ship)
ox: number         // Offset X position (-1248)
oy: number         // Offset Y position (4592)
fog: boolean       // Fog of war state
real: number       // Is real ship (1) vs simulated?
ndb: number        // Unknown - always 0 in samples
sta: number        // Station flag (1 for CB KURASIC PARK)
```

**MISSING Child Tags**:
- `<gasWarnings>` - Gas warning systems
- `<robots>` - Robot crew (separate from characters!)
- `<monsters>` - Monster entities
- `<items>` - Ship-level items
- `<nonStorables>` - Non-storable entities
- `<blueprints>` - Available blueprints
- `<roof>` - Roof structure
- `<power>` - Power grid data
- `<colorTiles>` - Custom tile colors
- `<manager>` - Ship management AI
- `<station>` - Station-specific data
- `<stationState>` - Station state
- `<asi>` - AI/automation settings
- `<markers>` - Map markers
- `<shipBank>` - Economic data (discount/markup)

---

### 👤 Characters (`<c>`) - Extracting ~20% of data

**Currently Extracting**:
- `id` - Character ID
- `name` - First name
- `side` - Faction side
- Basic vitals: Health, Oxygen (partially), Comfort (partially), Energy (partially)
- Skills from `<pers><skills>` (numeric IDs only)

**MISSING Attributes**:
```typescript
// Identity
lname: string              // Last name! (Telefont, Chang, Altamirano, etc.)
cid: number                // Character instance ID (different from id?)
cname: string              // Craft name (for BU1, BU2, BU3, SH1 - the crafts!)

// Location & State
sid: number                // Ship ID they're currently on
x: number                  // Position X on ship (34.0, 27.0, etc.)
y: number                  // Position Y on ship
insx: number               // Inside sector X
insy: number               // Inside sector Y
homeId: number             // Home location ID
homeSid: number            // Home ship ID

// Activity
task: string               // Current task (Sit, MedicalSleep, SitNWork, Walk, StandWork)
dir: string                // Direction facing (D1, D3, D9, D7)
entId: number              // Entity ID they're interacting with
eid: number                // Element ID (location?)

// Stats & Level
level: number              // Character level (0-7)
rs: number                 // Research skill? (usually 1)
med: number                // Medical state (1 = normal?)
hitP: number               // Hit points (30, 50, 150)
shieldP: number            // Shield points (0)
st: string                 // State (Floating, DockedHangar, Land)

// Appearance
bb: string                 // Body base (m/f - gender)
bs: number                 // Body skin (1, 2, 3)
bh: string                 // Body hair (m/f)
bp: number                 // Body pose (1, 2, 3)
orgColor: number           // Original color set (2361, 2444)
colorSet: number           // Current color set
// From <colors> child: skinSet, shirtSet, pantsSet, etc.

// Faction & AI
fac: number                // Faction ID (461, 1694)
l: number                  // Unknown - usually 0
leftH: number              // Left hand state?
isa: boolean               // Is attacking?
cd: string                 // Unknown (D1, D3)
pln: string                // Plane (BelowShip, ShipPlane, OnTopOfShips)
offY: number               // Offset Y for rendering?

// Crafts Only
acc: number                // Acceleration? (-1.0, 0.0)
spx: number                // Speed X? (1.5920215)
spy: number                // Speed Y? (0.8734571)
```

**MISSING Child Tags**:
- `<cd>` - Cooldowns?
- `<ai>` - AI behavior data
- `<rec>` - Recreation preferences
- `<mood>` - Mood system
- `<rate>` - Rating/opinion system
- `<colors>` - Detailed color customization
- `<loadout>` - Equipment loadout
- `<aug>` - Augmentations/implants
- `<npc>` - NPC-specific data
- `<ox>` - Oxygen system (nested?)
- `<stored>` - Stored items on character

---

### 🧱 Elements/Modules (`<e>`) - Extracting ~10% of data

**Currently Extracting**:
- `x`, `y` - Grid position
- `m` - Module type ID
- `rot` - Rotation (R0, R90, R180, R270)
- `ht` - Hull health (partial - only when present)
- `sh` - Shield strength (partial - only when present)
- `id` - Element ID (only on some elements)

**MISSING Attributes** (35+ attributes!):
```typescript
// Atmosphere & Environment
atm: number                // Atmosphere pressure (0-11000+)
atm2: number               // Atmosphere composition? (0-13)
hf: number                 // Heat/freeze value (200-300 range)
fg: number                 // Foreground layer? (usually 191)
env: number                // Environment flags (1792 common)

// Hull & Structure
hx: number                 // Hull extended? (-1 common)
cfb: number                // Unknown (1 when present)
cfl: number                // Unknown (0 when present)

// Inventory & Storage
invw: number               // Inventory width (44, 3168, 43)
rand: string               // Randomization seed (232_0_12, etc.)
inrand: string             // Internal randomization (237_4_w10, etc.)

// Power & Systems
wm: number                 // Water mask? (1)
pw: number                 // Power? (1)
auto: number               // Automated? (1)
pr: number                 // Unknown (4)

// Resource Nodes
ore: number                // Ore type ID (3513, 3512)
if: number                 // Item feature? (3166, 3165, etc.)
di: number                 // Unknown (1)
ext: number                // Extension? (1-8)
fl: number                 // Floor? (1)
astv: number               // Asteroid value? (2, 3, 4)

// Special Flags
hpn: number                // Hit points? (2, 4, 8)
sid: number                // System ID (on starmap elements)
syid: number               // Unknown system ID
fi: number                 // Unknown (32, 10)
est: number                // Unknown (16)
t: number                  // Type? (6)
col: string                // Color (6e75ff, ffffff, fffdfa)
```

**MISSING Child Tags**:
- `<wm>` - Water mask data
- `<feat>` - Features/facilities (fuel production, shields, etc.)
- `<l>` - Nested layers (multi-level modules)

**Key Discovery**: Elements with `id="-1"` are **overlay modules** (furniture, systems) placed ON TOP of hull tiles. Regular elements have numeric IDs.

---

### 🌌 Layers (`<l>`) - THE MEGA-HUB - Extracting ~5% of data

**Purpose**: Multi-use container for EVERYTHING:
1. Star systems in starmap
2. Asteroid fields
3. Planet data
4. Warp gates
5. Cryo people (frozen crew)
6. Crew relationships
7. Multi-level module layers
8. Faction relationships
9. Quest/mission data

**Currently Extracting**: Almost nothing (not parsed at all!)

**Critical Attributes**:
```typescript
// Position (used by star systems, asteroids, planets)
id: number                 // Unique ID
x: number                  // Galaxy X (91026, 90899, etc.)
y: number                  // Galaxy Y (221228, 219994, etc.)
rot: string                // Rotation
ind: number                // Index in parent container

// Type Detection
type: string               // CRITICAL: "Star", "AsteroidField", "Planet", "WarpGate", "CryoPerson"

// Star System Data
seed: number               // Generation seed (1454095735614701404)
celeid: number             // Celestial ID
centerId: number           // Center body ID

// Relationships (Crew Morale System!)
targetId: number           // Target character ID
friendship: number         // Friendship level (0-100)
attraction: number         // Attraction level (-100 to 100)
compatibility: number      // Compatibility score (0-100)
lastDaySeen: number        // Last interaction day
dailyDiff: number          // Daily change
lastDayInc: number         // Last increment day
bestFriends: boolean       // Best friends flag
lovers: boolean            // Lovers flag

// Faction Relationships
s1: string                 // Side 1 (Player, Monster, Merchant, Robot, Environment)
s2: string                 // Side 2 (Player, NotSet, Robot, Environment, Pirate)
stance: string             // Stance (Player, Neutral, Enemies, Friendly, UnFriendly)
relationship: number       // Relationship value (-100 to 100)
patience: number           // Patience level (0-100)

// Module Layer Data (nested in <e>)
atm: number                // Atmosphere
atm2: number               // Atmosphere type
hf: number                 // Heat/freeze
fg: number                 // Foreground
sh: number                 // Shield
eid: number                // Element ID reference
done: boolean              // Completion flag
o: number                  // Unknown (0, 4, 8, 12, 16)
floorEid: number           // Floor element ID
```

**MISSING Child Tags** (44 possible children!):
- `<feat>` - Features
- `<hio>` - Unknown
- `<cm>` - Completion markers?
- `<eng>` - Engineering?
- `<inv>` - Inventory
- `<special>` - Special properties
- `<cinv>` - Character inventory
- `<ingen>` - Unknown
- `<g>` - Unknown
- `<d>` - Door/destination?
- `<cp>` - Unknown
- `<drill>` - Drilling data
- `<storage>` - Storage container
- `<cargo>` - Cargo data
- `<containerDestinations>` - Logistics
- `<resources>` - Resource data
- `<persons>` - Person references
- `<objectiveTarget>` - Quest targets
- And many more...

---

## 🕸️ THE RELATIONSHIP MESH

### ID Cross-Reference Patterns

**Ship-Level IDs**:
- Ships have `sid` (system ID) pointing to `<l type="Star">` entries
- Elements have `sid` pointing to their containing ship
- Characters have `sid` and `homeSid` pointing to ships

**Character-Level IDs**:
- Characters have `id` (unique character ID)
- Characters have `cid` (character instance ID?)
- Characters have `entId` (entity they're interacting with - points to `<e id>`)
- Characters have `eid` (element ID - their location)
- `<l>` relationship entries have `targetId` pointing to character `id`

**Element-Level IDs**:
- Elements have `id` (unique element ID, or -1 for overlays)
- Elements have `m` (module type - points to id_mappings.xml)
- Elements can reference `ore` (ore type ID)
- Elements can reference `if` (item feature ID)
- Multi-level elements contain `<l>` tags with `eid` pointing to other elements
- `<l floorEid="...">` references floor tile elements

**Faction-Level IDs**:
- Characters have `fac` (faction ID)
- `<f>` tags have `factionId`
- `<l>` entries have `s1`, `s2` (faction sides) and `relationship` values

**Inventory Cross-References**:
- Elements have `invw` (inventory width)
- `<feat>` contains `<inv>` with items
- `<l>` layers can contain `<inv>` with nested `<s>` (storage?) entries
- Characters have `<inv>` and `<loadout>` children

---

## 🔍 UNKNOWN ATTRIBUTE MEANINGS (Need Investigation)

### High-Priority Unknowns:
```
Ship Attributes:
- ndb: Always 0 in samples - unknown purpose
- sta: Station flag? Only on CB KURASIC PARK (civilian station)
- real: Real vs simulated ship? Always 1 in samples
- idCnt: ID counter - what is it counting?

Element Attributes:
- fg: Always 191 - foreground layer mask?
- cfb: Always 1 when present - unknown flag
- env: Always 1792 when present - environment bitmask?
- hx: Always -1 when present - hull extension?
- pr, di, fi, est, t: Unknown numeric flags

Character Attributes:
- rs: Always 1 - research state? readiness?
- med: Always 1 - medical flag? medication?
- l: Always 0 - unknown
- cd: D1, D3 - compass directions?
- pln: BelowShip, ShipPlane, OnTopOfShips - rendering plane?
- bs, bp: Body skin/pose - need value mappings
- leftH: Left hand state?
- isa: Is attacking?

Layer Attributes:
- ind: Index - ordering within parent?
- o: 0, 4, 8, 12, 16 - offset? orientation?
- done: Completion state for what?
- celeid, centerId: Celestial bodies?
```

---

## 📊 DATA COVERAGE ANALYSIS

### Current Parser Coverage by Entity Type:

| Entity | Attributes Extracted | Attributes Available | Coverage | Child Tags Extracted | Child Tags Available | Coverage |
|--------|---------------------|----------------------|----------|---------------------|---------------------|----------|
| Ship | 2 | 11 | **18%** | 2 | 18 | **11%** |
| Character | 5 | 47 | **11%** | 2 | 16 | **13%** |
| Element | 6 | 41 | **15%** | 0 | 3 | **0%** |
| Layer | 0 | 30+ | **0%** | 0 | 44 | **0%** |
| Star System | 1 | 10+ | **10%** | 0 | 8 | **0%** |

**Overall Data Extraction**: ~**12-15%** of available game data

---

## 🎯 RECOMMENDED NEXT STEPS

### Phase 1: Enhance Core Entities (Ships, Characters, Elements)
1. Add all missing attributes to Ship interface
2. Add all missing attributes to Character interface (especially `lname`, `task`, `level`)
3. Add all missing attributes to Element interface (especially atmosphere: `atm`, `atm2`, `hf`)
4. Extract nested child tags (`<feat>`, `<inv>`, `<ai>`, etc.)

### Phase 2: Parse The Mega-Hub (`<l>` tags)
1. Implement `type` attribute detection
2. Create separate interfaces for each `<l>` type:
   - `StarSystemLayer` (type="Star")
   - `AsteroidFieldLayer` (type="AsteroidField")
   - `PlanetLayer` (type="Planet")
   - `WarpGateLayer` (type="WarpGate")
   - `CryoPersonLayer` (type="CryoPerson")
   - `RelationshipLayer` (crew morale)
   - `FactionRelationshipLayer` (faction standings)
3. Extract relationship data for crew morale visualization
4. Extract faction relationship data

### Phase 3: Build ID Reference Graph
1. Create ID registry: Map<string, { type: string, id: string, path: string }>
2. Track all reference fields: `sid`, `ssid`, `cid`, `eid`, `entId`, `targetId`, `fac`, etc.
3. Build adjacency list for entity relationships
4. Validate reference integrity (detect broken references)

### Phase 4: Wide Capture Mode
1. Add `rawAttributes: Record<string, string>` to all interfaces
2. Add `unknownChildren: any[]` to preserve unrecognized nested tags
3. Capture EVERYTHING, categorize later
4. Generate reports on unknown attribute value distributions

### Phase 5: Data Visualization
1. Relationship graph: Crew morale/friendship network
2. Faction relationship map
3. Ship layout heatmap (atmosphere, temperature, damage)
4. Star system galaxy map
5. Entity connection graph (what references what)

---

## 💡 KEY INSIGHTS

1. **The `<l>` tag is overloaded** - It's used for 9+ completely different purposes. The `type` attribute is the discriminator.

2. **Crew relationships are fully modeled** - Friendship, attraction, compatibility, best friends, lovers all tracked in `<l>` entries with `targetId` references.

3. **Atmosphere simulation is detailed** - `atm` (pressure), `atm2` (composition), `hf` (heat/freeze) on every element and layer.

4. **Crafts are mixed with characters** - The `<c>` tag contains both crew members AND craft vessels (BU1, BU2, SH1). Distinguish by presence of `cname` attribute.

5. **Overlay system for modules** - Elements with `id="-1"` are overlay modules placed on hull tiles. This is how furniture/systems sit on floors.

6. **Faction system is complex** - Multiple faction IDs, relationship values, stances, patience levels tracked across `<l>` entries.

7. **Galaxy is massive** - 313 star systems total (1 visited, 312 unexplored). Each has `<l type="Star">` entry with position, seed, celestial bodies.

8. **Economic simulation exists** - Ship bank data with discounts/markups. Food preferences with usage values. Character belly stats (fat, vitamins, toxins, protein, carbs).

9. **Multi-level modules** - Elements can contain `<l>` children representing multiple floors/layers of the same tile.

10. **Extensive customization** - Character appearance has 10+ attributes (skin, hair, body, pose, colors). Ships have custom tile colors.

---

## 🚨 CRITICAL UNKNOWNS TO INVESTIGATE

1. What does `ndb` on ships actually do?
2. What are `cfb`, `env`, `hx` flags on elements?
3. How does `idCnt` relate to entity creation?
4. What is the difference between `id` and `cid` on characters?
5. What are `bs`, `bp`, `bb`, `bh` value mappings for character appearance?
6. How does the `<feat>` tag connect to module functionality?
7. What is stored in `<ai>` for character behavior?
8. How does `<inv>` structure differ across contexts?

---

## 📁 GENERATED REPORTS

This analysis generated 4 detailed reports:

1. **TAG_CATALOG.md** - Every tag with all attributes and sample values
2. **RELATIONSHIP_GRAPH.md** - Parent-child containment structure
3. **ID_REFERENCE_MAP.md** - Which tags have ID attributes
4. **CONNECTIVITY_ANALYSIS.md** - High-connectivity hub analysis

**Use these reports to**:
- Reference exact attribute names and value samples
- Understand XML structure hierarchy
- Identify cross-reference patterns
- Plan parser enhancements

---

## 🎬 CONCLUSION

**We have barely scratched the surface.** The save file contains:
- **291 unique tag types**
- **5,413 unique ID values**
- **9,388 module/element entries**
- **2,644 layer entries** (star systems, relationships, multi-level modules)
- **198 character/craft entries**

**Current extraction rate: ~15%**

**Path forward**: Implement wide-capture mode to preserve ALL data, then systematically decode unknown attributes through gameplay correlation and community knowledge.

**The data mesh exists** - ships → systems, characters → ships, elements → characters, relationships → characters, factions → relationships. All connections are trackable through ID attributes.

**Let the data speak**: Your hypothesis was correct. Ships, crew, crafts, sectors, and star systems are the focal points. The `<l>` tag emerged as an unexpected mega-hub binding it all together.
