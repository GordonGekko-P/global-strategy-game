import { PopulationSegment, SocialMovement, CulturalTrend } from '@/types/game';

export class PopulationSystem {
  private populations: Map<string, PopulationSegment>;
  private movements: Map<string, SocialMovement>;
  private trends: Map<string, CulturalTrend>;

  constructor() {
    this.populations = new Map();
    this.movements = new Map();
    this.trends = new Map();
  }

  public processPopulationAction(action: string, segmentId: string, value: number): boolean {
    const segment = this.populations.get(segmentId);
    if (!segment) return false;

    switch (action) {
      case 'educate':
        segment.education = Math.min(100, segment.education + value);
        break;
      case 'improve_happiness':
        segment.happiness = Math.min(100, segment.happiness + value);
        break;
      case 'boost_productivity':
        segment.productivity = Math.min(100, segment.productivity + value);
        break;
      default:
        return false;
    }

    this.populations.set(segmentId, segment);
    return true;
  }

  public updatePopulationDynamics(): void {
    this.populations.forEach((segment, id) => {
      // Update population size based on happiness and other factors
      const growthRate = this.calculateGrowthRate(segment);
      segment.size *= (1 + growthRate);

      // Update other metrics
      segment.productivity *= (1 + segment.education * 0.001);
      
      this.populations.set(id, segment);
    });
  }

  public implementSocialPolicy(policy: string, targetSegments: string[]): boolean {
    const affectedSegments = targetSegments.filter(id => this.populations.has(id));
    if (affectedSegments.length === 0) return false;

    affectedSegments.forEach(id => {
      const segment = this.populations.get(id)!;
      switch (policy) {
        case 'welfare':
          segment.happiness += 5;
          break;
        case 'education_reform':
          segment.education += 3;
          break;
        case 'labor_policy':
          segment.productivity += 4;
          break;
      }
      this.populations.set(id, segment);
    });

    return true;
  }

  public launchCulturalInitiative(trend: CulturalTrend): boolean {
    if (this.validateCulturalTrend(trend)) {
      this.trends.set(trend.id, trend);
      return true;
    }
    return false;
  }

  public implementDemographicProgram(
    segmentId: string,
    program: { education?: number; happiness?: number; productivity?: number }
  ): boolean {
    const segment = this.populations.get(segmentId);
    if (!segment) return false;

    if (program.education) segment.education = Math.min(100, segment.education + program.education);
    if (program.happiness) segment.happiness = Math.min(100, segment.happiness + program.happiness);
    if (program.productivity) segment.productivity = Math.min(100, segment.productivity + program.productivity);

    this.populations.set(segmentId, segment);
    return true;
  }

  public handleSocialMovement(movement: SocialMovement): boolean {
    if (this.validateSocialMovement(movement)) {
      this.movements.set(movement.id, movement);
      this.applyMovementEffects(movement);
      return true;
    }
    return false;
  }

  private calculateGrowthRate(segment: PopulationSegment): number {
    const baseRate = 0.001; // 0.1% base growth rate
    const happinessModifier = (segment.happiness - 50) * 0.0001;
    const educationModifier = segment.education * 0.0001;
    return baseRate + happinessModifier + educationModifier;
  }

  private validateCulturalTrend(trend: CulturalTrend): boolean {
    return (
      trend.id &&
      trend.name &&
      trend.strength >= 0 &&
      trend.strength <= 100 &&
      Object.values(trend.effects).every(effect => !isNaN(effect))
    );
  }

  private validateSocialMovement(movement: SocialMovement): boolean {
    return (
      movement.id &&
      movement.name &&
      movement.support >= 0 &&
      movement.support <= 100 &&
      movement.influence >= 0 &&
      movement.influence <= 100 &&
      Array.isArray(movement.demands)
    );
  }

  private applyMovementEffects(movement: SocialMovement): void {
    this.populations.forEach(segment => {
      const supportImpact = movement.support * movement.influence * 0.0001;
      segment.happiness += supportImpact;
      segment.productivity += supportImpact * (segment.education / 100);
    });
  }

  public getPopulationSegment(id: string): PopulationSegment | undefined {
    return this.populations.get(id);
  }

  public getAllMovements(): SocialMovement[] {
    return Array.from(this.movements.values());
  }

  public getAllTrends(): CulturalTrend[] {
    return Array.from(this.trends.values());
  }
}