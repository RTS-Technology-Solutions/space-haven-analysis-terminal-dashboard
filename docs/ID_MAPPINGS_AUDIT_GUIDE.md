# ID Mappings Audit Guide

**Purpose:** This document tracks which data fields in the save file need ID→name mappings from `id_mappings.xml`, whether those mappings exist, and whether the parser is applying them.

**Date:** June 15, 2026  
**Target Save File:** `game_20260605_1841.xml`  
**Mappings Source:** `dist/id_mappings.xml`

---

## 📊 Available Mapping Categories

### 1. **Skills** (19 mappings)
Maps crew member skill IDs to skill names.

| ID | Name |
|---|---|
| 1 | Construct |
| 2 | Mining |
| 3 | Botany |
| 4 | Construction |
| 5 | Industry |
| 6 | Medical |
| 7 | Gunner |
| 8 | Shielding |
| 9 | Operations |
| 10 | Weapons |
| 12 | Carry |
| 13 | Unknown (unused) |
| 14 | Navigation |
| 16 | Research |
| 22 | Piloting |
| 210 | Agility |
| 212 | Directing |
| 213 | Processing |
| 214 | Combat Operations |

**Used In Save File:** Crew member skill definitions  
**XML Path:** `<ships><l><crew><l><s>` (skill ID attribute)  
**Expected Dashboard Display:** Level 5 - Crew Skills section (skill names, not IDs)

---

### 2. **Traits** (24 mappings)
Maps character trait IDs to trait names (psychological/physical characteristics).

| ID | Name | Notes |
|---|---|---|
| 191 | Hero | |
| 655 | Wimp | |
| 656 | Clumsy | |
| 1034 | Moody | formerly 'Suicidal' |
| 1035 | Smart | |
| 1036 | Bloodlust | |
| 1037 | Antisocial | |
| 1038 | Needy | |
| 1039 | Fast Learner | |
| 1040 | Lazy | |
| 1041 | Hard Working | |
| 1042 | Psychopath | |
| 1043 | Peace Loving | |
| ... | (+ 11 more) | |

**Used In Save File:** Crew member traits  
**XML Path:** `<ships><l><crew><l><traits>` (individual trait IDs)  
**Expected Dashboard Display:** Could be shown in Level 5 crew detail (if implemented)

---

### 3. **Items/Resources** (50+ mappings)
Maps inventory/resource item IDs to readable names.

| ID | Name |
|---|---|
| 15 | Roots & Vegetables |
| 16 | Water |
| 34 | Power |
| 40 | Ice |
| 63 | O2 |
| 64 | CO2 |
| 71 | Biomass |
| 158 | Energium |
| 172 | Hyperium |
| 173 | Electronic Components |
| 174 | Energy Rod |
| 175 | Plastic |
| 176 | Chemicals |
| 177 | Fabric |
| 178 | Hyperfuel |
| 179 | Processed Food |
| 184 | Base Metals |
| 706 | Fruit |
| 707 | Artificial Meat |
| 712 | Space Food |
| 1759 | Hull Block |
| 1920 | Super Block |
| 1921 | Soft Block |
| 1922 | Steel Plate |
| ... | (+ 30+ more) |

**Used In Save File:** Resource deposits, storage inventory, ship inventory  
**XML Paths:**
- Celestial body resources: `<starmap><systems><l><bodies><l><stuff><s type="Resource" elementId="XXX">`
- Ship storage: `<ships><l><elements><l><stuff>` (inventory items)
- Crew inventory: `<ships><l><crew><l><inventory><l>`

**Expected Dashboard Display:**
- Level 3 (Celestial Bodies): Resource names instead of numeric IDs
- Level 4 (Ship Systems): Storage & Inventory section with item names
- Level 5 (Crew): Inventory items with names

---

### 4. **Modules/Elements** (20+ mappings)
Maps ship module/element type IDs to module names (what kind of room/system).

| ID | Name |
|---|---|
| -2 | Insulated Outer Hull Plating |
| 0 | Unbuilt Hull Canvas Space |
| 25 | Standard Interior Wall Partition |
| 43 | X1 Airlock Module |
| 44 | X2 Airlock Module |
| 46 | Hyperdrive Generator |
| 47 | Navigation Console Module |
| 51 | Oxygen Generator Facility |
| 76 | Wall Power Node |
| 90 | Bio-Vessel / Basic Hydroponics Bed |
| 115 | Small Storage Pod |
| 120 | Water Purifier / Ice Processor |
| 122 | Metal Refinery Module |
| 123 | Electronic Fabricator |
| 185 | Shield Core Module |
| 200 | Energy Laser Turret |
| 206 | Rocket / Missile Turret Module |
| 263 | Standard Bunk/Bed Module |
| 307 | Medical Center Bed Unit |
| 319 | Leisure Arcade Console |

