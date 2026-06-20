/**
 * XML Structure Analyzer for Space Haven Save Files
 * 
 * Purpose: Comprehensively document every tag, attribute, and relationship
 * in the save file to build a complete data model from actual game data.
 * 
 * Outputs:
 * 1. Tag catalog (every unique tag name)
 * 2. Attribute catalog (every attribute on each tag type)
 * 3. Parent-child relationships
 * 4. ID reference graph (what IDs point to what)
 * 5. High-connectivity hubs (most referenced entities)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { DOMParser } from '@xmldom/xmldom'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface TagInfo {
  tagName: string
  count: number
  attributes: Map<string, AttributeInfo>
  parents: Set<string>  // What tags contain this tag
  children: Set<string> // What tags this tag contains
  sampleValue?: string  // Text content sample
  hasIdAttribute: boolean
  idAttributeNames: Set<string> // All attribute names that look like IDs
}

interface AttributeInfo {
  name: string
  count: number
  sampleValues: Set<string>
  dataType: 'number' | 'string' | 'boolean' | 'id' | 'unknown'
}

interface IDReference {
  sourceTag: string
  sourceAttribute: string
  targetTag: string
  targetIdAttribute: string
  count: number
}

class XmlStructureAnalyzer {
  private tagCatalog: Map<string, TagInfo> = new Map()
  private idRegistry: Map<string, { tag: string, attribute: string, path: string }[]> = new Map()
  private idReferences: IDReference[] = []
  
  analyze(xmlFilePath: string): void {
    console.log(`📖 Analyzing XML structure: ${xmlFilePath}`)
    
    const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8')
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlContent, 'text/xml')
    
    console.log('🔍 Phase 1: Cataloging all tags and attributes...')
    this.catalogTags(doc.documentElement, null, '/')
    
    console.log('🔍 Phase 2: Building ID reference graph...')
    this.buildIdReferenceGraph()
    
    console.log('📊 Phase 3: Generating reports...')
    this.generateReports()
  }
  
  private catalogTags(node: Element, parentTag: string | null, path: string): void {
    if (node.nodeType !== 1) return // Only process element nodes
    
    const tagName = node.tagName
    const currentPath = `${path}${tagName}`
    
    // Get or create tag info
    if (!this.tagCatalog.has(tagName)) {
      this.tagCatalog.set(tagName, {
        tagName,
        count: 0,
        attributes: new Map(),
        parents: new Set(),
        children: new Set(),
        hasIdAttribute: false,
        idAttributeNames: new Set()
      })
    }
    
    const tagInfo = this.tagCatalog.get(tagName)!
    tagInfo.count++
    
    // Track parent-child relationships
    if (parentTag) {
      tagInfo.parents.add(parentTag)
      const parentInfo = this.tagCatalog.get(parentTag)
      if (parentInfo) {
        parentInfo.children.add(tagName)
      }
    }
    
    // Catalog attributes
    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i]
        const attrName = attr.name
        const attrValue = attr.value
        
        // Get or create attribute info
        if (!tagInfo.attributes.has(attrName)) {
          tagInfo.attributes.set(attrName, {
            name: attrName,
            count: 0,
            sampleValues: new Set(),
            dataType: this.inferDataType(attrValue, attrName)
          })
        }
        
        const attrInfo = tagInfo.attributes.get(attrName)!
        attrInfo.count++
        
        // Store sample values (limit to 10 unique samples)
        if (attrInfo.sampleValues.size < 10) {
          attrInfo.sampleValues.add(attrValue)
        }
        
        // Track ID attributes
        if (this.looksLikeId(attrName, attrValue)) {
          tagInfo.hasIdAttribute = true
          tagInfo.idAttributeNames.add(attrName)
          
          // Register this ID for reference tracking
          if (!this.idRegistry.has(attrValue)) {
            this.idRegistry.set(attrValue, [])
          }
          this.idRegistry.get(attrValue)!.push({
            tag: tagName,
            attribute: attrName,
            path: currentPath
          })
        }
      }
    }
    
    // Sample text content (if not just whitespace)
    const textContent = node.textContent?.trim()
    if (textContent && textContent.length > 0 && textContent.length < 100) {
      tagInfo.sampleValue = textContent
    }
    
    // Recursively process children
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i]
      if (child.nodeType === 1) { // Element node
        this.catalogTags(child as Element, tagName, `${currentPath}/`)
      }
    }
  }
  
  private inferDataType(value: string, attributeName: string): 'number' | 'string' | 'boolean' | 'id' | 'unknown' {
    // Check for ID-like attributes
    if (this.looksLikeId(attributeName, value)) {
      return 'id'
    }
    
    // Check for boolean
    if (value === 'true' || value === 'false' || value === '0' || value === '1') {
      return 'boolean'
    }
    
    // Check for number
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return 'number'
    }
    
    return 'string'
  }
  
  private looksLikeId(attributeName: string, value: string): boolean {
    // Attribute name patterns that suggest IDs
    const idPatterns = [
      /^id$/i,
      /id$/i, // ends with 'id'
      /^.*Id$/,  // camelCase ID
      /^sid$/,   // system ID
      /^cid$/,   // character ID
      /^eid$/,   // element ID
      /^ssid$/,  // star system ID
      /^factionId$/,
      /^elementId$/
    ]
    
    if (idPatterns.some(pattern => pattern.test(attributeName))) {
      return true
    }
    
    // Value patterns (numeric IDs, UUIDs, etc.)
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return true
    }
    
    return false
  }
  
  private buildIdReferenceGraph(): void {
    // This is a simplified version - we'd need to analyze the actual cross-references
    // For now, just document which tags have ID attributes
    console.log('  ID attribute detection complete')
    console.log(`  Found ${this.idRegistry.size} unique ID values`)
  }
  
  private generateReports(): void {
    const reportPath = path.join(__dirname, '..', 'analysis')
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true })
    }
    
    // Report 1: Tag Catalog
    this.generateTagCatalog(reportPath)
    
    // Report 2: Relationship Graph
    this.generateRelationshipGraph(reportPath)
    
    // Report 3: ID Reference Map
    this.generateIdReferenceMap(reportPath)
    
    // Report 4: High-Connectivity Hubs
    this.generateConnectivityAnalysis(reportPath)
  }
  
  private generateTagCatalog(reportPath: string): void {
    const filePath = path.join(reportPath, 'TAG_CATALOG.md')
    let markdown = `# Space Haven Save File - Tag Catalog\n\n`
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`
    markdown += `**Total Unique Tags**: ${this.tagCatalog.size}\n\n`
    markdown += `---\n\n`
    
    // Sort tags by count (most common first)
    const sortedTags = Array.from(this.tagCatalog.values())
      .sort((a, b) => b.count - a.count)
    
    for (const tagInfo of sortedTags) {
      markdown += `## \`<${tagInfo.tagName}>\` (${tagInfo.count} occurrences)\n\n`
      
      // Parent tags
      if (tagInfo.parents.size > 0) {
        markdown += `**Parent tags**: ${Array.from(tagInfo.parents).map(p => `\`<${p}>\``).join(', ')}\n\n`
      }
      
      // Child tags
      if (tagInfo.children.size > 0) {
        markdown += `**Child tags**: ${Array.from(tagInfo.children).map(c => `\`<${c}>\``).join(', ')}\n\n`
      }
      
      // Attributes
      if (tagInfo.attributes.size > 0) {
        markdown += `**Attributes**:\n\n`
        markdown += `| Attribute | Type | Count | Sample Values |\n`
        markdown += `|-----------|------|-------|---------------|\n`
        
        const sortedAttrs = Array.from(tagInfo.attributes.values())
          .sort((a, b) => b.count - a.count)
        
        for (const attr of sortedAttrs) {
          const samples = Array.from(attr.sampleValues).slice(0, 5).join(', ')
          markdown += `| \`${attr.name}\` | ${attr.dataType} | ${attr.count} | ${samples} |\n`
        }
        markdown += `\n`
      }
      
      // Has ID attributes
      if (tagInfo.hasIdAttribute) {
        markdown += `🔑 **Has ID attributes**: ${Array.from(tagInfo.idAttributeNames).map(id => `\`${id}\``).join(', ')}\n\n`
      }
      
      // Sample content
      if (tagInfo.sampleValue) {
        markdown += `**Sample text content**: "${tagInfo.sampleValue}"\n\n`
      }
      
      markdown += `---\n\n`
    }
    
    fs.writeFileSync(filePath, markdown, 'utf-8')
    console.log(`✅ Tag catalog written to: ${filePath}`)
  }
  
  private generateRelationshipGraph(reportPath: string): void {
    const filePath = path.join(reportPath, 'RELATIONSHIP_GRAPH.md')
    let markdown = `# Space Haven Save File - Relationship Graph\n\n`
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`
    markdown += `This document shows parent-child containment relationships.\n\n`
    markdown += `---\n\n`
    
    // Sort tags alphabetically for easier reference
    const sortedTags = Array.from(this.tagCatalog.values())
      .sort((a, b) => a.tagName.localeCompare(b.tagName))
    
    markdown += `## Tag Relationships\n\n`
    
    for (const tag of sortedTags) {
      markdown += `### \`<${tag.tagName}>\` (${tag.count}x)\n\n`
      
      if (tag.parents.size > 0) {
        markdown += `**Can appear inside**: ${Array.from(tag.parents).sort().map(p => `\`<${p}>\``).join(', ')}\n\n`
      } else {
        markdown += `**Root tag** (no parents)\n\n`
      }
      
      if (tag.children.size > 0) {
        markdown += `**Can contain**: ${Array.from(tag.children).sort().map(c => `\`<${c}>\``).join(', ')}\n\n`
      }
      
      markdown += `---\n\n`
    }
    
    fs.writeFileSync(filePath, markdown, 'utf-8')
    console.log(`✅ Relationship graph written to: ${filePath}`)
  }
  
  private generateIdReferenceMap(reportPath: string): void {
    const filePath = path.join(reportPath, 'ID_REFERENCE_MAP.md')
    let markdown = `# Space Haven Save File - ID Reference Map\n\n`
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`
    markdown += `**Total Unique IDs**: ${this.idRegistry.size}\n\n`
    markdown += `This shows which tags have ID attributes and how they might reference each other.\n\n`
    markdown += `---\n\n`
    
    // Group by tag type
    const tagIdMap = new Map<string, Set<string>>()
    
    for (const [, locations] of this.idRegistry) {
      for (const loc of locations) {
        if (!tagIdMap.has(loc.tag)) {
          tagIdMap.set(loc.tag, new Set())
        }
        tagIdMap.get(loc.tag)!.add(loc.attribute)
      }
    }
    
    markdown += `## Tags with ID Attributes\n\n`
    
    for (const [tag, idAttrs] of Array.from(tagIdMap.entries()).sort()) {
      markdown += `### \`<${tag}>\`\n\n`
      markdown += `ID attributes: ${Array.from(idAttrs).map(a => `\`${a}\``).join(', ')}\n\n`
    }
    
    fs.writeFileSync(filePath, markdown, 'utf-8')
    console.log(`✅ ID reference map written to: ${filePath}`)
  }
  
  private generateConnectivityAnalysis(reportPath: string): void {
    const filePath = path.join(reportPath, 'CONNECTIVITY_ANALYSIS.md')
    let markdown = `# Space Haven Save File - Connectivity Analysis\n\n`
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`
    markdown += `This identifies the "hub" tags with the most connections (parents + children).\n\n`
    markdown += `---\n\n`
    
    // Calculate connectivity score for each tag
    interface ConnectivityScore {
      tag: string
      parentCount: number
      childCount: number
      totalConnections: number
      occurrences: number
      hasIds: boolean
    }
    
    const scores: ConnectivityScore[] = Array.from(this.tagCatalog.values())
      .map(tag => ({
        tag: tag.tagName,
        parentCount: tag.parents.size,
        childCount: tag.children.size,
        totalConnections: tag.parents.size + tag.children.size,
        occurrences: tag.count,
        hasIds: tag.hasIdAttribute
      }))
      .sort((a, b) => b.totalConnections - a.totalConnections)
    
    markdown += `## High-Connectivity Hubs\n\n`
    markdown += `Tags sorted by total connections (parents + children):\n\n`
    markdown += `| Rank | Tag | Parents | Children | Total | Occurrences | Has IDs |\n`
    markdown += `|------|-----|---------|----------|-------|-------------|----------|\n`
    
    scores.slice(0, 30).forEach((score, index) => {
      const idIndicator = score.hasIds ? '🔑' : ''
      markdown += `| ${index + 1} | \`<${score.tag}>\` | ${score.parentCount} | ${score.childCount} | **${score.totalConnections}** | ${score.occurrences} | ${idIndicator} |\n`
    })
    
    markdown += `\n---\n\n`
    markdown += `## Interpretation\n\n`
    markdown += `- **High parent + child count**: Container/structural tags\n`
    markdown += `- **High occurrence + has IDs**: Likely entity/data tags (ships, crew, items)\n`
    markdown += `- **🔑 Has IDs**: Can be referenced by other parts of the save file\n\n`
    
    fs.writeFileSync(filePath, markdown, 'utf-8')
    console.log(`✅ Connectivity analysis written to: ${filePath}`)
  }
}

// Main execution
const analyzer = new XmlStructureAnalyzer()
const saveFilePath = process.argv[2] || path.join(__dirname, '..', '..', '..', 'space-haven-insights', 'data', 'game_saves', 'game_20260605_1841.xml')

analyzer.analyze(saveFilePath)

console.log('✨ Analysis complete!')
