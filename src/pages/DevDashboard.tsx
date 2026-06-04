import { useState } from 'react'
import QuickStats from '../components/QuickStats'
import ShipSelector from '../components/ShipSelector'
import TerminalPanel from '../components/ui/TerminalPanel'
import { gameParser } from '../utils/gameParser'
import { metricsCalculator } from '../utils/metricsCalculator'
import type { GameSession, GameSessionMetrics, Ship } from '../types/gameData'
import './DevDashboard.css'

export default function DevDashboard() {
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [metrics, setMetrics] = useState<GameSessionMetrics | null>(null)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)
  const [showAllShips, setShowAllShips] = useState(false)  // Filter toggle
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const session = await gameParser.parseGameSave(text, file.name)
      const calculatedMetrics = metricsCalculator.calculateGameMetrics(session)
      
      setGameSession(session)
      setMetrics(calculatedMetrics)
      
      // Auto-select first player-owned ship if available, otherwise first ship
      const playerShips = session.ships.filter(s => s.isPlayerOwned)
      const firstShip = playerShips.length > 0 ? playerShips[0] : session.ships[0]
      
      if (firstShip) {
        setSelectedShipId(firstShip.shipId)
        console.log(`🎮 Auto-selected ${firstShip.isPlayerOwned ? 'player' : 'non-player'} ship: ${firstShip.shipName}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse save file')
      console.error('Parse error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setGameSession(null)
    setMetrics(null)
    setSelectedShipId(null)
    setShowAllShips(false)
    setError(null)
  }
  
  // Get the currently selected ship
  const selectedShip: Ship | undefined = gameSession?.ships.find(s => s.shipId === selectedShipId)
  
  // Filter ships based on ownership toggle
  const filteredShips = gameSession?.ships.filter(ship => 
    showAllShips ? true : ship.isPlayerOwned
  ) || []
  
  const playerShipCount = gameSession?.ships.filter(s => s.isPlayerOwned).length || 0
  const totalShipCount = gameSession?.ships.length || 0

  return (
    <div className="dashboard-page">
      {/* Beta Warning Banner */}
      <div className="beta-warning-banner">
        <div className="beta-warning-icon">🚧</div>
        <div className="beta-warning-content">
          <h3 className="beta-warning-title">⚡ Beta Preview - In Development</h3>
          <p className="beta-warning-text">
            This is an <strong>early access preview</strong> of the dashboard. Features are actively being developed and tested. 
            Expect bugs, incomplete features, and frequent updates. Full release coming <strong>June 20, 2026</strong>.
          </p>
        </div>
      </div>
      
      {!gameSession || !metrics ? (
        <TerminalPanel title="WELCOME TO S.H.A.T. COMMAND CENTER" glow>
          <p style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-lg)' }}>
            Upload a Space Haven save file to begin analysis<span className="cursor-blink"></span>
          </p>

          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <label htmlFor="save-file-input" className="btn-terminal btn-terminal-lg" style={{ cursor: 'pointer' }}>
              📁 SELECT SAVE FILE
              <input
                id="save-file-input"
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            {loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ color: 'var(--accent-cyan)' }}>Parsing save file...</p>
              </div>
            )}

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '4px' }}>
                <p style={{ color: 'var(--accent-red)' }}>❌ {error}</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'var(--terminal-bg-dark)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginTop: 0 }}>Where to find save files:</h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li><strong>Windows (Steam):</strong> <code>SteamLibrary\steamapps\common\SpaceHaven\savegames\</code></li>
              <li><strong>Windows (Standalone):</strong> <code>%USERPROFILE%\Documents\SpaceHaven\savegames\</code></li>
              <li><strong>Mac:</strong> <code>~/Library/Application Support/SpaceHaven/savegames/</code></li>
              <li><strong>Linux:</strong> <code>~/.local/share/SpaceHaven/savegames/</code></li>
            </ul>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', marginBottom: 0 }}>
              Look for files named "game" without an extension, or folders like "autosave1", "autosave2", etc.
            </p>
          </div>
        </TerminalPanel>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 'var(--space-lg)',
            padding: 'var(--space-md)',
            background: 'var(--terminal-bg)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--accent-cyan)', fontSize: 'var(--font-lg)' }}>
                📊 {gameSession.saveFileName}
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                {gameSession.timestamp.toLocaleDateString()} at {gameSession.timestamp.toLocaleTimeString()} • Day {gameSession.daysSurvived}
                {' • '}
                <span style={{ color: 'var(--accent-green)' }}>
                  🎮 Player Faction: {gameSession.playerFactionId}
                </span>
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="btn-terminal"
              style={{ whiteSpace: 'nowrap' }}
            >
              🔄 UPLOAD NEW FILE
            </button>
          </div>
          
          <QuickStats gameSession={gameSession} metrics={metrics} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {showAllShips ? (
                <>Showing all ships ({totalShipCount})</>
              ) : (
                <>Showing player ships ({playerShipCount} of {totalShipCount})</>
              )}
            </div>
            <button
              onClick={() => setShowAllShips(!showAllShips)}
              className="btn-terminal"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
            >
              {showAllShips ? '🎮 Show Player Only' : '🌐 Show All Ships'}
            </button>
          </div>
          
          <ShipSelector 
            ships={filteredShips}
            selectedShipId={selectedShipId}
            onSelectShip={setSelectedShipId}
          />
          
          {selectedShip && (
            <>
              <TerminalPanel title={`SHIP DETAILS: ${selectedShip.shipName}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="stat-box">
                    <div className="stat-label">Ship ID</div>
                    <div className="stat-value">{selectedShip.shipId}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Type</div>
                    <div className="stat-value">{selectedShip.shipType === 'station' ? '🏭 Station' : '🚀 Ship'}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Hull Tiles</div>
                    <div className="stat-value">{selectedShip.elements.length}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Crew (Player)</div>
                    <div className="stat-value">{selectedShip.crew.filter(c => c.side === 'Player').length}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Position</div>
                    <div className="stat-value">({selectedShip.positionX.toFixed(1)}, {selectedShip.positionY.toFixed(1)})</div>
                  </div>
                </div>
              </TerminalPanel>
              
              <TerminalPanel title="CREW ROSTER">
                {selectedShip.crew.filter(c => c.side === 'Player').length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--accent-green)' }}>Name</th>
                          <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--accent-green)' }}>Health</th>
                          <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--accent-green)' }}>Food</th>
                          <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--accent-green)' }}>Rest</th>
                          <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--accent-green)' }}>Mood</th>
                          <th style={{ textAlign: 'right', padding: '0.5rem', color: 'var(--accent-green)' }}>O₂</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--accent-green)' }}>Skills</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedShip.crew.filter(c => c.side === 'Player').map((crew, idx) => (
                          <tr key={`${crew.crewId}-${idx}`} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                            <td style={{ padding: '0.5rem' }}>{crew.name} {crew.lastName}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', color: crew.health > 80 ? 'var(--accent-green)' : crew.health > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                              {crew.health.toFixed(0)}
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{crew.food.toFixed(0)}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{crew.rest.toFixed(0)}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{crew.mood.toFixed(0)}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{crew.oxygen.toFixed(0)}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                              {crew.skills.slice(0, 3).map(s => s.skillName).join(', ')}
                              {crew.skills.length > 3 && ` +${crew.skills.length - 3} more`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No player crew found on this ship</p>
                )}
              </TerminalPanel>
              
              <TerminalPanel title="HULL CONDITION">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="stat-box">
                    <div className="stat-label">Operational</div>
                    <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                      {selectedShip.elements.filter(e => e.status === 'Operational').length}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Damaged</div>
                    <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>
                      {selectedShip.elements.filter(e => e.status === 'Damaged').length}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Critical</div>
                    <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
                      {selectedShip.elements.filter(e => e.status === 'Critical').length}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Destroyed</div>
                    <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
                      {selectedShip.elements.filter(e => e.status === 'Destroyed').length}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1rem' }}>
                  Total hull integrity: {((selectedShip.elements.filter(e => e.status === 'Operational').length / selectedShip.elements.length) * 100).toFixed(1)}%
                </p>
              </TerminalPanel>
            </>
          )}
        </>
      )}
    </div>
  )
}
