/**
 * ID Mappings Loader
 * Provides id_mappings.xml data in formats suitable for the game parser
 */

import { loadIdMappings, toNumericMappings, toStringMappings } from './xmlParser'
import type { ParsedMappings } from '../types/mappings'
import type { ParserConfig } from '../types/gameData'

// Global cache for loaded mappings
let cachedMappings: ParsedMappings | null = null

/**
 * Load and cache id_mappings.xml
 */
export async function getMappings(): Promise<ParsedMappings> {
  if (!cachedMappings) {
    cachedMappings = await loadIdMappings()
  }
  return cachedMappings
}

/**
 * Get parser configuration from loaded id_mappings
 * This converts id_mappings.xml into the format expected by SpaceHavenParser
 */
export async function getParserConfig(): Promise<ParserConfig> {
  const mappings = await getMappings()
  
  return {
    attributeMappings: toNumericMappings(mappings.attributes || []),
    skillMappings: toNumericMappings(mappings.skills),
    itemMappings: toStringMappings(mappings.items),
    traitMappings: toStringMappings(mappings.traits),
    occupationMappings: toStringMappings(mappings.occupations)
  }
}

/**
 * Get skill name by ID
 */
export async function getSkillName(skillId: number): Promise<string> {
  const mappings = await getMappings()
  const skill = mappings.skills.find(s => s.id === skillId.toString())
  return skill?.name || `Unknown Skill ${skillId}`
}

/**
 * Get trait name by ID
 */
export async function getTraitName(traitId: string): Promise<string> {
  const mappings = await getMappings()
  const trait = mappings.traits.find(t => t.id === traitId)
  return trait?.name || `Unknown Trait ${traitId}`
}

/**
 * Get occupation name by ID
 */
export async function getOccupationName(occupationId: string): Promise<string> {
  const mappings = await getMappings()
  const occupation = mappings.occupations.find(o => o.id === occupationId)
  return occupation?.name || `Unknown Occupation ${occupationId}`
}

/**
 * Get item name by ID
 */
export async function getItemName(itemId: string): Promise<string> {
  const mappings = await getMappings()
  const item = mappings.items.find(i => i.id === itemId)
  return item?.name || `Unknown Item ${itemId}`
}

/**
 * Get module name by ID
 */
export async function getModuleName(moduleId: string): Promise<string> {
  const mappings = await getMappings()
  const module = mappings.modules.find(m => m.id === moduleId)
  return module?.name || `Unknown Module ${moduleId}`
}

/**
 * Get element type description
 */
export async function getElementType(typeName: string): Promise<string> {
  const mappings = await getMappings()
  const elementType = mappings.elementTypes.find(e => e.name === typeName)
  return elementType?.description || typeName
}

/**
 * Get attribute description
 */
export async function getAttributeDescription(attributeName: string, category: 'tile' | 'starmap' | 'system' | 'relationship' | 'ship'): Promise<string> {
  const mappings = await getMappings()
  
  let categoryData
  switch (category) {
    case 'tile':
      categoryData = mappings.tileAttributes
      break
    case 'starmap':
      categoryData = mappings.starmapAttributes
      break
    case 'system':
      categoryData = mappings.systemAttributes
      break
    case 'relationship':
      categoryData = mappings.relationshipAttributes
      break
    case 'ship':
      categoryData = mappings.shipAttributes
      break
  }
  
  const attribute = categoryData?.find(a => a.name === attributeName)
  return attribute?.description || attributeName
}
