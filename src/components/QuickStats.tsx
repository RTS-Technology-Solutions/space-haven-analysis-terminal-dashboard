import type { GameSession, GameSessionMetrics } from '../types/gameData'
import MetricTooltip from './MetricTooltip'
import './QuickStats.css'

interface QuickStatsProps {
  gameSession: GameSession
  metrics: GameSessionMetrics
}

export default function QuickStats({ gameSession, metrics }: QuickStatsProps) {
  const totalCrew = gameSession.ships.reduce((sum, ship) => 
    sum + ship.crew.filter(c => c.side === 'Player').length, 0)
  
  const getHealthColor = (health: number): string => {
    if (health >= 80) return 'var(--accent-green)'
    if (health >= 60) return 'var(--accent-yellow)'
    return 'var(--accent-red)'
  }
  
  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-icon">🚀</div>
        <div className="stat-value">{gameSession.ships.length}</div>
        <div className="stat-label">
          SHIPS
          <MetricTooltip
            title="Ships"
            why="Track the total number of ships/stations under your command. Essential for fleet management and understanding your operational capacity."
            how={
              <>
                Count all <span className="highlight">ships</span> in the save file that belong to your faction.
                <div className="formula">Total Ships = Ships marked with your faction ID</div>
              </>
            }
            what="Monitor fleet growth. If you have too few ships, focus on construction or capturing enemy vessels. If you have many ships, ensure adequate crew distribution and resources for maintenance."
          />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-value">{totalCrew}</div>
        <div className="stat-label">
          CREW
          <MetricTooltip
            title="Crew Count"
            why="Your crew is your most valuable resource. They operate ships, perform tasks, and keep your fleet running. Low crew means limited operational capacity."
            how={
              <>
                Sum of all <span className="highlight">Player-sided characters</span> across all ships.
                <div className="formula">Total Crew = Σ (crew members with side="Player")</div>
              </>
            }
            what="Maintain adequate crew levels. If low, prioritize recruiting or rescuing survivors. If high, ensure sufficient food, oxygen, and living quarters to support them all."
          />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🛡️</div>
        <div className="stat-value">{metrics.shipHealth}%</div>
        <div className="stat-label">
          SHIP HEALTH
          <MetricTooltip
            title="Ship Health"
            why="Indicates overall structural integrity of your fleet. Damaged ships are vulnerable to breaches, fires, and catastrophic failure."
            how={
              <>
                Average hull condition across all ships, calculated from <span className="highlight">element integrity</span>.
                <div className="formula">
                  Ship Health = Σ(intact elements) / Σ(total elements) × 100%
                </div>
                Elements include walls, floors, systems, and components.
              </>
            }
            what="Keep above 80% for optimal safety. Below 60% indicates critical damage—prioritize repairs immediately. Assign crew to repair damaged sections or risk hull breaches during combat."
          />
        </div>
        <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${metrics.shipHealth}%`,
              background: getHealthColor(metrics.shipHealth)
            }}
          ></div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">❤️</div>
        <div className="stat-value">{metrics.crewHealth}%</div>
        <div className="stat-label">
          CREW WELLNESS
          <MetricTooltip
            title="Crew Wellness"
            why="Healthy, happy crew work efficiently. Low wellness leads to slow work, injuries, mental breaks, and potential mutiny."
            how={
              <>
                Average of normalized vital stats: <span className="highlight">Health</span>, <span className="highlight">Food</span>, <span className="highlight">Mood</span>, and <span className="highlight">Fatigue</span>.
                <div className="formula">
                  Crew Wellness = Average of (Health/140, Food/100, Mood/100, Energy/100) × 100%
                </div>
                Each stat is normalized to its maximum value before averaging.
              </>
            }
            what="Maintain above 80% for peak performance. Below 60% is dangerous—check food supplies, rest schedules, oxygen levels, and temperature. Address morale issues with entertainment, social activities, and comfortable living conditions."
          />
        </div>
        <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${metrics.crewHealth}%`,
              background: getHealthColor(metrics.crewHealth)
            }}
          ></div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-value">{metrics.daysSurvived}</div>
        <div className="stat-label">
          DAYS SURVIVED
          <MetricTooltip
            title="Days Survived"
            why="Your journey's duration in the harsh void of space. A badge of honor showing how long you've kept your crew alive."
            how={
              <>
                Direct value from the save file's <code>daysSurvived</code> counter.
                <div className="formula">Days = daysSurvived attribute from save data</div>
              </>
            }
            what="Just keep surviving! Each day is a victory. Use this to track progress and compare runs. The longer you survive, the more challenges you've overcome."
          />
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">⭐</div>
        <div className="stat-value">{metrics.systemsExplored}</div>
        <div className="stat-label">
          SYSTEMS EXPLORED
          <MetricTooltip
            title="Systems Explored"
            why="Exploration is key to finding resources, survivors, and new opportunities. More systems mean more strategic options and knowledge of the galaxy."
            how={
              <>
                Count of <span className="highlight">star systems</span> you've visited and revealed on your starmap.
                <div className="formula">Systems = Count of revealed systems in starmap data</div>
              </>
            }
            what="Early game: Focus on exploring nearby systems for resources and survivors. Mid-game: Map trade routes and identify strategic locations. Late-game: Use exploration data to plan expansion and avoid hostile territories."
          />
        </div>
      </div>
    </div>
  )
}
