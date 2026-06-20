import { useState, useEffect } from 'react'
import { loadIdMappings, getCategoryDisplayName, searchMappings } from '../utils/xmlParser'
import type { ParsedMappings, MappingCategory, MappingItem } from '../types/mappings'
import TerminalPanel from './ui/TerminalPanel'
import './DataSheets.css'

export default function DataSheets() {
  const [mappings, setMappings] = useState<ParsedMappings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<MappingCategory>('skills')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<MappingItem[]>([])

  useEffect(() => {
    loadIdMappings()
      .then(data => {
        setMappings(data)
        setFilteredData(data.skills)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!mappings) return

    if (searchTerm.trim()) {
      const results = searchMappings(mappings, searchTerm, activeCategory)
      setFilteredData(results)
    } else {
      setFilteredData(mappings[activeCategory])
    }
  }, [searchTerm, activeCategory, mappings])

  const handleCategoryChange = (category: MappingCategory) => {
    setActiveCategory(category)
    setSearchTerm('')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/id_mappings.xml'
    link.download = 'space_haven_id_mappings.xml'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="data-sheets-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>LOADING DATA DICTIONARY<span className="cursor-blink"></span></p>
        </div>
      </div>
    )
  }

  if (error || !mappings) {
    return (
      <div className="data-sheets-container">
        <TerminalPanel title="ERROR">
          <p style={{ color: 'var(--accent-red)' }}>
            Failed to load ID mappings: {error || 'Unknown error'}
          </p>
        </TerminalPanel>
      </div>
    )
  }

  const categories: MappingCategory[] = [
    'skills',
    'traits',
    'occupations',
    'characters',
    'crafts',
    'explosions',
    'items',
    'processes',
    'modules',
    'tileAttributes',
    'tileTypes',
    'starmapAttributes',
    'systemAttributes',
    'relationshipAttributes',
    'elementTypes',
    'shipAttributes'
  ]

  return (
    <div className="data-sheets-container">
      <header className="data-sheets-header">
        <div>
          <h1 className="font-display" style={{ fontSize: 'var(--font-xl)', marginBottom: '0.5rem' }}>
            <span className="text-glow">DATA DICTIONARY</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
            Community-sourced ID mappings • {mappings.totalCount} entries
          </p>
        </div>
        <button className="btn-terminal" onClick={handleDownload}>
          ⬇ DOWNLOAD XML
        </button>
      </header>

      <TerminalPanel>
        <div className="data-sheets-info">
          <p style={{ marginBottom: '0.5rem' }}>
            This data dictionary maps Space Haven save file IDs to human-readable game objects.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
            <span className="status-dot status-ok"></span>
            Compiled from community research and reverse engineering
          </p>
        </div>
      </TerminalPanel>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {getCategoryDisplayName(category)}
            <span className="tab-count">{mappings[category].length}</span>
          </button>
        ))}
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={`Search ${getCategoryDisplayName(activeCategory).toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <TerminalPanel title={`${getCategoryDisplayName(activeCategory).toUpperCase()} (${filteredData.length})`}>
        {filteredData.length > 0 ? (
          <div className="data-table-container">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>ID</th>
                  <th>NAME</th>
                  {filteredData.some(item => item.description) && <th>DESCRIPTION</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={`${item.id}-${index}`}>
                    <td>
                      <code className="id-code">{item.id}</code>
                    </td>
                    <td>{item.name}</td>
                    {filteredData.some(i => i.description) && (
                      <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                        {item.description || ''}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results">
            <p>No results found for "{searchTerm}"</p>
            <button className="btn-terminal btn-terminal-sm" onClick={() => setSearchTerm('')}>
              CLEAR SEARCH
            </button>
          </div>
        )}
      </TerminalPanel>

      <TerminalPanel title="ABOUT THIS DATA">
        <div style={{ fontSize: 'var(--font-sm)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1rem' }}>
            This data dictionary is the result of community-driven reverse engineering of Space Haven's save file format.
            The game stores data using numeric IDs, which are mapped to in-game objects through this reference file.
          </p>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>Credit:</strong> Compiled from Space Haven modding community research, 
            forums, and player contributions. This data is provided freely to the community for use in tools, mods, and analysis.
          </p>
          <p style={{ color: 'var(--accent-yellow)' }}>
            ⚠️ Some IDs may be deprecated, unused, or change between game versions. Use at your own discretion.
          </p>
        </div>
      </TerminalPanel>
    </div>
  )
}
