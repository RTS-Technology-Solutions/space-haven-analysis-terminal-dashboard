import { useState } from 'react'
import TerminalPanel from '../components/ui/TerminalPanel'
import './BetaDashboard.css'

/**
 * Beta Dashboard - Visual-Only Polished Preview
 * Purpose: Show what the verified dashboard SHOULD look like with real data
 * NO UPLOAD, NO PARSING - Only visual components verified from DevDashboard
 * Data is hardcoded from actual save file for visual testing
 */

// ============================================================================
// HARDCODED REAL DATA (from user's game_20260605_1841.xml save file)
// ============================================================================
const VERIFIED_GAME_DATA = {
  // ✅ LEVEL 1: GAME DATA (All Verified)
  saveFileName: 'game_20260605_1841.xml',
  daysSurvived: 90,
  timestamp: new Date('2026-06-05T18:41:00'),
  visitedSystems: 3,
  unexploredSystems: 446,
  playerShips: 1,
  totalShips: 2,
  playerCrew: 6,
  totalCrew: 16,
  
  // ✅ LEVEL 2: STAR SYSTEMS (Verified: System Name, Ships in System, System ID, Visited)
  starSystems: [
    {
      systemId: 31,
      systemName: 'Sealice',
      shipsInSystem: 1,
      visited: true,
      isPlayerLocation: true,
      // ✅ LEVEL 3: CELESTIAL BODIES (All Verified)
      bodies: {
        totalBodies: 7,
        stars: 1,
        planets: 2,
        asteroidFields: 4,
        list: [
          { id: 20, type: 'Star', visited: true, starType: 'MainSequence', starClass: 'A', x: 91026, y: 221228, resources: [] },
          { id: 150, type: 'Planet', visited: false, x: 88430, y: 221977, resources: [{ name: 'Steel', quantity: 2 }] },
          { id: 151, type: 'Planet', visited: false, x: 87056, y: 220450, resources: [{ name: 'Copper', quantity: 1 }] },
          { id: 152, type: 'AsteroidField', visited: false, x: 90899, y: 219994, resources: [{ name: 'Iron', quantity: 3 }, { name: 'Oxygen', quantity: 2 }] },
          { id: 153, type: 'AsteroidField', visited: false, x: 93105, y: 222007, resources: [{ name: 'Carbon', quantity: 1 }] },
          { id: 154, type: 'AsteroidField', visited: false, x: 92619, y: 219443, resources: [] },
          { id: 155, type: 'AsteroidField', visited: false, x: 92090, y: 223437, resources: [] }
        ]
      }
    }
  ],
  
  // ✅ LEVEL 4: SHIPS (Verified: Ship Name, Ship ID, Ownership, Faction/Owner ID,
  //                             Hull Total Elements, Crew on Board, Hull Integrity,
  //                             Power Efficiency, Avg Crew Health, Avg Crew Mood)
  ships: [
    {
      shipId: '43',
      shipName: 'OSNX7-1',
      ownership: 'Player',
      factionId: 'Player',
      hullTotalElements: 168,
      crewOnBoard: 6,
      hullIntegrity: 71.80,
      powerEfficiency: 100.0,
      avgCrewHealth: 95.2,
      avgCrewMood: 82.5
    }
  ],
  
  // ✅ LEVEL 5: CREW (Verified: Name, ID, Health, Mood, Food, Energy, Comfort)
  crewMembers: [
    {
      crewId: '44',
      name: 'Annabelle',
      lastName: 'Dixon',
      health: 100,
      mood: 85,
      food: 92,
      energy: 78,
      comfort: 88
    },
    {
      crewId: '3162',
      name: 'Purity',
      lastName: 'Lynch',
      health: 98,
      mood: 80,
      food: 88,
      energy: 75,
      comfort: 85
    },
    {
      crewId: '784',
      name: 'Cain',
      lastName: 'Whitfield',
      health: 92,
      mood: 82,
      food: 90,
      energy: 80,
      comfort: 87
    }
  ]
}