**Used In Save File:** Ship element/module definitions  
**XML Path:** `<ships><l><elements><l m="XXX">` (m = module type ID)

**Expected Dashboard Display:** Level 4 (Ship Systems) - List elements with module names instead of numeric IDs

---

### 5. **Occupations** (31 mappings)
Maps crew member occupation IDs to job titles.

**Examples:** Engineer, Medic, Soldier, Scientist, Pilot, etc.

**Used In Save File:** Crew member occupation  
**XML Path:** `<ships><l><crew><l oId="XXX">` (occupation ID)

**Expected Dashboard Display:** Could be shown in Level 5 crew detail (if implemented)

---

### 6. **Characters** (11 mappings)
Maps named character IDs (pre-generated crew templates from game data).

**Used In Save File:** Named crew and hirable crew definitions  
**XML Path:** `<starmap><systems><l><bodies><l><fleets><f><createdShips><l><hireableCrew><l characterId="XXX">`

**Expected Dashboard Display:** Not typically needed in dashboard (crew show actual names, not character template IDs)

---

### 7. **Processes** (Many mappings)
Maps manufacturing/research process IDs to process names (what can be built/researched).

**Used In Save File:** Research queue, active constructions  
**Expected Dashboard Display:** Could be shown in research/construction progress (if implemented)

---

### 8. **Crafts** (15 mappings)
Maps craft/small ship IDs to craft names.

**Used In Save File:** Craft definitions in celestial bodies  
**Expected Dashboard Display:** Not needed for current MVP

---

### 9. **Explosions** (10 mappings)
Maps explosion type IDs to explosion names (weapon effects, reactor damage, etc.).

**Used In Save File:** Damage/destruction events  
**Expected Dashboard Display:** Not needed for current MVP

---

## 🔍 Data Extraction Audit Matrix

### Level 2: Star Systems

| Field | XML Path | Type | Mapping | Status | Notes |
|-------|----------|------|---------|--------|-------|
| System Name | `systemId` attribute + lookup | String | None (already hex-encoded name) | ⚠️ VERIFY | Name is hex-encoded in save file, not numeric ID |
| System ID | `systemId` attribute | Integer | None | ✅ | Direct numeric value |
| Ships in System | Count `<fleets>` | Integer | None | ⚠️ VERIFY | Should count fleet entries in system |
| Visited | `<info visited="boolean">` | Boolean | None | ⚠️ VERIFY | Need to check for this attribute |
| System Type | `starType` attribute on star body | Enum | **MISSING** | ❌ | Values: "MainSequence", "Red Giant", "White Dwarf", etc. — needs mapping |

---

### Level 3: Celestial Bodies

| Field | XML Path | Type | Mapping | Status | Notes |
|-------|----------|------|---------|--------|-------|
| Body Type | `type` attribute | String | None | ✅ | Star, Planet, AsteroidField, etc. (already readable) |
| Star Class | `starClass` attribute | String | None | ✅ | A, B, F, G, K, M (already readable) |
| Resource ID | `elementId` attribute | Integer | **Items mapping** | ❌ | e.g., `3513` should map to resource name |
| Resource Quantity | `howMuch` attribute | Integer | None | ✅ | Direct numeric value |
| Coordinates | `x`, `y` attributes | Integers | None | ✅ | Direct numeric values |

---

### Level 4: Ship Systems

| Field | XML Path | Type | Mapping | Status | Notes |
|-------|----------|------|---------|--------|-------|
| Ship Name | `shn` attribute | String | None | ✅ | Already human-readable |
| Ship ID | `slid` attribute | Integer | None | ✅ | Direct numeric value |
| Element Type ID | `m` attribute on `<e>` | Integer | **Modules mapping** | ❌ | e.g., `36` should map to module name |
| Hull Health | `hullHealth` attribute | Integer | None | ⚠️ VERIFY | Need max value for percentage calc |
| Shield Strength | `shieldStrength` attribute | Integer | None | ⚠️ VERIFY | Need max value for percentage calc |
| Inventory Item ID | `id` attribute on items | Integer | **Items mapping** | ❌ | e.g., `40` should map to item name |
| Inventory Quantity | `quantity` attribute | Integer | None | ✅ | Direct numeric value |
| Crew Count | Count `<crew>` | Integer | None | ✅ | Direct count |
| Crew Health Avg | Average crew `health` attributes | Decimal % | None | ⚠️ VERIFY | Calculation logic needed |
| Crew Mood Avg | Average crew `mood` attributes | Decimal % | None | ⚠️ VERIFY | Calculation logic needed |

