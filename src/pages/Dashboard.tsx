import { useState, useEffect } from 'react'
import TerminalPanel from '../components/ui/TerminalPanel'
import MetricTooltip from '../components/MetricTooltip'
import JsonTreeViewer from '../components/JsonTreeViewer'
import DebugInfo from '../components/DebugInfo'
import DataSharingConsent from '../components/DataSharingConsent'
import { createParserWithMappings } from '../utils/gameParser'
import type { GameSession } from '../types/gameData'
import './BetaDashboard.css' // Reuse beta styles
import '../components/DebugInfo.css' // Debug mode styles

/**
 * Dashboard - Official Game Analytics Dashboard
 * Purpose: Main dashboard for Space Haven game save analysis
 * Connects real XML parsing to hierarchical navigation UI
 */
export default function Dashboard() {
  // Parsing state
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Original XML storage for snapshot capture
  const [originalXmlText, setOriginalXmlText] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)

  // Selection state for each hierarchy level
  const [selectedSystemId, setSelectedSystemId] = useState<number | string | null>(null)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null)

  // Debug mode state
  const [debugMode, setDebugMode] = useState(false)

  // Snapshot consent state
  const [showConsentDialog, setShowConsentDialog] = useState(false)

  // Apply debug mode body class
  useEffect(() => {
    if (debugMode) {
      document.body.classList.add('debug-mode')
    } else {
      document.body.classList.remove('debug-mode')
    }
    return () => {
      document.body.classList.remove('debug-mode')
    }
  }, [debugMode])

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔧 Starting parse of', file.name)
      const text = await file.text()
      console.log('📄 File size:', text.length, 'bytes')
      
      // Store original XML for snapshot capture
      setOriginalXmlText(text)
      setOriginalFileName(file.name)
      
      // Create parser with id_mappings.xml loaded
      const parser = await createParserWithMappings()
      const session = await parser.parseGameSave(text, file.name)
      
      // Sort star systems alphabetically
      session.starSystems.sort((a, b) => {
        const nameA = a.systemName || ''
        const nameB = b.systemName || ''
        return nameA.localeCompare(nameB)
      })
      
      console.log('✅ Parsed game session:', session)
      console.log('📊 Ships:', session.ships.length)
      console.log('👥 Total Crew:', session.ships.reduce((sum, s) => sum + s.crew.length, 0))
      console.log('⭐ Systems:', session.starSystems.length)
      
      setGameSession(session)
      
      console.log('🎮 Game session loaded - ready for guided navigation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse save file')
      console.error('❌ Parse error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load example file handler
  const handleLoadExample = async () => {
    setLoading(true)
    setError(null)
    const exampleFileName = 'game_20260605_1841.xml'

    try {
      console.log('🔧 Loading example file:', exampleFileName)
      const response = await fetch(`/data/${exampleFileName}`)
      if (!response.ok) {
        throw new Error(`Failed to load example file: ${response.statusText}`)
      }
      
      const text = await response.text()
      console.log('📄 File size:', text.length, 'bytes')
      
      // Store original XML for snapshot capture
      setOriginalXmlText(text)
      setOriginalFileName(exampleFileName)
      
      // Create parser with id_mappings.xml loaded
      const parser = await createParserWithMappings()
      const session = await parser.parseGameSave(text, exampleFileName)
      
      // Sort star systems alphabetically
      session.starSystems.sort((a, b) => {
        const nameA = a.systemName || ''
        const nameB = b.systemName || ''
        return nameA.localeCompare(nameB)
      })
      
      console.log('✅ Parsed game session:', session)
      console.log('📊 Ships:', session.ships.length)
      console.log('👥 Total Crew:', session.ships.reduce((sum, s) => sum + s.crew.length, 0))
      console.log('⭐ Systems:', session.starSystems.length)
      
      setGameSession(session)
      
      console.log('🎮 Game session loaded - ready for guided navigation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load example file')
      console.error('❌ Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setGameSession(null)
    setSelectedSystemId(null)
    setSelectedShipId(null)
    setSelectedCrewId(null)
    setError(null)
    setOriginalXmlText(null)
    setOriginalFileName(null)
  }

  // Snapshot capture functions
  const captureHtmlSnapshot = (): string => {
    // Capture the current page HTML
    const dashboardElement = document.querySelector('.dashboard-page')
    if (!dashboardElement) {
      return '<html><body><p>Error: Could not capture dashboard HTML</p></body></html>'
    }

    // Clone the element to avoid modifying the live DOM
    const clone = dashboardElement.cloneNode(true) as HTMLElement

    // Remove interactive elements that don't make sense in a snapshot
    clone.querySelectorAll('button, input, select').forEach(el => {
      el.setAttribute('disabled', 'true')
    })

    // Build complete HTML document
    const htmlSnapshot = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Haven Insights - Snapshot ${new Date().toISOString()}</title>
  <style>
    /* Inline critical styles for standalone viewing */
    body { margin: 0; padding: 20px; background: #0a0a0a; color: #e0e0e0; font-family: monospace; }
    .dashboard-page { max-width: 1400px; margin: 0 auto; }
    .stat-box { border: 1px solid #00ffff; padding: 10px; margin: 5px; background: rgba(0,255,255,0.05); }
    .stat-label { color: #00ffff; font-size: 0.8rem; }
    .stat-value { color: #fff; font-size: 1.2rem; font-weight: bold; }
  </style>
</head>
<body>
  <div style="background: rgba(255,0,0,0.1); border: 2px solid #ff0000; padding: 15px; margin-bottom: 20px;">
    <h2 style="color: #ff0000; margin: 0;">📸 SNAPSHOT CAPTURE</h2>
    <p style="margin: 5px 0 0 0;">This is a static HTML snapshot captured at: ${new Date().toLocaleString()}</p>
    <p style="margin: 5px 0 0 0;">Original save file: ${originalFileName || 'Unknown'}</p>
  </div>
  ${clone.outerHTML}
</body>
</html>`

    return htmlSnapshot
  }

  const handleCreateSnapshot = () => {
    // Show consent dialog first
    setShowConsentDialog(true)
  }

  const handleConsentAccept = () => {
    setShowConsentDialog(false)
    
    if (!gameSession || !originalXmlText || !originalFileName) {
      alert('Error: No game data loaded. Please load a save file first.')
      return
    }

    try {
      console.log('📸 Creating snapshot package...')

      // 1. Prepare XML file
      const xmlBlob = new Blob([originalXmlText], { type: 'text/xml' })
      
      // 2. Prepare JSON file
      const replacer = (_key: string, value: any) => {
        if (value instanceof Date) {
          return value.toISOString()
        }
        return value
      }
      const jsonText = JSON.stringify(gameSession, replacer, 2)
      const jsonBlob = new Blob([jsonText], { type: 'application/json' })
      
      // 3. Capture HTML snapshot
      const htmlText = captureHtmlSnapshot()
      const htmlBlob = new Blob([htmlText], { type: 'text/html' })

      // 4. Create metadata file
      const metadata = {
        captureTimestamp: new Date().toISOString(),
        originalFileName: originalFileName,
        parsedSessionInfo: {
          saveFileName: gameSession.saveFileName,
          timestamp: gameSession.timestamp,
          daysSurvived: gameSession.daysSurvived,
          shipsCount: gameSession.ships.length,
          crewCount: gameSession.ships.reduce((sum, s) => sum + s.crew.length, 0),
          systemsCount: gameSession.starSystems.length
        },
        debugModeActive: debugMode,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        purpose: 'Debugging and research - submitted with user consent'
      }
      const metadataText = JSON.stringify(metadata, null, 2)
      const metadataBlob = new Blob([metadataText], { type: 'application/json' })

      // Download all files (in future, this could upload to cloud)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
      const baseName = originalFileName.replace('.xml', '')
      
      // Create download links for each file
      const downloads = [
        { blob: xmlBlob, name: `${baseName}_original.xml` },
        { blob: jsonBlob, name: `${baseName}_parsed.json` },
        { blob: htmlBlob, name: `${baseName}_snapshot.html` },
        { blob: metadataBlob, name: `${baseName}_metadata.json` }
      ]

      console.log('📦 Downloading snapshot package:')
      downloads.forEach(({ blob, name }) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `snapshot_${timestamp}_${name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log(`  ✅ Downloaded: ${name}`)
      })

      alert(`✅ Snapshot package created successfully!\n\n4 files downloaded:\n- Original XML\n- Parsed JSON\n- HTML Snapshot\n- Metadata\n\nThese files can be shared for debugging or research purposes.`)
      
    } catch (err) {
      console.error('❌ Snapshot creation failed:', err)
      alert(`Error creating snapshot: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleConsentDecline = () => {
    setShowConsentDialog(false)
    console.log('ℹ️ User declined data sharing consent')
  }

  // Get selected entities
  const selectedSystem = gameSession?.starSystems.find(s => s.systemId == selectedSystemId)
  const selectedShip = gameSession?.ships.find(s => s.shipId === selectedShipId)
  const selectedCrewMember = selectedShip?.crew.find(c => c.crewId === selectedCrewId)

  // Calculate derived stats
  const playerShipsCount = gameSession?.ships.filter(s => s.isPlayerOwned).length || 0
  const otherShipsCount = gameSession?.ships.filter(s => !s.isPlayerOwned).length || 0
  
  // Detect player's current system (where player-owned ship is located)
  const playerCurrentSystemId = gameSession?.ships.find(s => s.isPlayerOwned)?.systemId
  
  // Calculate ship counts per system for dropdown display
  const getShipCountForSystem = (systemId: string | number) => {
    return gameSession?.ships.filter(s => s.systemId == systemId).length || 0
  }
  const totalCrewCount = gameSession?.ships
    .filter(s => s.isPlayerOwned)
    .reduce((sum, s) => sum + s.crew.length, 0) || 0
  const otherCrewCount = gameSession?.ships
    .filter(s => !s.isPlayerOwned)
    .reduce((sum, s) => sum + s.crew.length, 0) || 0
  const visitedSystemsCount = gameSession?.starSystems.filter(s => s.visited).length || 0
  const unexploredSystemsCount = gameSession?.starSystems.filter(s => !s.visited).length || 0
  
  // If no game session loaded, show upload screen
  if (!gameSession) {
    return (
      <div className="dashboard-page">
        <div className="beta-warning-banner" style={{ 
          background: 'rgba(0, 255, 255, 0.1)',
          borderColor: 'var(--accent-cyan)'
        }}>
          <div className="beta-warning-icon">📊</div>
          <div className="beta-warning-content">
            <h3 className="beta-warning-title">📊 SPACE HAVEN ANALYSIS DASHBOARD</h3>
            <p className="beta-warning-text">
              Upload your Space Haven save file to analyze your game session. 
              View your ships, crew, systems, and resources in real-time. 
              Export data snapshots for research and community sharing.
            </p>
          </div>
        </div>

        <TerminalPanel title="📊 UPLOAD GAME SAVE FILE" glow>
          <p style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-lg)' }}>
            Upload a Space Haven save file to analyze your game progress<span className="cursor-blink"></span>
          </p>

          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <label htmlFor="save-file-input" className="btn-terminal btn-terminal-lg" style={{ cursor: 'pointer' }}>
                📁 SELECT GAME SAVE
                <input
                  id="save-file-input"
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              
              <button 
                className="btn-terminal btn-terminal-lg"
                onClick={handleLoadExample}
                disabled={loading}
              >
                🎯 LOAD EXAMPLE
              </button>
            </div>

            {loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
                  🔄 Parsing game save file...
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  This may take a moment for large save files
                </p>
              </div>
            )}

            {error && (
              <div style={{
                marginTop: '1.5rem',
                padding: 'var(--space-md)',
                background: 'rgba(255, 0, 0, 0.1)',
                border: '2px solid var(--accent-red)',
                borderRadius: 'var(--radius-md)'
              }}>
                <p style={{ color: 'var(--accent-red)', fontSize: '1rem', margin: 0 }}>
                  ❌ Error: {error}
                </p>
              </div>
            )}
          </div>
        </TerminalPanel>
      </div>
    )
  }

  // Game session loaded - show hierarchical dashboard
  return (
    <div className="dashboard-page">
      <div style={{
        background: 'rgba(0, 255, 255, 0.1)',
        border: '2px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        marginBottom: 'var(--space-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--accent-cyan)', fontSize: '1rem' }}>
            📊 {gameSession.saveFileName}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Loaded: {gameSession.timestamp.toLocaleString()} | 
            Ships: <span style={{ color: 'var(--accent-green)' }}>{playerShipsCount}</span>
            <span style={{ opacity: 0.6 }}> ({otherShipsCount})</span> | 
            Crew: <span style={{ color: 'var(--accent-green)' }}>{totalCrewCount}</span>
            <span style={{ opacity: 0.6 }}> ({otherCrewCount})</span> | 
            Systems: <span style={{ color: 'var(--accent-green)' }}>{visitedSystemsCount}</span>
            <span style={{ opacity: 0.6 }}> ({unexploredSystemsCount})</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <button 
            onClick={() => setDebugMode(!debugMode)} 
            className="btn-terminal" 
            style={{
              background: debugMode 
                ? 'linear-gradient(135deg, var(--accent-red) 0%, var(--accent-yellow) 100%)' 
                : 'rgba(0, 255, 255, 0.2)',
              borderColor: debugMode ? 'var(--accent-red)' : 'var(--accent-cyan)',
              color: debugMode ? '#000' : 'var(--accent-cyan)',
              fontWeight: 'bold'
            }}
          >
            {debugMode ? '🐛 DEBUG ON' : '🔍 DEBUG OFF'}
          </button>
          <button 
            onClick={handleCreateSnapshot}
            className="btn-terminal" 
            style={{
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
              borderColor: 'var(--accent-cyan)',
              color: '#000',
              fontWeight: 'bold'
            }}
            title="Create a snapshot package for debugging or research sharing"
          >
            📸 SNAPSHOT
          </button>
          <button onClick={handleReset} className="btn-terminal" style={{
            background: 'var(--accent-red)',
            borderColor: 'var(--accent-red)'
          }}>
            🔄 RESET & UPLOAD NEW
          </button>
        </div>
      </div>

      <DataSharingConsent
        isOpen={showConsentDialog}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />

      <TerminalPanel title="🎮 LEVEL 1: GAME DATA" glow>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Root level - Save file metadata and overall game progress
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <div className="stat-box">
            <div className="stat-label">
              Save File Name
              <MetricTooltip
                title="Save File Name"
                why="So that you can distinguish between multiple save files from different game sessions"
                how="Extracted from the uploaded XML filename"
                what="Use this to verify you're viewing the correct game save when comparing sessions"
              />
            </div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>{gameSession.saveFileName}</div>
          </div>

          <DebugInfo
            fieldId="game.daysSurvived"
            fieldLabel="Days Survived"
            dataSource="gameSession.daysSurvived (from XML root element attribute)"
            currentValue={gameSession.daysSurvived || 'N/A'}
            notes="This is the total days the player has survived in this game session"
            debugMode={debugMode}
          >
            <div className="stat-box">
              <div className="stat-label">
                Days Survived
                <MetricTooltip
                  title="Days Survived"
                  why="So that you can track overall progression and compare survival milestones across different playthroughs"
                  how="Extracted from game root element attribute"
                  what="Use this to gauge how established your colony is - longer survival means more research, resources, and infrastructure"
                />
              </div>
              <div className="stat-value">{gameSession.daysSurvived || 'N/A'}</div>
            </div>
          </DebugInfo>

          <div className="stat-box">
            <div className="stat-label">
              Game Timestamp
              <MetricTooltip
                title="Save Timestamp"
                why="So that you can track your gameplay sessions chronologically and identify your most recent progress"
                how="Extracted from filename pattern or file metadata"
                what="Use this to find your latest save when you have multiple game sessions"
              />
            </div>
            <div className="stat-value" style={{ fontSize: '0.9rem' }}>
              {gameSession.timestamp.toLocaleDateString()} {gameSession.timestamp.toLocaleTimeString()}
            </div>
          </div>

          <DebugInfo
            fieldId="game.starSystems"
            fieldLabel="Star Systems (Visited / Unexplored)"
            dataSource="gameSession.starSystems.filter(s => s.visited).length and .filter(s => !s.visited).length"
            currentValue={`${visitedSystemsCount} (${unexploredSystemsCount})`}
            notes="Visited count shows systems with visited=true, unexplored shows visited=false"
            debugMode={debugMode}
          >
            <div className="stat-box">
              <div className="stat-label">
                Star Systems
                <MetricTooltip
                  title="Star Systems (Visited / Unexplored)"
                  why="So that you understand how much of the map is covered and can plan your next hyperjump"
                  how="Visited count from systems where visited=true, unexplored count from systems where visited=false"
                  what="Plan your next hyperjump or perform resource gathering in new unexplored systems"
                />
              </div>
              <div className="stat-value">
                <span style={{ color: 'var(--accent-green)' }}>{visitedSystemsCount}</span>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.6, marginLeft: '0.25rem' }}>({unexploredSystemsCount})</span>
              </div>
            </div>
          </DebugInfo>

          <DebugInfo
            fieldId="game.ships"
            fieldLabel="Ships (Player / Other)"
            dataSource="gameSession.ships.filter(s => s.isPlayerOwned).length and .filter(s => !s.isPlayerOwned).length"
            currentValue={`${playerShipsCount} (${otherShipsCount})`}
            notes="Player ships determined by <settings owner='Player'>, Others include Civilian, Enemy, etc."
            debugMode={debugMode}
          >
            <div className="stat-box">
              <div className="stat-label">
                Ships
                <MetricTooltip
                  title="Ships (Player / Other)"
                  why="So that you can manage your fleet and identify trading or combat opportunities with other vessels"
                  how="Player ships from <settings owner='Player'>, other ships from <settings owner!='Player'> (e.g., Civilian, Enemy)"
                  what="Focus on your player ships for crew and resource management, or locate trade stations and allied vessels"
                />
              </div>
              <div className="stat-value">
                <span style={{ color: 'var(--accent-green)' }}>{playerShipsCount}</span>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.6, marginLeft: '0.25rem' }}>({otherShipsCount})</span>
              </div>
            </div>
          </DebugInfo>

          <DebugInfo
            fieldId="game.crewMembers"
            fieldLabel="Crew Members (Player / Other)"
            dataSource="Sum of ship.crew.length for player ships vs non-player ships"
            currentValue={`${totalCrewCount} (${otherCrewCount})`}
            notes="Crew extracted from <characters><c entId='...'> tags within each ship. Uses entId (not cid) for unique identification."
            debugMode={debugMode}
          >
            <div className="stat-box">
              <div className="stat-label">
                Crew Members
                <MetricTooltip
                  title="Crew Members (Player / Other)"
                  why="So that you can monitor your colonist population and identify NPC traders or potential crew recruitment opportunities"
                  how="Player crew from <characters> in player-owned ships, other crew from <characters> in non-player ships"
                  what="Manage your colonists' health, mood, and skills, or identify traders and station operators for commerce"
                />
              </div>
              <div className="stat-value">
                <span style={{ color: 'var(--accent-green)' }}>{totalCrewCount}</span>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.6, marginLeft: '0.25rem' }}>({otherCrewCount})</span>
              </div>
            </div>
          </DebugInfo>
        </div>
      </TerminalPanel>

      {gameSession.starSystems.length > 0 && (
        <TerminalPanel title="⭐ LEVEL 2: STAR SYSTEM DATA">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Planetary viewpoint (1M mile view) - Star systems discovered
          </p>

          <div className="selector-wrapper">
            <label className="selector-label">
              Select Star System:
            </label>
            <select
              className="selector-dropdown"
              value={selectedSystemId || ''}
              onChange={(e) => {
                setSelectedSystemId(e.target.value || null)
                setSelectedShipId(null)
                setSelectedCrewId(null)
              }}
            >
              <option value="">-- Select System --</option>
              {gameSession.starSystems
                .filter(system => system.systemId !== 0)
                .filter(system => system.visited === true)
                .filter(system => system.systemName && system.systemName.trim() !== '')
                .map(system => {
                  const shipCount = getShipCountForSystem(system.systemId)
                  const isPlayerHere = system.systemId == playerCurrentSystemId
                  return (
                    <option key={system.systemId} value={system.systemId}>
                      {isPlayerHere ? '👤 ' : ''}{system.systemName || `System ${system.systemId}`} ({shipCount} {shipCount === 1 ? 'ship' : 'ships'})
                    </option>
                  )
                })}
            </select>
          </div>

          {selectedSystem && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <div className="stat-box">
                <div className="stat-label">System Name</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {selectedSystem.systemName || `System ${selectedSystem.systemId}`}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">System Type</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>
                  {selectedSystem.systemType || 'Unknown'}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Ships in System</div>
                <div className="stat-value">
                  {getShipCountForSystem(selectedSystem.systemId)}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">System ID</div>
                <div className="stat-value" style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedSystem.systemId}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Visited</div>
                <div className="stat-value" style={{ color: selectedSystem.visited ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                  {selectedSystem.visited ? '✓ Yes' : 'No'}
                </div>
              </div>
            </div>
          )}
        </TerminalPanel>
      )}

      {selectedSystemId && selectedSystem && (
        <TerminalPanel title="🌍 LEVEL 3: CELESTIAL BODIES">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Celestial objects in {selectedSystem.systemName} - Stars, planets, asteroid fields, and resources
          </p>

          {selectedSystem.bodies && selectedSystem.bodies.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div className="stat-box">
                  <div className="stat-label">Total Bodies</div>
                  <div className="stat-value">{selectedSystem.bodies.length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Stars</div>
                  <div className="stat-value">{selectedSystem.bodies.filter(b => b.bodyType === 'Star').length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Planets</div>
                  <div className="stat-value">{selectedSystem.bodies.filter(b => b.bodyType === 'Planet').length}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Asteroid Fields</div>
                  <div className="stat-value">{selectedSystem.bodies.filter(b => b.bodyType === 'AsteroidField').length}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                {selectedSystem.bodies.map((body) => (
                  <div key={body.bodyId} style={{
                    padding: 'var(--space-md)',
                    background: 'var(--terminal-bg-dark)',
                    border: `1px solid ${body.visited ? 'var(--accent-green)' : 'rgba(0, 255, 255, 0.2)'}`,
                    borderRadius: 'var(--radius-sm)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 'var(--space-md)',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                        {body.bodyType === 'Star' && '⭐'} 
                        {body.bodyType === 'Planet' && '🌍'} 
                        {body.bodyType === 'AsteroidField' && '☄️'} 
                        {' '}<strong>{body.bodyType}</strong> #{body.bodyId}
                        {body.visited && <span style={{ color: 'var(--accent-green)', marginLeft: 'var(--space-sm)', fontSize: '0.9rem' }}>✓ Visited</span>}
                      </div>
                      {body.starType && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {body.starType} - Class {body.starClass}
                        </div>
                      )}
                      {body.resources.length > 0 && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: 'var(--space-xs)' }}>
                          Resources: {body.resources.map(r => `${r.resourceName} (×${r.quantity})`).join(', ')}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                      ({body.x.toFixed(0)}, {body.y.toFixed(0)})
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              padding: 'var(--space-lg)',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              background: 'rgba(0, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)'
            }}>
              No celestial bodies data available for this system
            </div>
          )}
        </TerminalPanel>
      )}

      <TerminalPanel title="🚀 LEVEL 4: SHIP DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Local object viewpoint - Select a star system first, then choose a ship to view its systems and crew. Number shows crew count.
        </p>

        <div className="selector-wrapper">
          <label className="selector-label">
            Select Ship:
          </label>
          <select
            className="selector-dropdown"
            value={selectedShipId || ''}
            onChange={(e) => {
              setSelectedShipId(e.target.value || null)
              setSelectedCrewId(null)
            }}
            disabled={!selectedSystemId}
          >
            <option value="">
              {!selectedSystemId 
                ? '-- Select a Star System First --' 
                : '-- Select Ship --'}
            </option>
            {selectedSystemId && gameSession.ships
              .filter(ship => ship.systemId == selectedSystemId)
              .map(ship => (
              <option key={ship.shipId} value={ship.shipId}>
                {ship.shipName} ({ship.crew.length} {ship.crew.length === 1 ? 'crew' : 'crew'}) {ship.isPlayerOwned ? '👤' : '🤖'}
              </option>
            ))}
          </select>
        </div>

        {selectedShip && (
          <>
            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              Ship Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <div className="stat-box">
                <div className="stat-label">Ship Name</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedShip.shipName}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Ship ID</div>
                <div className="stat-value" style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedShip.shipId}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Ownership</div>
                <div className="stat-value" style={{ 
                  fontSize: '1rem',
                  color: selectedShip.isPlayerOwned ? 'var(--accent-green)' : 'var(--text-primary)'
                }}>
                  {selectedShip.isPlayerOwned ? '👤 Player' : '🤖 NPC'}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Faction/Owner ID</div>
                <div className="stat-value" style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedShip.ownerId || 'N/A'}
                </div>
              </div>
            </div>

            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              🛠️ Hull & Systems
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <div className="stat-box">
                <div className="stat-label">Total Elements</div>
                <div className="stat-value">{selectedShip.elements.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Crew on Board</div>
                <div className="stat-value">{selectedShip.crew.length}</div>
              </div>
            </div>
          </>
        )}
      </TerminalPanel>

      <TerminalPanel title="👤 LEVEL 5: CREW DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Individual viewpoint - Select a ship first to view crew members. Choose a crew member to see their health and mood.
        </p>

        <div className="selector-wrapper">
          <label className="selector-label">
            Select Crew Member:
          </label>
          <select
            className="selector-dropdown"
            value={selectedCrewId || ''}
            onChange={(e) => setSelectedCrewId(e.target.value || null)}
            disabled={!selectedShipId || !selectedShip || selectedShip.crew.length === 0}
          >
            <option value="">
              {!selectedShipId 
                ? '-- Select a Ship First --'
                : !selectedShip
                  ? '-- Loading Ship Data --'
                  : selectedShip.crew.length === 0 
                    ? '-- No Crew on This Ship --' 
                    : '-- Select Crew --'}
            </option>
            {selectedShipId && selectedShip?.crew
              .filter(crew => crew.name !== 'Unknown' && crew.name.trim() !== '')
              .map(crew => (
                <option key={crew.crewId} value={crew.crewId}>
                  {crew.name} {crew.lastName}
                </option>
              ))}
          </select>
        </div>

        {selectedCrewMember && (
          <>
            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              Crew Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <div className="stat-box">
                <div className="stat-label">Name</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {selectedCrewMember.name} {selectedCrewMember.lastName}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Crew ID</div>
                <div className="stat-value" style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedCrewMember.crewId}
                </div>
              </div>
            </div>

            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              💓 Vital Statistics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              {[
                { label: 'Health', value: selectedCrewMember.health, rawValue: selectedCrewMember.health, baseMax: 100, icon: '❤️' },
                { label: 'Mood', value: selectedCrewMember.mood, rawValue: selectedCrewMember.mood, baseMax: 100, icon: '😊' }
              ].filter(v => v.value !== undefined).map((vital, idx) => (
                <div key={idx} style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(0, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {vital.icon} {vital.label}
                    </span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>{vital.rawValue ?? 0}</span>
                      <span style={{ color: 'var(--text-tertiary)', margin: '0 0.3rem' }}>/</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{vital.baseMax}</span>
                      <span style={{ 
                        marginLeft: '0.5rem',
                        color: (vital.rawValue ?? 0) > 80 ? 'var(--accent-green)' : 
                               (vital.rawValue ?? 0) > 50 ? 'var(--accent-yellow)' : 
                               (vital.rawValue ?? 0) > 30 ? 'var(--accent-orange)' : 'var(--accent-red)'
                      }}>
                        ({Math.min(100, ((vital.rawValue ?? 0) / vital.baseMax) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '12px', 
                    background: 'var(--terminal-bg-dark)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ 
                      width: `${Math.min(100, ((vital.rawValue ?? 0) / vital.baseMax) * 100)}%`,
                      height: '100%',
                      background: (vital.rawValue ?? 0) > 80 ? 'linear-gradient(90deg, var(--accent-green), #00ff88)' : 
                                 (vital.rawValue ?? 0) > 50 ? 'linear-gradient(90deg, var(--accent-yellow), #ffdd00)' : 
                                 (vital.rawValue ?? 0) > 30 ? 'linear-gradient(90deg, var(--accent-orange), #ff8800)' : 
                                                      'linear-gradient(90deg, var(--accent-red), #ff4444)',
                      transition: 'width 0.5s ease',
                      boxShadow: `0 0 10px ${(vital.rawValue ?? 0) > 80 ? 'var(--accent-green)' : (vital.rawValue ?? 0) > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'}`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </TerminalPanel>

      {debugMode && (
        <div style={{ 
          marginTop: 'var(--space-xl)', 
          padding: 'var(--space-md)', 
          border: '2px dashed var(--accent-yellow)', 
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 165, 0, 0.05)'
        }}>
          <details open>
            <summary style={{ 
              cursor: 'pointer', 
              color: 'var(--accent-yellow)', 
              fontSize: '1rem',
              fontWeight: 600,
              padding: 'var(--space-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>🐛 DEBUG: JSON Data Explorer (XML → JSON → Site)</span>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  const replacer = (_key: string, value: any) => {
                    if (value instanceof Date) {
                      return value.toISOString()
                    }
                    return value
                  }
                  const dataStr = JSON.stringify(gameSession, replacer, 2)
                  const blob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${gameSession.saveFileName.replace('.xml', '')}_parsed.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="btn-terminal"
                style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  background: 'var(--accent-cyan)',
                  borderColor: 'var(--accent-cyan)',
                  color: 'var(--bg-primary)'
                }}
              >
                💾 Download JSON
              </button>
            </summary>
            <div style={{ marginTop: 'var(--space-md)' }}>
              <JsonTreeViewer data={gameSession} rootLabel="GameSession" />
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
