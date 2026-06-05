// Quick test of the parser with the earliest save file
import { readFileSync } from 'fs'
import { DOMParser } from '@xmldom/xmldom'

// Read the earliest save file
const xmlContent = readFileSync('E:/Programming Stuff/Gaming Projects/proj20260531_space_haven_insights/space-haven-insights/data/game_saves/game_20260531_1505.xml', 'utf-8')

console.log('✅ Save file loaded:', xmlContent.length, 'characters')

// Parse XML
const parser = new DOMParser()
const doc = parser.parseFromString(xmlContent, 'text/xml')

console.log('✅ XML parsed successfully')

// Check for ships
const ships = doc.querySelectorAll('ships > ship')
console.log('📊 Ships found:', ships.length)

// Check for crew
const characters = doc.querySelectorAll('characters > c')
console.log('👥 Crew members found:', characters.length)

// Check for star systems
const systems = doc.querySelectorAll('starmap systems > l')
console.log('⭐ Star systems found:', systems.length)

console.log('\n✨ Parser test complete! Ready to integrate.')
