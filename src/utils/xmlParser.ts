import type { IdMappings, MappingItem, AttributeMapping, ParsedMappings } from '../types/mappings'

/**
 * Parses the community-sourced ID mappings XML file
 * This data dictionary maps save file IDs to human-readable game objects
 */
export async function loadIdMappings(): Promise<ParsedMappings> {
  try {
    const response = await fetch('/id_mappings.xml')
    const xmlText = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    // Parse simple category with id+name structure
    const parseCategory = (categoryName: string): MappingItem[] => {
      const items: MappingItem[] = []
      const categoryNode = xmlDoc.querySelector(`${categoryName}`)
      
      if (!categoryNode) return items

      // Handle irregular plurals: 'processes' → 'process' (not 'processe')
      const singularName = categoryName === 'processes' 
        ? 'process' 
        : categoryName.slice(0, -1)

      const itemNodes = categoryNode.querySelectorAll(singularName)
      
      itemNodes.forEach(node => {
        const id = node.querySelector('id')?.textContent || ''
        const name = node.querySelector('name')?.textContent || ''
        
        if (id && name) {
          items.push({ id, name })
        }
      })

      return items
    }

    // Parse attribute mappings with additional metadata
    const parseAttributeCategory = (categoryName: string, elementName: string): AttributeMapping[] => {
      const items: AttributeMapping[] = []
      const categoryNode = xmlDoc.querySelector(categoryName)
      
      if (!categoryNode) return items

      const itemNodes = categoryNode.querySelectorAll(elementName)
      
      itemNodes.forEach(node => {
        const name = node.querySelector('name')?.textContent || ''
        const description = node.querySelector('description')?.textContent || ''
        const valueType = node.querySelector('valueType')?.textContent || undefined
        const classification = node.querySelector('classification')?.textContent || undefined
        const range = node.querySelector('range')?.textContent || undefined
        const example = node.querySelector('example')?.textContent || undefined
        const status = node.querySelector('status')?.textContent || undefined
        
        if (name) {
          items.push({
            id: name, // For attributes, name serves as ID
            name,
            description,
            valueType,
            classification,
            range,
            example,
            status
          })
        }
      })

      return items
    }

    // Parse type-based categories (tileTypes, elementTypes)
    const parseTypeCategory = (categoryName: string, elementName: string): MappingItem[] => {
      const items: MappingItem[] = []
      const categoryNode = xmlDoc.querySelector(categoryName)
      
      if (!categoryNode) return items

      const itemNodes = categoryNode.querySelectorAll(elementName)
      
      itemNodes.forEach(node => {
        const name = node.querySelector('name')?.textContent || ''
        const description = node.querySelector('description')?.textContent || ''
        const ids = node.querySelector('ids')?.textContent || undefined
        
        if (name) {
          items.push({
            id: ids || name, // Use IDs if available, otherwise name
            name,
            description
          })
        }
      })

      return items
    }

    const mappings: IdMappings = {
      // Original game object mappings
      attributes: parseCategory('attributes'),  // Character attributes (Bravery, Zest, Intelligence, Perception)
      skills: parseCategory('skills'),
      traits: parseCategory('traits'),
      occupations: parseCategory('occupations'),
      characters: parseCategory('characters'),
      crafts: parseCategory('crafts'),
      explosions: parseCategory('explosions'),
      items: parseCategory('items'),
      processes: parseCategory('processes'),
      modules: parseCategory('modules'),
      
      // New attribute and type mappings
      tileAttributes: parseAttributeCategory('tileAttributes', 'attribute'),
      tileTypes: parseTypeCategory('tileTypes', 'tileType'),
      starmapAttributes: parseAttributeCategory('starmapAttributes', 'attribute'),
      systemAttributes: parseAttributeCategory('systemAttributes', 'attribute'),
      relationshipAttributes: parseAttributeCategory('relationshipAttributes', 'attribute'),
      elementTypes: parseTypeCategory('elementTypes', 'elementType'),
      shipAttributes: parseAttributeCategory('shipAttributes', 'attribute')
    }

    const totalCount = Object.values(mappings).reduce((sum, arr) => sum + arr.length, 0)

    return {
      ...mappings,
      totalCount
    }
  } catch (error) {
    console.error('Failed to load ID mappings:', error)
    throw error
  }
}

/**
 * Search across all mappings or within a specific category
 */
export function searchMappings(
  mappings: IdMappings,
  searchTerm: string,
  category?: keyof IdMappings
): MappingItem[] {
  const term = searchTerm.toLowerCase()
  
  if (category) {
    return mappings[category].filter(item =>
      item.id.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    )
  }

  // Search across all categories
  const results: MappingItem[] = []
  Object.values(mappings).forEach((items: MappingItem[]) => {
    items.forEach((item: MappingItem) => {
      if (
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      ) {
        results.push(item)
      }
    })
  })

  return results
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: keyof IdMappings): string {
  const names: Record<keyof IdMappings, string> = {
    skills: 'Skills',
    traits: 'Traits',
    occupations: 'Occupations',
    characters: 'Characters',
    crafts: 'Crafts',
    explosions: 'Explosions',
    items: 'Items',
    processes: 'Processes',
    modules: 'Modules',
    tileAttributes: 'Tile Attributes',
    tileTypes: 'Tile Types',
    starmapAttributes: 'Starmap Attributes',
    systemAttributes: 'System Attributes',
    relationshipAttributes: 'Relationship Attributes',
    elementTypes: 'Element Types',
    shipAttributes: 'Ship Attributes'
  }
  return names[category]
}

/**
 * Convert mapping items to Record<number, string> for game parser
 * Used for skills, where IDs are numeric
 */
export function toNumericMappings(items: MappingItem[]): Record<number, string> {
  const mappings: Record<number, string> = {}
  items.forEach(item => {
    const numId = parseInt(item.id, 10)
    if (!isNaN(numId)) {
      mappings[numId] = item.name
    }
  })
  return mappings
}

/**
 * Convert mapping items to Record<string, string> for game parser
 * Used for traits, occupations, items, etc.
 */
export function toStringMappings(items: MappingItem[]): Record<string, string> {
  const mappings: Record<string, string> = {}
  items.forEach(item => {
    mappings[item.id] = item.name
  })
  return mappings
}
