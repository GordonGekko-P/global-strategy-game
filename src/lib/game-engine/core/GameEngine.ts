import { IntelligenceSystem } from '../systems/intelligence';
import { PopulationSystem } from '../systems/population';
import { EnvironmentSystem } from '../systems/environment';
import { ResearchSystem } from '../systems/research';
import { DiplomacySystem } from '../systems/diplomacy';

export class GameEngine {
  private intelligence: IntelligenceSystem;
  private population: PopulationSystem;
  private environment: EnvironmentSystem;
  private research: ResearchSystem;
  private diplomacy: DiplomacySystem;
  private tickInterval: number;
  private isRunning: boolean;

  constructor() {
    this.intelligence = new IntelligenceSystem();
    this.population = new PopulationSystem();
    this.environment = new EnvironmentSystem();
    this.research = new ResearchSystem();
    this.diplomacy = new DiplomacySystem();
    this.tickInterval = 1000; // 1 second per tick
    this.isRunning = false;
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.gameLoop();
    }
  }

  public stop(): void {
    this.isRunning = false;
  }

  public setTickInterval(interval: number): void {
    this.tickInterval = Math.max(100, interval); // Minimum 100ms
  }

  private async gameLoop(): Promise<void> {
    while (this.isRunning) {
      const startTime = Date.now();

      // Update all systems
      await this.updateSystems();

      // Calculate time to wait for next tick
      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(0, this.tickInterval - elapsedTime);

      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  private async updateSystems(): Promise<void> {
    try {
      // Update research first as it might affect other systems
      this.research.updateResearch();

      // Update population and environment
      this.population.updatePopulationDynamics();
      this.environment.processEnvironmentalAction('update', 'climate_stability', 0);

      // Update diplomatic relations
      this.diplomacy.updateRelations();

      // Emit update event for UI
      this.emitUpdateEvent();
    } catch (error) {
      console.error('Error updating systems:', error);
      this.handleError(error);
    }
  }

  private emitUpdateEvent(): void {
    const event = new CustomEvent('gameUpdate', {
      detail: {
        timestamp: Date.now(),
        systems: {
          intelligence: this.getIntelligenceState(),
          population: this.getPopulationState(),
          environment: this.getEnvironmentState(),
          research: this.getResearchState(),
          diplomacy: this.getDiplomacyState()
        }
      }
    });

    window.dispatchEvent(event);
  }

  private handleError(error: unknown): void {
    const event = new CustomEvent('gameError', {
      detail: {
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    window.dispatchEvent(event);
  }

  // System state getters
  private getIntelligenceState() {
    return {
      activeOperations: this.intelligence.getActiveOperations()
    };
  }

  private getPopulationState() {
    return {
      movements: this.population.getAllMovements(),
      trends: this.population.getAllTrends()
    };
  }

  private getEnvironmentState() {
    return {
      globalMetrics: this.environment.getGlobalMetrics(),
      resourceMetrics: this.environment.getResourceMetrics(),
      activeEvents: this.environment.getActiveEvents()
    };
  }

  private getResearchState() {
    return {
      activeProjects: this.research.getActiveProjects(),
      facilities: this.research.getFacilities()
    };
  }

  private getDiplomacyState() {
    return {
      pendingActions: this.diplomacy.getPendingActions('player')
    };
  }

  // Public system accessors
  public getIntelligenceSystem(): IntelligenceSystem {
    return this.intelligence;
  }

  public getPopulationSystem(): PopulationSystem {
    return this.population;
  }

  public getEnvironmentSystem(): EnvironmentSystem {
    return this.environment;
  }

  public getResearchSystem(): ResearchSystem {
    return this.research;
  }

  public getDiplomacySystem(): DiplomacySystem {
    return this.diplomacy;
  }
}