export default function BetaDashboard() {
  // Selection state for hierarchy navigation
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null)

  const selectedSystem = VERIFIED_GAME_DATA.starSystems.find(s => s.systemId === selectedSystemId)
  const selectedShip = VERIFIED_GAME_DATA.ships.find(s => s.shipId === selectedShipId)
  const selectedCrew = VERIFIED_GAME_DATA.crewMembers.find(c => c.crewId === selectedCrewId)

  return (
    <div className="dashboard-page">
      {/* Visual Preview Banner */}
      <div className="beta-warning-banner">
        <div className="beta-warning-icon">✨</div>
        <div className="beta-warning-content">
          <h3 className="beta-warning-title">Visual Preview - Verified Components Only</h3>
          <p className="beta-warning-text">
            This page shows <strong>only verified metrics</strong> from DevDashboard with real game data. 
            This represents the polished visual target for the final release.
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* ✅ LEVEL 1: GAME DATA (All Verified)                            */}
      {/* ================================================================ */}
      <TerminalPanel title="🎮 LEVEL 1: GAME DATA" glow>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Root level - Save file metadata and overall game progress
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Save File Name</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>{VERIFIED_GAME_DATA.saveFileName}</div>
          </div>

          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Days Survived</div>
            <div className="stat-value">{VERIFIED_GAME_DATA.daysSurvived}</div>
          </div>

          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Game Timestamp</div>
            <div className="stat-value" style={{ fontSize: '0.9rem' }}>
              {VERIFIED_GAME_DATA.timestamp.toLocaleDateString()} {VERIFIED_GAME_DATA.timestamp.toLocaleTimeString()}
            </div>
          </div>

          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Star Systems</div>
            <div className="stat-value">
              <span style={{ color: 'var(--accent-green)' }}>{VERIFIED_GAME_DATA.visitedSystems}</span>
              {' '}
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>({VERIFIED_GAME_DATA.unexploredSystems})</span>
            </div>
          </div>

          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Ships</div>
            <div className="stat-value">
              <span style={{ color: 'var(--accent-green)' }}>{VERIFIED_GAME_DATA.playerShips}</span>
              {' '}
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>({VERIFIED_GAME_DATA.totalShips})</span>
            </div>
          </div>

          {/* ✅ VERIFIED */}
          <div className="stat-box">
            <div className="stat-label">Crew Members</div>
            <div className="stat-value">
              <span style={{ color: 'var(--accent-green)' }}>{VERIFIED_GAME_DATA.playerCrew}</span>
              {' '}
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>({VERIFIED_GAME_DATA.totalCrew})</span>
            </div>
          </div>
        </div>
      </TerminalPanel>

      {/* ================================================================ */}
      {/* ✅ LEVEL 2: STAR SYSTEM (Verified Components Only)              */}
      {/* ================================================================ */}
      <TerminalPanel title="⭐ LEVEL 2: STAR SYSTEM DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Planetary viewpoint - Star systems discovered
        </p>

        <div className="selector-wrapper">
          <label className="selector-label">Select Star System:</label>
          <select
            className="selector-dropdown"
            value={selectedSystemId || ''}
            onChange={(e) => {
              setSelectedSystemId(e.target.value ? Number(e.target.value) : null)
              setSelectedShipId(null)
              setSelectedCrewId(null)
            }}
          >
            <option value="">-- Select System --</option>
            {VERIFIED_GAME_DATA.starSystems.map(system => (
              <option key={system.systemId} value={system.systemId}>
                {system.isPlayerLocation ? '👤 ' : ''}{system.systemName} ({system.shipsInSystem} {system.shipsInSystem === 1 ? 'ship' : 'ships'})
              </option>
            ))}
          </select>
        </div>

        {selectedSystem && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            {/* ✅ VERIFIED */}
            <div className="stat-box">
              <div className="stat-label">System Name</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedSystem.systemName}</div>
            </div>

            {/* ✅ VERIFIED */}
            <div className="stat-box">
              <div className="stat-label">Ships in System</div>
              <div className="stat-value">{selectedSystem.shipsInSystem}</div>
            </div>

            {/* ✅ VERIFIED */}
            <div className="stat-box">
              <div className="stat-label">System ID</div>
              <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{selectedSystem.systemId}</div>
            </div>

            {/* ✅ VERIFIED */}
            <div className="stat-box">
              <div className="stat-label">Visited</div>
              <div className="stat-value" style={{ color: selectedSystem.visited ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                {selectedSystem.visited ? '✓ Yes' : 'No'}
              </div>
            </div>
          </div>
        )}
      </TerminalPanel>

      {/* ================================================================ */}
      {/* ✅ LEVEL 3: CELESTIAL BODIES (All Verified)                     */}
      {/* ================================================================ */}
      {selectedSystem && (
        <TerminalPanel title="🌍 LEVEL 3: CELESTIAL BODIES">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Celestial objects in {selectedSystem.systemName} - Stars, planets, asteroid fields, and resources
          </p>

          {/* ✅ ALL METRICS VERIFIED */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div className="stat-box">
              <div className="stat-label">Total Bodies</div>
              <div className="stat-value">{selectedSystem.bodies.totalBodies}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Stars</div>
              <div className="stat-value">{selectedSystem.bodies.stars}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Planets</div>
              <div className="stat-value">{selectedSystem.bodies.planets}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Asteroid Fields</div>
              <div className="stat-value">{selectedSystem.bodies.asteroidFields}</div>
            </div>
          </div>

          {/* Bodies List */}
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            {selectedSystem.bodies.list.map((body) => (
              <div key={body.id} style={{
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
                    {body.type === 'Star' && '⭐'} 
                    {body.type === 'Planet' && '🌍'} 
                    {body.type === 'AsteroidField' && '☄️'} 
                    {' '}<strong>{body.type}</strong> #{body.id}
                    {body.visited && <span style={{ color: 'var(--accent-green)', marginLeft: 'var(--space-sm)', fontSize: '0.9rem' }}>✓ Visited</span>}
                  </div>
                  {body.starType && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {body.starType} - Class {body.starClass}
                    </div>
                  )}
                  {body.resources.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: 'var(--space-xs)' }}>
                      Resources: {body.resources.map(r => `${r.name} (×${r.quantity})`).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                  ({body.x.toFixed(0)}, {body.y.toFixed(0)})
                </div>
              </div>
            ))}
          </div>
        </TerminalPanel>
      )}

      {/* ================================================================ */}
      {/* ✅ LEVEL 4: SHIP (Verified Components Only)                     */}
      {/* ================================================================ */}
      <TerminalPanel title="🚀 LEVEL 4: SHIP DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Local object viewpoint - Select a ship to view its systems and crew
        </p>

        <div className="selector-wrapper">
          <label className="selector-label">Select Ship:</label>
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
              {!selectedSystemId ? '-- Select a Star System First --' : '-- Select Ship --'}
            </option>
            {selectedSystemId && VERIFIED_GAME_DATA.ships.map(ship => (
              <option key={ship.shipId} value={ship.shipId}>
                {ship.shipName} ({ship.crewOnBoard} crew) {ship.ownership === 'Player' ? '👤' : ''}
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
              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Ship Name</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedShip.shipName}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Ship ID</div>
                <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{selectedShip.shipId}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Ownership</div>
                <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{selectedShip.ownership}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Faction/Owner ID</div>
                <div className="stat-value">{selectedShip.factionId}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Hull Total Elements</div>
                <div className="stat-value">{selectedShip.hullTotalElements}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Crew on Board</div>
                <div className="stat-value">{selectedShip.crewOnBoard}</div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Hull Integrity</div>
                <div className="stat-value" style={{ 
                  color: selectedShip.hullIntegrity > 90 ? 'var(--accent-green)' : 
                         selectedShip.hullIntegrity > 70 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedShip.hullIntegrity.toFixed(1)}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Power Efficiency</div>
                <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                  {selectedShip.powerEfficiency.toFixed(1)}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Avg Crew Health</div>
                <div className="stat-value" style={{ 
                  color: selectedShip.avgCrewHealth > 80 ? 'var(--accent-green)' : 
                         selectedShip.avgCrewHealth > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedShip.avgCrewHealth.toFixed(1)}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Avg Crew Mood</div>
                <div className="stat-value" style={{ 
                  color: selectedShip.avgCrewMood > 70 ? 'var(--accent-green)' : 
                         selectedShip.avgCrewMood > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedShip.avgCrewMood.toFixed(1)}%
                </div>
              </div>
            </div>
          </>
        )}
      </TerminalPanel>

      {/* ================================================================ */}
      {/* ✅ LEVEL 5: CREW (Verified Components Only)                     */}
      {/* ================================================================ */}
      <TerminalPanel title="👤 LEVEL 5: CREW DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Individual viewpoint - Crew vitals and status
        </p>

        <div className="selector-wrapper">
          <label className="selector-label">Select Crew Member:</label>
          <select
            className="selector-dropdown"
            value={selectedCrewId || ''}
            onChange={(e) => setSelectedCrewId(e.target.value || null)}
            disabled={!selectedShipId}
          >
            <option value="">
              {!selectedShipId ? '-- Select a Ship First --' : '-- Select Crew --'}
            </option>
            {selectedShipId && VERIFIED_GAME_DATA.crewMembers.map(crew => (
              <option key={crew.crewId} value={crew.crewId}>
                {crew.name} {crew.lastName}
              </option>
            ))}
          </select>
        </div>

        {selectedCrew && (
          <>
            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              Crew Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Name</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {selectedCrew.name} {selectedCrew.lastName}
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">ID</div>
                <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{selectedCrew.crewId}</div>
              </div>
            </div>

            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
              💓 Vital Statistics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Health</div>
                <div className="stat-value" style={{ 
                  color: selectedCrew.health > 80 ? 'var(--accent-green)' : 
                         selectedCrew.health > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedCrew.health}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Mood</div>
                <div className="stat-value" style={{ 
                  color: selectedCrew.mood > 70 ? 'var(--accent-green)' : 
                         selectedCrew.mood > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedCrew.mood}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Food</div>
                <div className="stat-value" style={{ 
                  color: selectedCrew.food > 80 ? 'var(--accent-green)' : 
                         selectedCrew.food > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedCrew.food}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Energy</div>
                <div className="stat-value" style={{ 
                  color: selectedCrew.energy > 80 ? 'var(--accent-green)' : 
                         selectedCrew.energy > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedCrew.energy}%
                </div>
              </div>

              {/* ✅ VERIFIED */}
              <div className="stat-box">
                <div className="stat-label">Comfort</div>
                <div className="stat-value" style={{ 
                  color: selectedCrew.comfort > 80 ? 'var(--accent-green)' : 
                         selectedCrew.comfort > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                }}>
                  {selectedCrew.comfort}%
                </div>
              </div>
            </div>
          </>
        )}
      </TerminalPanel>
    </div>
  )
}
