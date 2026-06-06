// Type definitions for Space Haven ID Mappings

export interface MappingItem {
  id: string
  name: string
  description?: string
}

// Extended mapping item with additional metadata
export interface AttributeMapping extends MappingItem {
  valueType?: string
  classification?: string
  range?: string
  example?: string
  status?: string
}

export interface IdMappings {
  // Original game object mappings
  skills: MappingItem[]
  traits: MappingItem[]
  occupations: MappingItem[]
  characters: MappingItem[]
  crafts: MappingItem[]
  explosions: MappingItem[]
  items: MappingItem[]
  processes: MappingItem[]
  modules: MappingItem[]
  
  // New attribute and type mappings
  tileAttributes: AttributeMapping[]
  tileTypes: MappingItem[]
  starmapAttributes: AttributeMapping[]
  systemAttributes: AttributeMapping[]
  relationshipAttributes: AttributeMapping[]
  elementTypes: MappingItem[]
  shipAttributes: AttributeMapping[]
}

export type MappingCategory = keyof IdMappings

export interface ParsedMappings extends IdMappings {
  totalCount: number
}
