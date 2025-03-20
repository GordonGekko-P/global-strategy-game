import { ResourceType } from '@/types/game';

interface DiplomaticRelation {
  id: string;
  nationA: string;
  nationB: string;
  status: 'friendly' | 'neutral' | 'hostile';
  trust: number;
  tradeAgreements: TradeAgreement[];
  treaties: Treaty[];
  lastInteraction: number;
}

interface TradeAgreement {
  id: string;
  type: 'import' | 'export';
  resource: ResourceType;
  amount: number;
  price: number;
  duration: number;
  startTime: number;
}

interface Treaty {
  id: string;
  type: 'alliance' | 'peace' | 'trade' | 'research';
  terms: string[];
  benefits: Record<string, number>;
  obligations: Record<string, number>;
  startTime: number;
  duration: number;
}

interface DiplomaticAction {
  type: 'negotiate' | 'propose' | 'demand' | 'threaten';
  initiator: string;
  target: string;
  content: Record<string, unknown>;
  timestamp: number;
}

export class DiplomacySystem {
  private relations: Map<string, DiplomaticRelation>;
  private pendingActions: Map<string, DiplomaticAction>;
  private actionHistory: DiplomaticAction[];
  private maxHistoryLength: number;

  constructor() {
    this.relations = new Map();
    this.pendingActions = new Map();
    this.actionHistory = [];
    this.maxHistoryLength = 1000;
  }

  public initiateDiplomaticAction(action: DiplomaticAction): boolean {
    const relationKey = this.getRelationKey(action.initiator, action.target);
    const relation = this.relations.get(relationKey);

    if (!relation) return false;

    const success = this.validateAndProcessAction(action, relation);
    if (success) {
      this.pendingActions.set(action.initiator + action.timestamp, action);
      this.addToHistory(action);
    }

    return success;
  }

  public proposeTreaty(
    initiator: string,
    target: string,
    treaty: Treaty
  ): boolean {
    const relationKey = this.getRelationKey(initiator, target);
    const relation = this.relations.get(relationKey);

    if (!relation || !this.validateTreaty(treaty)) return false;

    const action: DiplomaticAction = {
      type: 'propose',
      initiator,
      target,
      content: { treaty },
      timestamp: Date.now()
    };

    return this.initiateDiplomaticAction(action);
  }

  public negotiateTradeAgreement(
    initiator: string,
    target: string,
    agreement: TradeAgreement
  ): boolean {
    const relationKey = this.getRelationKey(initiator, target);
    const relation = this.relations.get(relationKey);

    if (!relation || !this.validateTradeAgreement(agreement)) return false;

    const action: DiplomaticAction = {
      type: 'negotiate',
      initiator,
      target,
      content: { agreement },
      timestamp: Date.now()
    };

    return this.initiateDiplomaticAction(action);
  }

  public updateRelations(): void {
    this.relations.forEach((relation, key) => {
      // Decay trust over time
      const timeSinceLastInteraction = Date.now() - relation.lastInteraction;
      const trustDecay = Math.floor(timeSinceLastInteraction / (24 * 60 * 60 * 1000)) * 0.1;
      relation.trust = Math.max(0, Math.min(100, relation.trust - trustDecay));

      // Update status based on trust
      relation.status = this.calculateStatus(relation.trust);

      // Remove expired agreements and treaties
      relation.tradeAgreements = relation.tradeAgreements.filter(
        agreement => !this.isExpired(agreement.startTime, agreement.duration)
      );

      relation.treaties = relation.treaties.filter(
        treaty => !this.isExpired(treaty.startTime, treaty.duration)
      );

      this.relations.set(key, relation);
    });
  }

