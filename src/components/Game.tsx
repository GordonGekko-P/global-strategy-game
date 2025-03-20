import { useEffect, useState, useCallback } from 'react';
import { GameEngine } from '@/lib/game-engine/core/GameEngine';

interface GameState {
  intelligence: {
    activeOperations: any[];
  };
  population: {
    movements: any[];
    trends: any[];
  };
  environment: {
    globalMetrics: any;
    resourceMetrics: any;
    activeEvents: any[];
  };
  research: {
    activeProjects: any[];
    facilities: any[];
  };
  diplomacy: {
    pendingActions: any[];
  };
}

export default function Game() {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>({
    intelligence: { activeOperations: [] },
    population: { movements: [], trends: [] },
    environment: { globalMetrics: {}, resourceMetrics: {}, activeEvents: [] },
    research: { activeProjects: [], facilities: [] },
    diplomacy: { pendingActions: [] }
  });

  const handleGameUpdate = useCallback((event: CustomEvent) => {
    setGameState(event.detail.systems);
  }, []);

  const handleGameError = useCallback((event: CustomEvent) => {
    console.error('Game error:', event.detail.error);
    // Implement error handling UI
  }, []);

  useEffect(() => {
    window.addEventListener('gameUpdate', handleGameUpdate as EventListener);
    window.addEventListener('gameError', handleGameError as EventListener);

    gameEngine.start();

    return () => {
      window.removeEventListener('gameUpdate', handleGameUpdate as EventListener);
      window.removeEventListener('gameError', handleGameError as EventListener);
      gameEngine.stop();
    };
  }, [gameEngine, handleGameUpdate, handleGameError]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center">Global Strategy Game</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Intelligence Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Intelligence</h2>
            <div className="space-y-2">
              <p>Active Operations: {gameState.intelligence.activeOperations.length}</p>
              {gameState.intelligence.activeOperations.map((op: any) => (
                <div key={op.id} className="bg-gray-700 p-2 rounded">
                  {op.type} - Target: {op.target}
                </div>
              ))}
            </div>
          </div>

          {/* Population Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Population</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl mb-2">Social Movements</h3>
                {gameState.population.movements.map((movement: any) => (
                  <div key={movement.id} className="bg-gray-700 p-2 rounded mb-2">
                    {movement.name} - Support: {movement.support}%
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xl mb-2">Cultural Trends</h3>
                {gameState.population.trends.map((trend: any) => (
                  <div key={trend.id} className="bg-gray-700 p-2 rounded mb-2">
                    {trend.name} - Strength: {trend.strength}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Environment Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Environment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl mb-2">Global Metrics</h3>
                {Object.entries(gameState.environment.globalMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between mb-2">
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xl mb-2">Resource Metrics</h3>
                {Object.entries(gameState.environment.resourceMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between mb-2">
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Research Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Research</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl mb-2">Active Projects</h3>
                {gameState.research.activeProjects.map((project: any) => (
                  <div key={project.id} className="bg-gray-700 p-2 rounded mb-2">
                    <div>{project.name}</div>
                    <div className="text-sm">Progress: {project.progress}%</div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xl mb-2">Facilities</h3>
                {gameState.research.facilities.map((facility: any) => (
                  <div key={facility.id} className="bg-gray-700 p-2 rounded mb-2">
                    <div>{facility.name}</div>
                    <div className="text-sm">Level: {facility.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diplomacy Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Diplomacy</h2>
            <div className="space-y-2">
              <h3 className="text-xl mb-2">Pending Actions</h3>
              {gameState.diplomacy.pendingActions.map((action: any) => (
                <div key={action.timestamp} className="bg-gray-700 p-2 rounded mb-2">
                  <div>Type: {action.type}</div>
                  <div className="text-sm">From: {action.initiator}</div>
                  <div className="text-sm">To: {action.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}