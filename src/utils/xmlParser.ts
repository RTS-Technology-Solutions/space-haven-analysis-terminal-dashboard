import type { IdMappings, MappingItem, ParsedMappings } from '../types/mappings'

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

    const mappings: IdMappings = {
      skills: parseCategory('skills'),
      traits: parseCategory('traits'),
      occupations: parseCategory('occupations'),
      characters: parseCategory('characters'),
      crafts: parseCategory('crafts'),
      explosions: parseCategory('explosions'),
      items: parseCategory('items'),
      processes: parseCategory('processes'),
      modules: parseCategory('modules')
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
      item.name.toLowerCase().includes(term)
    )
  }

  // Search across all categories
  const results: MappingItem[] = []
  Object.values(mappings).forEach((items: MappingItem[]) => {
    items.forEach((item: MappingItem) => {
      if (
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term)
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
    modules: 'Modules'
  }
  return names[category]
}
