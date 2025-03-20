import {
  EnvironmentalMetrics,
  ResourceMetrics,
  ClimateEvent,
  EnvironmentalPolicy,
  ResourceType
} from '@/types/game';

export class EnvironmentSystem {
  private globalMetrics: EnvironmentalMetrics;
  private resourceMetrics: ResourceMetrics;
  private activeEvents: Map<string, ClimateEvent>;
  private activePolicies: Map<string, EnvironmentalPolicy>;
  private eventQueue: ClimateEvent[];

  constructor() {
    this.globalMetrics = {
      pollution: 50,
      sustainability: 50,
      biodiversity: 50,
      climate_stability: 50
    };

    this.resourceMetrics = {
      renewable_energy: 20,
      raw_materials: 100,
      water_quality: 80,
      air_quality: 70
    };

    this.activeEvents = new Map();
    this.activePolicies = new Map();
    this.eventQueue = [];
  }

  public processEnvironmentalAction(
    action: string,
    target: keyof EnvironmentalMetrics | keyof ResourceMetrics,
    value: number
  ): boolean {
    if (target in this.globalMetrics) {
      this.globalMetrics[target as keyof EnvironmentalMetrics] = Math.max(
        0,
        Math.min(100, this.globalMetrics[target as keyof EnvironmentalMetrics] + value)
      );
      return true;
    }

    if (target in this.resourceMetrics) {
      this.resourceMetrics[target as keyof ResourceMetrics] = Math.max(
        0,
        Math.min(100, this.resourceMetrics[target as keyof ResourceMetrics] + value)
      );
      return true;
    }

    return false;
  }

  public implementEnvironmentalPolicy(policy: EnvironmentalPolicy): boolean {
    if (this.validatePolicy(policy)) {
      this.activePolicies.set(policy.id, policy);
      this.applyPolicyEffects(policy);
      return true;
    }
    return false;
  }

  public manageResources(
    action: 'extract' | 'conserve' | 'restore',
    resource: keyof ResourceMetrics,
    amount: number
  ): boolean {
    if (!(resource in this.resourceMetrics)) return false;

    switch (action) {
      case 'extract':
        if (this.resourceMetrics[resource] < amount) return false;
        this.resourceMetrics[resource] -= amount;
        this.globalMetrics.sustainability -= amount * 0.1;
        break;

      case 'conserve':
        this.resourceMetrics[resource] = Math.min(100, this.resourceMetrics[resource] + amount * 0.5);
        this.globalMetrics.sustainability += amount * 0.05;
        break;

      case 'restore':
        this.resourceMetrics[resource] = Math.min(100, this.resourceMetrics[resource] + amount);
        this.globalMetrics.sustainability += amount * 0.1;
        this.globalMetrics.biodiversity += amount * 0.05;
        break;

      default:
        return false;
    }

    this.normalizeMetrics();
    return true;
  }

  public respondToClimateEvent(event: ClimateEvent): boolean {
    if (this.validateClimateEvent(event)) {
      this.activeEvents.set(event.id, event);
      this.applyEventEffects(event);
      return true;
    }
    return false;
  }

  public investInGreenTechnology(
    technology: string,
    investment: number,
    targetMetric: keyof EnvironmentalMetrics
  ): boolean {
    if (investment <= 0 || !(targetMetric in this.globalMetrics)) return false;

    const efficiency = this.calculateInvestmentEfficiency(technology, investment);
    this.globalMetrics[targetMetric] += efficiency;
    this.resourceMetrics.renewable_energy += efficiency * 0.5;

    this.normalizeMetrics();
    return true;
  }

  private validatePolicy(policy: EnvironmentalPolicy): boolean {
    return (
      policy.id &&
      policy.name &&
      policy.cost &&
      Object.values(policy.cost).every(cost => cost >= 0) &&
      policy.effects &&
      Object.values(policy.effects).every(effect => !isNaN(effect))
    );
  }

  private validateClimateEvent(event: ClimateEvent): boolean {
    return (
      event.id &&
      event.type &&
      event.severity >= 0 &&
      event.severity <= 100 &&
      event.duration > 0 &&
      event.effects &&
      Object.values(event.effects).every(effect => !isNaN(effect))
    );
  }

  private applyPolicyEffects(policy: EnvironmentalPolicy): void {
    Object.entries(policy.effects).forEach(([metric, effect]) => {
      if (metric in this.globalMetrics) {
        this.globalMetrics[metric as keyof EnvironmentalMetrics] += effect;
      }
    });
    this.normalizeMetrics();
  }

  private applyEventEffects(event: ClimateEvent): void {
    Object.entries(event.effects).forEach(([metric, effect]) => {
      if (metric in this.globalMetrics) {
        this.globalMetrics[metric as keyof EnvironmentalMetrics] -= effect * (event.severity / 100);
      }
      if (metric in this.resourceMetrics) {
        this.resourceMetrics[metric as keyof ResourceMetrics] -= effect * (event.severity / 100);
      }
    });
    this.normalizeMetrics();
  }

  private calculateInvestmentEfficiency(technology: string, investment: number): number {
    const baseEfficiency = 0.1;
    const diminishingReturns = Math.log10(investment) / 10;
    const technologyBonus = this.getTechnologyBonus(technology);
    return baseEfficiency * diminishingReturns * technologyBonus;
  }

  private getTechnologyBonus(technology: string): number {
    // Technology-specific bonuses could be implemented here
    return 1.0;
  }

  private normalizeMetrics(): void {
    Object.keys(this.globalMetrics).forEach(key => {
      this.globalMetrics[key as keyof EnvironmentalMetrics] = Math.max(
        0,
        Math.min(100, this.globalMetrics[key as keyof EnvironmentalMetrics])
      );
    });

    Object.keys(this.resourceMetrics).forEach(key => {
      this.resourceMetrics[key as keyof ResourceMetrics] = Math.max(
        0,
        Math.min(100, this.resourceMetrics[key as keyof ResourceMetrics])
      );
    });
  }

  public getGlobalMetrics(): EnvironmentalMetrics {
    return { ...this.globalMetrics };
  }

  public getResourceMetrics(): ResourceMetrics {
    return { ...this.resourceMetrics };
  }

  public getActiveEvents(): ClimateEvent[] {
    return Array.from(this.activeEvents.values());
  }

  public getActivePolicies(): EnvironmentalPolicy[] {
    return Array.from(this.activePolicies.values());
  }
}