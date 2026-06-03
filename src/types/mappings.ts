// Type definitions for Space Haven ID Mappings

export interface MappingItem {
  id: string
  name: string
}

export interface IdMappings {
  skills: MappingItem[]
  traits: MappingItem[]
  occupations: MappingItem[]
  characters: MappingItem[]
  crafts: MappingItem[]
  explosions: MappingItem[]
  items: MappingItem[]
  processes: MappingItem[]
  modules: MappingItem[]
}

export type MappingCategory = keyof IdMappings

export interface ParsedMappings extends IdMappings {
  totalCount: number
}
