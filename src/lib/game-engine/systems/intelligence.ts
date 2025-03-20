import { Intelligence, IntelligenceOperation } from '@/types/game';

export class IntelligenceSystem {
  private operations: Map<string, IntelligenceOperation>;
  private intelligence: Map<string, Intelligence>;
  private activeOperations: Set<string>;

  constructor() {
    this.operations = new Map();
    this.intelligence = new Map();
    this.activeOperations = new Set();
  }

  public launchOperation(operation: IntelligenceOperation): boolean {
    if (this.validateOperation(operation)) {
      this.operations.set(operation.id, operation);
      this.activeOperations.add(operation.id);
      return true;
    }
    return false;
  }

  public deployAsset(operationId: string, assetType: string): boolean {
    const operation = this.operations.get(operationId);
    if (operation && this.activeOperations.has(operationId)) {
      // Asset deployment logic
      return true;
    }
    return false;
  }

  public analyzeIntelligence(intel: Intelligence): Record<string, number> {
    if (this.validateIntelligence(intel)) {
      this.intelligence.set(intel.id, intel);
      return this.calculateInsights(intel);
    }
    return {};
  }

  public initiateCounterMeasures(targetId: string): boolean {
    const intel = this.intelligence.get(targetId);
    if (intel) {
      // Counter-measures implementation
      return true;
    }
    return false;
  }

  private validateOperation(operation: IntelligenceOperation): boolean {
    return (
      operation.id &&
      operation.type &&
      operation.cost &&
      operation.duration > 0 &&
      operation.success_rate >= 0 &&
      operation.success_rate <= 1
    );
  }

  private validateIntelligence(intel: Intelligence): boolean {
    return (
      intel.id &&
      intel.type &&
      intel.source &&
      intel.target &&
      intel.reliability >= 0 &&
      intel.reliability <= 1
    );
  }

  private calculateInsights(intel: Intelligence): Record<string, number> {
    const insights: Record<string, number> = {};
    
    // Process intelligence data and calculate insights
    if (typeof intel.data === 'object' && intel.data !== null) {
      Object.entries(intel.data).forEach(([key, value]) => {
        if (typeof value === 'number') {
          insights[key] = value * intel.reliability;
        }
      });
    }
    
    return insights;
  }

  public getActiveOperations(): IntelligenceOperation[] {
    return Array.from(this.activeOperations)
      .map(id => this.operations.get(id))
      .filter((op): op is IntelligenceOperation => op !== undefined);
  }

  public getIntelligenceByTarget(target: string): Intelligence[] {
    return Array.from(this.intelligence.values())
      .filter(intel => intel.target === target);
  }
}