  public respondToDiplomaticAction(
    actionId: string,
    response: 'accept' | 'reject' | 'counter',
    counterProposal?: Record<string, unknown>
  ): boolean {
    const action = this.pendingActions.get(actionId);
    if (!action) return false;

    const relationKey = this.getRelationKey(action.initiator, action.target);
    const relation = this.relations.get(relationKey);
    if (!relation) return false;

    switch (response) {
      case 'accept':
        this.executeAction(action, relation);
        break;
      case 'reject':
        this.handleRejection(action, relation);
        break;
      case 'counter':
        if (counterProposal) {
          return this.handleCounterProposal(action, counterProposal);
        }
        return false;
    }

    this.pendingActions.delete(actionId);
    return true;
  }

  private validateAndProcessAction(
    action: DiplomaticAction,
    relation: DiplomaticRelation
  ): boolean {
    switch (action.type) {
      case 'negotiate':
        return relation.status !== 'hostile';
      case 'propose':
        return true;
      case 'demand':
        return relation.trust >= 30;
      case 'threaten':
        return relation.status === 'hostile' || relation.trust < 30;
      default:
        return false;
    }
  }

  private validateTreaty(treaty: Treaty): boolean {
    return (
      treaty.id &&
      treaty.type &&
      Array.isArray(treaty.terms) &&
      treaty.terms.length > 0 &&
      treaty.duration > 0 &&
      Object.values(treaty.benefits).every(value => !isNaN(value)) &&
      Object.values(treaty.obligations).every(value => !isNaN(value))
    );
  }

  private validateTradeAgreement(agreement: TradeAgreement): boolean {
    return (
      agreement.id &&
      agreement.type &&
      agreement.amount > 0 &&
      agreement.price >= 0 &&
      agreement.duration > 0
    );
  }

  private executeAction(action: DiplomaticAction, relation: DiplomaticRelation): void {
    switch (action.type) {
      case 'negotiate':
        if ('agreement' in action.content) {
          relation.tradeAgreements.push(action.content.agreement as TradeAgreement);
          relation.trust += 5;
        }
        break;
      case 'propose':
        if ('treaty' in action.content) {
          relation.treaties.push(action.content.treaty as Treaty);
          relation.trust += 10;
        }
        break;
      // Handle other action types
    }

    relation.lastInteraction = Date.now();
    this.relations.set(this.getRelationKey(action.initiator, action.target), relation);
  }

  private handleRejection(action: DiplomaticAction, relation: DiplomaticRelation): void {
    relation.trust -= 5;
    relation.lastInteraction = Date.now();
    this.relations.set(this.getRelationKey(action.initiator, action.target), relation);
  }

  private handleCounterProposal(
    originalAction: DiplomaticAction,
    counterProposal: Record<string, unknown>
  ): boolean {
    const newAction: DiplomaticAction = {
      type: originalAction.type,
      initiator: originalAction.target,
      target: originalAction.initiator,
      content: counterProposal,
      timestamp: Date.now()
    };

    return this.initiateDiplomaticAction(newAction);
  }

  private getRelationKey(nationA: string, nationB: string): string {
    return [nationA, nationB].sort().join(':');
  }

  private calculateStatus(trust: number): 'friendly' | 'neutral' | 'hostile' {
    if (trust >= 70) return 'friendly';
    if (trust >= 30) return 'neutral';
    return 'hostile';
  }

  private isExpired(startTime: number, duration: number): boolean {
    return Date.now() >= startTime + duration;
  }

  private addToHistory(action: DiplomaticAction): void {
    this.actionHistory.push(action);
    if (this.actionHistory.length > this.maxHistoryLength) {
      this.actionHistory.shift();
    }
  }

  public getRelation(nationA: string, nationB: string): DiplomaticRelation | undefined {
    return this.relations.get(this.getRelationKey(nationA, nationB));
  }

  public getPendingActions(nation: string): DiplomaticAction[] {
    return Array.from(this.pendingActions.values()).filter(
      action => action.initiator === nation || action.target === nation
    );
  }

  public getActionHistory(
    nation: string,
    limit: number = 10
  ): DiplomaticAction[] {
    return this.actionHistory
      .filter(action => action.initiator === nation || action.target === nation)
      .slice(-limit);
  }
}