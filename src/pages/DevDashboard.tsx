import { useState } from 'react'
import TerminalPanel from '../components/ui/TerminalPanel'
import MetricTooltip from '../components/MetricTooltip'
import { gameParser } from '../utils/gameParser'
import type { GameSession, Ship, CrewMember, StarSystem } from '../types/gameData'
import './BetaDashboard.css' // Reuse beta styles

/**
 * Dev Dashboard - Real Data Testing Version of Beta Wireframe
 * Purpose: Test real XML parsing with the hierarchical navigation UI
 * Connects actual game save data to the beta visual structure
 */
export default function DevDashboard() {
  // Parsing state
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selection state for each hierarchy level
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null)

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
      
      const session = await gameParser.parseGameSave(text, file.name)
      
      console.log('✅ Parsed game session:', session)
      console.log('📊 Ships:', session.ships.length)
      console.log('👥 Total Crew:', session.ships.reduce((sum, s) => sum + s.crew.length, 0))
      console.log('⭐ Systems:', session.starSystems.length)
      
      setGameSession(session)
      
      // Auto-select first system if available
      if (session.starSystems.length > 0) {
        setSelectedSystemId(session.starSystems[0].systemId)
      }
      
      // Auto-select first player ship if available
      const playerShip = session.ships.find(s => s.isPlayerOwned)
      if (playerShip) {
        setSelectedShipId(playerShip.shipId)
        console.log('🎮 Auto-selected player ship:', playerShip.shipName)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse save file')
      console.error('❌ Parse error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setGameSession(null)
    setSelectedSystemId(null)
    setSelectedSectorId(null)
    setSelectedShipId(null)
    setSelectedCrewId(null)
    setError(null)
  }

  // Get selected entities
  const selectedSystem = gameSession?.starSystems.find(s => s.systemId === selectedSystemId)
  const selectedShip = gameSession?.ships.find(s => s.shipId === selectedShipId)
  const selectedCrewMember = selectedShip?.crew.find(c => c.crewId === selectedCrewId)

  // Calculate derived stats
  const playerShipsCount = gameSession?.ships.filter(s => s.isPlayerOwned).length || 0
  const totalCrewCount = gameSession?.ships.reduce((sum, s) => sum + s.crew.length, 0) || 0
  const averageCrewHealth = selectedShip ? 
    selectedShip.crew.reduce((sum, c) => sum + c.health, 0) / selectedShip.crew.length : 0
  const averageCrewMood = selectedShip ?
    selectedShip.crew.reduce((sum, c) => sum + c.mood, 0) / selectedShip.crew.length : 0

  // If no game session loaded, show upload screen
  if (!gameSession) {
    return (
      <div className="dashboard-page">
        {/* Dev Warning Banner */}
        <div className="beta-warning-banner" style={{ 
          background: 'rgba(255, 165, 0, 0.1)',
          borderColor: 'var(--accent-yellow)'
        }}>
          <div className="beta-warning-icon">🔧</div>
          <div className="beta-warning-content">
            <h3 className="beta-warning-title">🔧 DEV DASHBOARD - Real Data Testing</h3>
            <p className="beta-warning-text">
              This is the <strong>development testing environment</strong> for real game save data. 
              Uses the same hierarchical UI as /beta-dash but connects to actual XML parsing. 
              <strong>Hidden in production.</strong> Open browser console (F12) to see parsing details.
            </p>
          </div>
        </div>

        <TerminalPanel title="🔧 DEV: UPLOAD GAME SAVE FILE" glow>
          <p style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-lg)' }}>
            Upload a Space Haven save file to test real data parsing<span className="cursor-blink"></span>
          </p>

          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <label htmlFor="save-file-input" className="btn-terminal btn-terminal-lg" style={{ cursor: 'pointer' }}>
              📁 SELECT SAVE FILE (.xml)
              <input
                id="save-file-input"
                type="file"
                accept=".xml"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

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

          <div style={{ 
            marginTop: '2rem', 
            padding: 'var(--space-md)', 
            background: 'rgba(0, 255, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0, 255, 255, 0.2)'
          }}>
            <h4 style={{ color: 'var(--accent-cyan)', marginTop: 0 }}>💡 Dev Notes:</h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              <li>Open browser console (F12) to see detailed parsing output</li>
              <li>Test files located in: <code>data/game_saves/</code></li>
              <li>Latest test file: <code>game_20260601_2202.xml</code></li>
              <li>Compare parsed data structure vs mock data structure</li>
              <li>Document confirmed XML paths in observations.md</li>
            </ul>
          </div>
        </TerminalPanel>
      </div>
    )
  }

  // Game session loaded - show hierarchical dashboard
  return (
    <div className="dashboard-page">
      {/* Dev Control Bar */}
      <div style={{
        background: 'rgba(255, 165, 0, 0.1)',
        border: '2px solid var(--accent-yellow)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        marginBottom: 'var(--space-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--accent-yellow)', fontSize: '1rem' }}>
            🔧 DEV MODE - {gameSession.saveFileName}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Loaded: {gameSession.timestamp.toLocaleString()} | Ships: {gameSession.ships.length} | 
            Player Ships: {playerShipsCount} | Total Crew: {totalCrewCount}
          </p>
        </div>
        <button onClick={handleReset} className="btn-terminal" style={{
          background: 'var(--accent-red)',
          borderColor: 'var(--accent-red)'
        }}>
          🔄 RESET & UPLOAD NEW
        </button>
      </div>

      {/* ================================================================ */}
      {/* LEVEL 1: GAME DATA (Always visible, no selector)                */}
      {/* ================================================================ */}
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
                why="Identifies which save file you're viewing"
                how="Extracted from the uploaded XML filename"
                what="Use this to distinguish between multiple save files from different game sessions"
              />
            </div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>{gameSession.saveFileName}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              Days Survived
              <MetricTooltip
                title="Days Survived"
                why="Primary measure of game progression"
                how="Extracted from game root element"
                what="Longer survival = more time to build, research, and explore"
              />
            </div>
            <div className="stat-value">{gameSession.daysSurvived || 'N/A'}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              Game Timestamp
              <MetricTooltip
                title="Save Timestamp"
                why="Shows when this save was created"
                how="Extracted from filename pattern or file modification time"
                what="Helps track your gameplay sessions chronologically"
              />
            </div>
            <div className="stat-value" style={{ fontSize: '0.9rem' }}>
              {gameSession.timestamp.toLocaleDateString()} {gameSession.timestamp.toLocaleTimeString()}
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Total Ships</div>
            <div className="stat-value">{gameSession.ships.length}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Player Ships</div>
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{playerShipsCount}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Total Crew</div>
            <div className="stat-value">{totalCrewCount}</div>
          </div>
        </div>
      </TerminalPanel>

      {/* ================================================================ */}
      {/* LEVEL 2: STAR SYSTEM (Selector if multiple systems)             */}
      {/* ================================================================ */}
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
                setSelectedSectorId(null)
                setSelectedShipId(null)
                setSelectedCrewId(null)
              }}
            >
              <option value="">-- Select System --</option>
              {gameSession.starSystems
                .filter(system => system.systemId !== 0 && system.systemId !== '0')
                .filter(system => system.systemName && system.systemName.trim() !== '')
                .map(system => (
                  <option key={system.systemId} value={system.systemId}>
                    {system.systemName || `System ${system.systemId}`}
                  </option>
                ))}
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
                <div className="stat-label">System ID</div>
                <div className="stat-value" style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedSystem.systemId}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Resources</div>
                <div className="stat-value">{selectedSystem.resources?.length || 0}</div>
              </div>
            </div>
          )}
        </TerminalPanel>
      )}

      {/* ================================================================ */}
      {/* LEVEL 3: SHIP (Ship selector)                                   */}
      {/* ================================================================ */}
      <TerminalPanel title="🚀 LEVEL 3: SHIP DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Local object viewpoint - Ship systems, crew, and condition stats
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
          >
            <option value="">-- Select Ship --</option>
            {gameSession.ships.map(ship => (
              <option key={ship.shipId} value={ship.shipId}>
                {ship.shipName} {ship.isPlayerOwned ? '👤 (Player)' : '🤖'}
              </option>
            ))}
          </select>
        </div>

        {selectedShip && (
          <>
            {/* Ship Overview Stats */}
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
                <div className="stat-label">Faction ID</div>
                <div className="stat-value" style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedShip.factionId}
                </div>
              </div>
            </div>

            {/* Hull & Systems */}
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
              <div className="stat-box">
                <div className="stat-label">Avg Crew Health</div>
                <div className="stat-value" style={{
                  color: averageCrewHealth > 80 ? 'var(--accent-green)' :
                         averageCrewHealth > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {averageCrewHealth > 0 ? averageCrewHealth.toFixed(1) + '%' : 'N/A'}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Avg Crew Mood</div>
                <div className="stat-value" style={{
                  color: averageCrewMood > 70 ? 'var(--accent-green)' :
                         averageCrewMood > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {averageCrewMood > 0 ? averageCrewMood.toFixed(1) + '%' : 'N/A'}
                </div>
              </div>
            </div>

            {/* Power Grid Info */}
            {selectedShip.powerGrid && (
              <>
                <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                  ⚡ Power Grid
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  <div className="stat-box">
                    <div className="stat-label">Generators</div>
                    <div className="stat-value">{selectedShip.powerGrid.generators.length}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Total Output</div>
                    <div className="stat-value">
                      {selectedShip.powerGrid.generators.reduce((sum, g) => sum + g.output, 0)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </TerminalPanel>

      {/* ================================================================ */}
      {/* LEVEL 4: CREW (Only shows after ship selected)                  */}
      {/* ================================================================ */}
      {selectedShipId && selectedShip && selectedShip.crew.length > 0 && (
        <TerminalPanel title="👤 LEVEL 4: CREW DATA">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Individual viewpoint - Crew skills, status, and conditions
          </p>

          <div className="selector-wrapper">
            <label className="selector-label">
              Select Crew Member:
            </label>
            <select
              className="selector-dropdown"
              value={selectedCrewId || ''}
              onChange={(e) => setSelectedCrewId(e.target.value || null)}
            >
              <option value="">-- Select Crew --</option>
              {selectedShip.crew
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
              {/* Crew Overview */}
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

              {/* Vital Stats */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                💓 Vital Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                {[
                  { label: 'Health', value: selectedCrewMember.health, icon: '❤️', showPercent: true },
                  { label: 'Mood', value: selectedCrewMember.mood, icon: '😊', showPercent: true },
                  { label: 'Energy', value: selectedCrewMember.energy, icon: '⚡', showPercent: true },
                  { label: 'Food', value: selectedCrewMember.food, icon: '🍽️', showPercent: true },
                  { label: 'Comfort', value: selectedCrewMember.comfort, icon: '🛏️', showPercent: true },
                  { label: 'Oxygen', value: selectedCrewMember.oxygen, icon: '💨', showPercent: true }
                ].map((vital, idx) => (
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
                        fontSize: '1.1rem', 
                        fontWeight: 600,
                        color: vital.value > 80 ? 'var(--accent-green)' : 
                               vital.value > 50 ? 'var(--accent-yellow)' : 
                               vital.value > 30 ? 'var(--accent-orange)' : 'var(--accent-red)'
                      }}>
                        {vital.value}{vital.showPercent ? '%' : ''}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ 
                      width: '100%', 
                      height: '12px', 
                      background: 'var(--terminal-bg-dark)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ 
                        width: `${vital.value}%`,
                        height: '100%',
                        background: vital.value > 80 ? 'linear-gradient(90deg, var(--accent-green), #00ff88)' : 
                                   vital.value > 50 ? 'linear-gradient(90deg, var(--accent-yellow), #ffdd00)' : 
                                   vital.value > 30 ? 'linear-gradient(90deg, var(--accent-orange), #ff8800)' : 
                                                      'linear-gradient(90deg, var(--accent-red), #ff4444)',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 10px ${vital.value > 80 ? 'var(--accent-green)' : vital.value > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'}`
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {selectedCrewMember.skills && selectedCrewMember.skills.length > 0 && (
                <>
                  <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                    Skills & Expertise
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                    {selectedCrewMember.skills.map((skill, idx) => (
                      <div key={idx} className="stat-box">
                        <div className="stat-label">{skill.skillName}</div>
                        <div className="stat-value">{skill.level}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </TerminalPanel>
      )}

      {/* Dev Data Inspector */}
      <div style={{ 
        marginTop: 'var(--space-xl)', 
        padding: 'var(--space-md)', 
        border: '2px dashed var(--accent-yellow)', 
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 165, 0, 0.05)'
      }}>
        <details>
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
            <span>🔍 DEV: Raw JSON Inspector (Click to expand)</span>
            <button
              onClick={(e) => {
                e.preventDefault()
                const dataStr = JSON.stringify(gameSession, null, 2)
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
                borderColor: 'var(--accent-cyan)'
              }}
            >
              💾 Download JSON
            </button>
          </summary>
          <div style={{ 
            marginTop: 'var(--space-md)',
            maxHeight: '500px',
            overflow: 'auto',
            background: 'var(--terminal-bg-dark)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <pre style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {JSON.stringify(gameSession, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}
