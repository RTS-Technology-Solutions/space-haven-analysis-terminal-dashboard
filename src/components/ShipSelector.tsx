import { Ship } from '../types/gameData'
import './ShipSelector.css'

interface ShipSelectorProps {
  ships: Ship[]
  selectedShipId: string | null
  onSelectShip: (shipId: string) => void
}

export default function ShipSelector({ ships, selectedShipId, onSelectShip }: ShipSelectorProps) {
  if (ships.length === 0) {
    return (
      <div className="ship-selector">
        <div className="no-ships-message">No ships found in save file</div>
      </div>
    )
  }

  // Auto-select first ship if none selected
  if (!selectedShipId && ships.length > 0) {
    setTimeout(() => onSelectShip(ships[0].shipId), 0)
  }

  return (
    <div className="ship-selector">
      <label className="selector-label">
        <span className="label-icon">🚀</span>
        SELECT SHIP/STATION
      </label>
      <div className="ship-selector-grid">
        {ships.map((ship) => {
          const isSelected = ship.shipId === selectedShipId
          const playerCrewCount = ship.crew.filter(c => c.side === 'Player').length
          const totalElements = ship.elements.length
          
          return (
            <button
              key={ship.shipId}
              className={`ship-card ${isSelected ? 'selected' : ''} ${ship.isPlayerOwned ? 'player-owned' : 'other-owned'}`}
              onClick={() => onSelectShip(ship.shipId)}
              title={`${ship.shipName} (${ship.shipId})${ship.isPlayerOwned ? ' - Player Owned' : ` - Owner: ${ship.ownerId}`}`}
            >
              <div className="ship-card-header">
                <span className="ship-type-badge">
                  {ship.shipType === 'station' ? '🏭' : '🚀'}
                </span>
                <h3 className="ship-name">{ship.shipName}</h3>
                {!ship.isPlayerOwned && (
                  <span className="ownership-badge" title={`Owner: ${ship.ownerId}`}>⚪</span>
                )}
              </div>
              
              <div className="ship-card-stats">
                <div className="ship-stat">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">{playerCrewCount}</span>
                  <span className="stat-label">crew</span>
                </div>
                <div className="ship-stat">
                  <span className="stat-icon">🔧</span>
                  <span className="stat-value">{totalElements}</span>
                  <span className="stat-label">tiles</span>
                </div>
              </div>
              
              {isSelected && (
                <div className="selected-indicator">
                  <span className="checkmark">✓</span>
                  ACTIVE
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
