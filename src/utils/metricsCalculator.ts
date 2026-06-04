/**
 * Metrics Calculator for Space Haven Game Data
 * Derives insights and KPIs from parsed game state
 * 
 * NOTE: This is future implementation code for Phase 3.
 * Not used in beta wireframe. Contains intentional unused code.
 */

import type {
  GameSession,
  Ship,
  CrewMember,
  ShipMetrics,
  CrewMetrics,
  GameSessionMetrics
} from '../types/gameData'
import { WELLNESS_THRESHOLDS } from '../types/gameData'
import {
  calculateShipMetrics as calcShipMetrics,
  calculateCrewMetrics as calcCrewMetrics,
  calculateCrewWellness,
  calculateAverageShipHealth,
  calculateAverageCrewHealth
} from './extractionUtils'

export class MetricsCalculator {
  /**
   * Calculate all metrics for a game session
   */
  calculateGameMetrics(session: GameSession): GameSessionMetrics {
    console.group('📊 TIER 1: FLEET METRICS CALCULATION')
    
    // Filter to player-owned ships only
    const playerShips = session.ships.filter(s => s.isPlayerOwned)
    console.log(`🎮 Player Ships: ${playerShips.length} of ${session.ships.length} total`)
    
    // Calculate fleet-wide metrics
    const shipHealth = calculateAverageShipHealth(playerShips)
    const crewHealth = calculateAverageCrewHealth(playerShips)
    const systemsExplored = session.starSystems.filter(s => s.visited).length
    
    // Count total player crew across all ships
    const totalPlayerCrew = playerShips.reduce((sum, ship) => 
      sum + ship.crew.filter(c => c.side === 'Player').length, 0)
    
    console.log('📈 Fleet-Wide Metrics:', {
      'Total Player Ships': playerShips.length,
      'Total Player Crew': totalPlayerCrew,
      'Avg Ship Health': `${shipHealth}%`,
      'Avg Crew Wellness': `${crewHealth}%`,
      'Days Survived': session.daysSurvived,
      'Systems Explored': systemsExplored
    })
    
    console.log('⚠️ SCOPE: These metrics represent ALL player-owned ships/crew')
    console.groupEnd()
    
    return {
      daysSurvived: session.daysSurvived,
      systemsExplored,
      researchCompleted: 0,  // TODO: Extract from research tree
      
      overallHealthScore: Math.round((shipHealth + crewHealth) / 2),
      shipHealth,
      crewHealth,
      resourceHealth: 50,  // TODO: Calculate from resources
      
      totalResourcesValue: 0,  // TODO: Calculate
      credits: 0,  // TODO: Extract from game data
      tradingVolume: 0,  // TODO: Calculate
      
      averageFactionRelation: this.calculateAverageFactionRelation(session.factionRelations),
      alliesCount: session.factionRelations.filter(r => r.stance === 'allied' || r.stance === 'friendly').length,
      enemiesCount: session.factionRelations.filter(r => r.stance === 'hostile').length
    }
  }
  
  /**
   * Calculate ship-specific metrics (using extraction utils)
   */
  calculateShipMetrics(ship: Ship): ShipMetrics {
    console.group(`🚀 TIER 3: SHIP METRICS - ${ship.shipName}`)
    const metrics = calcShipMetrics(ship)
    
    console.log('⚙️ Ship-Specific Metrics:', {
      'Ship ID': ship.shipId,
      'Ship Name': ship.shipName,
      'Hull Integrity': `${metrics.hullIntegrity}%`,
      'Total Elements': ship.elements.length,
      'Operational': ship.elements.filter(e => e.status === 'Operational').length,
      'Damaged': ship.elements.filter(e => e.status === 'Damaged').length,
      'Destroyed': ship.elements.filter(e => e.status === 'Destroyed').length
    })
    
    console.log('⚠️ SCOPE: This is for ONE ship only:', ship.shipName)
    console.groupEnd()
    
    return metrics
  }
  
  /**
   * Calculate crew-specific metrics for a ship (using extraction utils)
   */
  calculateCrewMetrics(ship: Ship): CrewMetrics {
    console.group(`👥 TIER 3: CREW METRICS - ${ship.shipName}`)
    const metrics = calcCrewMetrics(ship)
    
    const playerCrew = ship.crew.filter(c => c.side === 'Player')
    
    console.log('👨‍🚀 Crew Breakdown:', {
      'Ship': ship.shipName,
      'Total Crew': ship.crew.length,
      'Player Crew': playerCrew.length,
      'Civilian Crew': ship.crew.filter(c => c.side === 'Civilian').length,
      'Hostile Crew': ship.crew.filter(c => c.side === 'Hostile').length,
      'Avg Wellness': `${metrics.averageWellness}%`
    })
    
    console.log('⚠️ SCOPE: This is for crew on ONE ship only:', ship.shipName)
    console.groupEnd()
    
    return metrics
  }
  
  
  /**
   * Calculate individual crew member wellness score (0-100)
   * @deprecated Use calculateCrewWellness from extractionUtils instead
   */
  calculateWellness(crewMember: CrewMember): number {
    return calculateCrewWellness(crewMember)
  }
  
  /**
   * Get wellness status category
   * @deprecated This method is kept for backwards compatibility
   */
  private _getWellnessStatus(wellness: number): string {
    if (wellness >= WELLNESS_THRESHOLDS.excellent) return 'excellent'
    if (wellness >= WELLNESS_THRESHOLDS.good) return 'good'
    if (wellness >= WELLNESS_THRESHOLDS.fair) return 'fair'
    if (wellness >= WELLNESS_THRESHOLDS.poor) return 'poor'
    return 'critical'
  }
  
  /**
   * Calculate average ship health across all ships
   * @deprecated Use calculateAverageShipHealth from extractionUtils
   */
  private _calculateAverageShipHealth(ships: Ship[]): number {
    return calculateAverageShipHealth(ships)
  }
  
  /**
   * Calculate average crew health across all ships
   * @deprecated Use calculateAverageCrewHealth from extractionUtils
   */
  private _calculateAverageCrewHealth(ships: Ship[]): number {
    return calculateAverageCrewHealth(ships)
  }
  
  private calculateAverageFactionRelation(relations: FactionRelation[]): number {
    if (relations.length === 0) return 0
    
    const total = relations.reduce((sum, rel) => sum + rel.relationshipValue, 0)
    return Math.round(total / relations.length)
  }
}

export const metricsCalculator = new MetricsCalculator()