---

### Level 5: Crew Data

| Field | XML Path | Type | Mapping | Status | Notes |
|-------|----------|------|---------|--------|-------|
| Crew Name | `name` + `lastName` attributes | String | None | ✅ | Already human-readable |
| Crew ID | `id` attribute | Integer | None | ✅ | Direct numeric value |
| Health % | `health` attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage (0-100) |
| Mood % | `mood` attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage (0-100) |
| Food % | `food` attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage (0-100) |
| Rest/Energy % | `restCounter` or energy attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage, find correct field |
| Comfort % | `comfort` attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage (0-100) |
| Oxygen Level % | `oxygen` attribute | Decimal (0-1) | None | ⚠️ VERIFY | Convert to percentage, inverse scale (100=0%, 0=100%?) |
| Skill ID | `id` attribute on `<s>` in crew skills | Integer | **Skills mapping** | ❌ | e.g., `1` should map to "Construct" |
| Occupation ID | `oId` attribute on crew | Integer | **Occupations mapping** | ❌ | e.g., `2` should map to occupation name |
| Trait IDs | Individual trait ID entries | Integer | **Traits mapping** | ❌ | Multiple traits per crew member |

---

## 🎯 Critical Integration Points

### Parser File: `src/utils/gameParser.ts`

**Required Changes:**
1. Load id_mappings.xml during parser initialization
2. Create lookup functions:
   - `lookupSkillName(id)` → return skill name
   - `lookupItemName(id)` → return item name
   - `lookupModuleName(id)` → return module name
   - `lookupOccupationName(id)` → return occupation name
   - `lookupTraitName(id)` → return trait name
3. Apply mappings during `parseGameSave()`:
   - Convert all resource IDs to names in celestial bodies
   - Convert all module type IDs to names in ship elements
   - Convert all skill IDs to names in crew skills
   - Convert occupation IDs to names
   - Convert trait IDs to names

---

### Dashboard Files: `src/pages/DevDashboard.tsx` + `BetaDashboard.tsx`

**Expected Behavior:**
- **Level 2:** System Type field shows actual value or hidden (currently shows "Unknown")
- **Level 3:** Resources display as "Iron", "Carbon", etc. (not numeric IDs like `3513`)
- **Level 4:** Module/element names show as "Standard Bunk", "Medical Center", etc. (not numeric IDs like `36`)
- **Level 4:** Inventory items show as "Base Metals", "Energy Rod", etc. (not numeric IDs)
- **Level 5:** Skills show as "Construct", "Mining", etc. (not numeric IDs)

---

## 📋 Audit Checklist

### Step 1: Verify ID Mappings Exist (Done ✅)
- [x] id_mappings.xml loaded with 9 categories
- [x] Skills: 19 entries
- [x] Items: 50+ entries
- [x] Modules: 20+ entries
- [x] Traits: 24 entries
- [x] Occupations: 31 entries
- [x] All others present

### Step 2: Test Parser Integration (Next)
- [ ] Load game_20260605_1841.xml
- [ ] Check parser applies skill mappings to crew
- [ ] Check parser applies item mappings to resources
- [ ] Check parser applies module mappings to ship elements
- [ ] Verify all converted values in console output

### Step 3: Verify Dashboard Display (Next)
- [ ] Level 2: System Type shows data or is hidden
- [ ] Level 3: Resources show names not IDs
- [ ] Level 4: Modules show names not IDs
- [ ] Level 4: Inventory items show names not IDs
- [ ] Level 5: Skills show names not IDs
- [ ] No "Unknown (ID: XXX)" or numeric fallbacks in display

### Step 4: Fix Any Missing Mappings (If Needed)
- [ ] If resource ID not in mappings → add to id_mappings.xml
- [ ] If module ID not in mappings → add to id_mappings.xml
- [ ] If skill ID not in mappings → add to id_mappings.xml
- [ ] Re-test dashboard

---

## 📝 Notes

- **Never hardcode** ID→name conversion in components or parser logic
- **Always use id_mappings.xml** as single source of truth
- **Hex-encoded strings** (like system names) are already readable, don't need mapping
- **Missing IDs in mappings** should be reported so id_mappings can be updated
- **Unknown values** in dashboard might indicate parser not applying mappings, not missing from id_mappings

---

**Next Action:** Execute Step 2 of audit checklist - test parser integration with game_20260605_1841.xml
