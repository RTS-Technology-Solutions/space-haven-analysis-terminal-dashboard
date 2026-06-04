import { useState } from 'react'
import TerminalPanel from '../components/ui/TerminalPanel'
import MetricTooltip from '../components/MetricTooltip'
import { 
  mockGameSession, 
  mockStarSystems, 
  mockSectors, 
  mockShips, 
  mockCrew,
  mockStorage,
  mockHullElements
} from '../data/mockGameData'
import './BetaDashboard.css'

/**
 * Beta Dashboard - Hierarchical Expansion Wireframe
 * Purpose: Visualize hierarchical data navigation: Game → System → Sector → Ship → Crew
 * User selects at each level to drill deeper into the hierarchy
 */
export default function BetaDashboard() {
  // Selection state for each hierarchy level
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null)

  // Get selected entities
  const selectedSystem = mockStarSystems.find(s => s.systemId === selectedSystemId)
  const selectedSector = mockSectors.find(s => s.sectorId === selectedSectorId)
  const selectedShip = mockShips.find(s => s.shipId === selectedShipId)
  const selectedCrewMember = mockCrew.find(c => c.crewId === selectedCrewId)

  // Filter data by selections
  const sectorsInSystem = mockSectors.filter(s => s.systemId === selectedSystemId)
  const shipsInSector = mockShips.filter(s => s.sectorId === selectedSectorId)
  const crewOnShip = mockCrew.filter(c => c.shipId === selectedShipId)

  return (
    <div className="dashboard-page">
      {/* Beta Warning Banner */}
      <div className="beta-warning-banner">
        <div className="beta-warning-icon">🚧</div>
        <div className="beta-warning-content">
          <h3 className="beta-warning-title">⚡ Beta Preview - Hierarchical Wireframe</h3>
          <p className="beta-warning-text">
            This is a <strong>hierarchical navigation wireframe</strong> using mock data. 
            Select at each level to drill deeper: Game → Star System → Sector → Ship → Crew. 
            Full release coming <strong>June 20, 2026</strong>.
          </p>
        </div>
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
            <div className="stat-value" style={{ fontSize: '1rem' }}>{mockGameSession.saveFileName}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">
              Days Survived
              <MetricTooltip
                title="Days Survived"
                why="Primary measure of game progression"
                how="Extracted from <game> root element day counter"
                what="Longer survival = more time to build, research, and explore"
              />
            </div>
            <div className="stat-value">{mockGameSession.daysSurvived}</div>
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
              {mockGameSession.timestamp.toLocaleDateString()} {mockGameSession.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </TerminalPanel>

      {/* ================================================================ */}
      {/* LEVEL 2: STAR SYSTEM (Selector if multiple systems)             */}
      {/* ================================================================ */}
      <TerminalPanel title="⭐ LEVEL 2: STAR SYSTEM DATA">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          Planetary viewpoint (1M mile view) - Select a star system to view its sectors
        </p>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
            Select Star System:
          </label>
          <select
            value={selectedSystemId || ''}
            onChange={(e) => {
              setSelectedSystemId(e.target.value || null)
              setSelectedSectorId(null) // Reset lower levels
              setSelectedShipId(null)
              setSelectedCrewId(null)
            }}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: 'var(--space-sm)',
              background: 'var(--terminal-bg-dark)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <option value="">-- Select System --</option>
            {mockStarSystems.map(system => (
              <option key={system.systemId} value={system.systemId}>
                {system.systemName} (ID: {system.systemId})
              </option>
            ))}
          </select>
        </div>

        {selectedSystem && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
            <div className="stat-box">
              <div className="stat-label">System Name</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedSystem.systemName}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Sectors</div>
              <div className="stat-value">{selectedSystem.sectorsCount}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Celestial Bodies</div>
              <div className="stat-value">{selectedSystem.bodiesCount}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Asteroids</div>
              <div className="stat-value">{selectedSystem.asteroidsCount}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Factions Present</div>
              <div className="stat-value">{selectedSystem.factionsPresent}</div>
            </div>
          </div>
        )}
      </TerminalPanel>

      {/* ================================================================ */}
      {/* LEVEL 3: SECTOR (Only shows after system selected)              */}
      {/* ================================================================ */}
      {selectedSystemId && (
        <TerminalPanel title="📡 LEVEL 3: SECTOR DATA">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Tactical viewpoint (10,000ft view) - Immediate tactical area with ships, objects, and stations
          </p>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              Select Sector:
            </label>
            <select
              value={selectedSectorId || ''}
              onChange={(e) => {
                setSelectedSectorId(e.target.value || null)
                setSelectedShipId(null) // Reset lower levels
                setSelectedCrewId(null)
              }}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: 'var(--space-sm)',
                background: 'var(--terminal-bg-dark)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <option value="">-- Select Sector --</option>
              {sectorsInSystem.map(sector => (
                <option key={sector.sectorId} value={sector.sectorId}>
                  {sector.sectorName}
                </option>
              ))}
            </select>
          </div>

          {selectedSector && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
              <div className="stat-box">
                <div className="stat-label">Sector Name</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>{selectedSector.sectorName}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Ships in Sector</div>
                <div className="stat-value">{selectedSector.shipsCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Total Objects</div>
                <div className="stat-value">{selectedSector.objectsCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Asteroids</div>
                <div className="stat-value">{selectedSector.asteroidsCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Debris</div>
                <div className="stat-value">{selectedSector.debrisCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Stations</div>
                <div className="stat-value">{selectedSector.stationsCount}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Factions</div>
                <div className="stat-value" style={{ fontSize: '0.9rem' }}>
                  {selectedSector.factionsPresent.join(', ')}
                </div>
              </div>
            </div>
          )}
        </TerminalPanel>
      )}

      {/* ================================================================ */}
      {/* LEVEL 4: SHIP (Only shows after sector selected)                */}
      {/* ================================================================ */}
      {selectedSectorId && (
        <TerminalPanel title="🚀 LEVEL 4: SHIP DATA">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Local object viewpoint (XY pixel view) - Ship systems, crew, storage, and condition stats
          </p>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              Select Ship:
            </label>
            <select
              value={selectedShipId || ''}
              onChange={(e) => {
                setSelectedShipId(e.target.value || null)
                setSelectedCrewId(null) // Reset lower levels
              }}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: 'var(--space-sm)',
                background: 'var(--terminal-bg-dark)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <option value="">-- Select Ship --</option>
              {shipsInSector.map(ship => (
                <option key={ship.shipId} value={ship.shipId}>
                  {ship.shipName} ({ship.faction}) - {ship.shipType === 'station' ? '🏭 Station' : '🚀 Ship'}
                </option>
              ))}
            </select>
          </div>

          {selectedShip && (
            <>
              {/* Hull Alert (if damaged) */}
              {selectedShip.hullPercent < 90 && (
                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  border: '2px solid var(--accent-yellow)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)'
                }}>
                  <span style={{ fontSize: '2rem' }}>⚠️</span>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--accent-yellow)', fontSize: '1rem' }}>Hull Integrity Alert</h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Hull Stability: {selectedShip.hullIntegrity}/{selectedShip.hullMax} ({selectedShip.hullPercent.toFixed(1)}%) - {selectedShip.hullStatus}
                    </p>
                  </div>
                </div>
              )}

              {/* Ship Overview Stats */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 0, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                Ship Overview
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div className="stat-box">
                  <div className="stat-label">Ship Name</div>
                  <div className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedShip.shipName}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Type</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {selectedShip.shipType === 'station' ? '🏭 Station' : '🚀 Ship'}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Faction</div>
                  <div className="stat-value" style={{ 
                    fontSize: '1rem',
                    color: selectedShip.faction === 'Player' ? 'var(--accent-green)' : 
                           selectedShip.faction === 'Merchant' ? 'var(--accent-cyan)' : 'var(--text-primary)'
                  }}>
                    {selectedShip.faction}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Mass</div>
                  <div className="stat-value">{selectedShip.mass.toLocaleString()}</div>
                </div>
              </div>

              {/* Hull Construction Details */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                🛠️ Hull Construction
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                {mockHullElements.shipId === selectedShip.shipId && (
                  <>
                    <div className="stat-box">
                      <div className="stat-label">Total Elements</div>
                      <div className="stat-value">{mockHullElements.totalElements}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Operational</div>
                      <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{mockHullElements.operational}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Damaged</div>
                      <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>{mockHullElements.damaged}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Critical</div>
                      <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{mockHullElements.critical}</div>
                    </div>
                    {mockHullElements.breaches.length > 0 && (
                      <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                        <div className="stat-label">⚠️ Active Breaches</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-yellow)', marginTop: 'var(--space-sm)' }}>
                          {mockHullElements.breaches[0].severity} breach at sector ({mockHullElements.breaches[0].location.x}, {mockHullElements.breaches[0].location.y})
                          {mockHullElements.breaches[0].oxygenLeak && ' - Oxygen leak detected'}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Condition Stats */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                ⚡ Condition Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div className="stat-box">
                  <div className="stat-label">Hull Integrity</div>
                  <div className="stat-value" style={{ 
                    color: selectedShip.hullPercent > 90 ? 'var(--accent-green)' : 
                           selectedShip.hullPercent > 70 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                  }}>
                    {selectedShip.hullPercent.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                    {selectedShip.hullIntegrity}/{selectedShip.hullMax}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Power</div>
                  <div className="stat-value">{selectedShip.powerPercent.toFixed(1)}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                    {selectedShip.powerCurrent}/{selectedShip.powerMax}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Oxygen Level</div>
                  <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{selectedShip.oxygenLevel}%</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Food Stores</div>
                  <div className="stat-value">{selectedShip.foodStores}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Credits</div>
                  <div className="stat-value">{selectedShip.creditsOnBoard.toLocaleString()}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Average Mood</div>
                  <div className="stat-value" style={{ 
                    color: selectedShip.averageMood > 70 ? 'var(--accent-green)' : 
                           selectedShip.averageMood > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'
                  }}>
                    {selectedShip.averageMood}%
                  </div>
                </div>
              </div>

              {/* Crew & Systems */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                Crew & Systems
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
                <div className="stat-box">
                  <div className="stat-label">Crew on Board</div>
                  <div className="stat-value">{selectedShip.crewCount}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Robots</div>
                  <div className="stat-value">{selectedShip.robotsCount}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Crafts Onboard</div>
                  <div className="stat-value">{selectedShip.craftsOnboard}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Hyperspace Jumps</div>
                  <div className="stat-value">{selectedShip.hyperspaceJumpCount}</div>
                </div>
              </div>

              {/* Storage & Inventory */}
              {mockStorage.some(s => s.shipId === selectedShip.shipId) && (
                <>
                  <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                    📦 Storage & Inventory
                  </h3>
                  {mockStorage.filter(s => s.shipId === selectedShip.shipId).map((storage, idx) => (
                    <div key={idx}>
                      {storage.storageLocations.map((location, locIdx) => (
                        <div key={locIdx} style={{ marginBottom: 'var(--space-lg)' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 'var(--space-sm)',
                            padding: 'var(--space-sm)',
                            background: 'var(--terminal-bg-dark)',
                            borderRadius: 'var(--radius-sm)'
                          }}>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                              {location.locationName}
                            </h4>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              {location.used}/{location.capacity} ({((location.used/location.capacity)*100).toFixed(1)}%)
                            </span>
                          </div>
                          
                          {/* Progress bar for capacity */}
                          <div style={{ 
                            width: '100%', 
                            height: '8px', 
                            background: 'var(--terminal-bg-dark)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            marginBottom: 'var(--space-md)'
                          }}>
                            <div style={{ 
                              width: `${(location.used/location.capacity)*100}%`,
                              height: '100%',
                              background: (location.used/location.capacity) > 0.9 ? 'var(--accent-red)' : 
                                         (location.used/location.capacity) > 0.7 ? 'var(--accent-yellow)' : 'var(--accent-cyan)',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>

                          {/* Items grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
                            {location.items.map((item, itemIdx) => (
                              <div key={itemIdx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 'var(--space-sm)',
                                background: 'rgba(0, 255, 255, 0.05)',
                                border: '1px solid rgba(0, 255, 255, 0.2)',
                                borderRadius: 'var(--radius-sm)'
                              }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                  {item.itemName}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </TerminalPanel>
      )}

      {/* ================================================================ */}
      {/* LEVEL 5: CREW (Only shows after ship selected)                  */}
      {/* ================================================================ */}
      {selectedShipId && (
        <TerminalPanel title="👤 LEVEL 5: CREW DATA">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Individual viewpoint (profile view) - Crew skills, status, conditions, and schedule
          </p>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
              Select Crew Member:
            </label>
            <select
              value={selectedCrewId || ''}
              onChange={(e) => setSelectedCrewId(e.target.value || null)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: 'var(--space-sm)',
                background: 'var(--terminal-bg-dark)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <option value="">-- Select Crew --</option>
              {crewOnShip.map(crew => (
                <option key={crew.crewId} value={crew.crewId}>
                  {crew.name} {crew.lastName} - {crew.occupation}
                </option>
              ))}
            </select>
          </div>

          {selectedCrewMember && (
            <>
              {/* Crew Overview */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginTop: 0, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
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
                  <div className="stat-label">Occupation</div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>{selectedCrewMember.occupation}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Current Task</div>
                  <div className="stat-value" style={{ fontSize: '0.85rem' }}>{selectedCrewMember.currentTask}</div>
                </div>
              </div>

              {/* Vital Stats with Progress Bars */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                💓 Vital Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                {[
                  { label: 'Health', value: selectedCrewMember.health, icon: '❤️' },
                  { label: 'Mood', value: selectedCrewMember.mood, icon: '😊' },
                  { label: 'Energy', value: selectedCrewMember.energy, icon: '⚡' },
                  { label: 'Food', value: selectedCrewMember.food, icon: '🍽️' },
                  { label: 'Comfort', value: selectedCrewMember.comfort, icon: '🛏️' },
                  { label: 'Oxygen', value: selectedCrewMember.oxygen, icon: '💨' }
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
                        {vital.value}%
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
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                Skills & Expertise
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                {selectedCrewMember.skills.map((skill, idx) => (
                  <div key={idx} className="stat-box">
                    <div className="stat-label">{skill.skillName}</div>
                    <div className="stat-value">{skill.level}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                      Skill Points
                    </div>
                  </div>
                ))}
              </div>

              {/* Traits & Conditions */}
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1rem', marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                Traits & Conditions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
                <div className="stat-box">
                  <div className="stat-label">Traits</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 'var(--space-sm)' }}>
                    {selectedCrewMember.traits.join(', ')}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Active Conditions</div>
                  <div style={{ fontSize: '0.95rem', color: selectedCrewMember.conditions.length > 0 ? 'var(--accent-yellow)' : 'var(--accent-green)', marginTop: 'var(--space-sm)' }}>
                    {selectedCrewMember.conditions.length > 0 ? selectedCrewMember.conditions.join(', ') : 'None - Healthy'}
                  </div>
                </div>
              </div>
            </>
          )}
        </TerminalPanel>
      )}

      {/* Placeholder for future expansion */}
      <div style={{ 
        marginTop: 'var(--space-xl)', 
        padding: 'var(--space-xl)', 
        border: '2px dashed var(--border-dim)', 
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        color: 'var(--text-tertiary)'
      }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>
          🚧 Additional sections coming soon...
        </p>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
          Storage/Inventory • Hull Construction Details • Research Queue • Attack Systems
        </p>
      </div>
    </div>
  )
}
