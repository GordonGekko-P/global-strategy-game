// Base types
export type ResourceType = 'money' | 'influence' | 'technology' | 'military';
export type ActionType = 'diplomatic' | 'economic' | 'military' | 'research';

// Intelligence System Types
export interface Intelligence {
  id: string;
  type: string;
  source: string;
  target: string;
  reliability: number;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface IntelligenceOperation {
  id: string;
  type: string;
  cost: Record<ResourceType, number>;
  duration: number;
  success_rate: number;
  target: string;
}

// Population System Types
export interface PopulationSegment {
  id: string;
  name: string;
  size: number;
  happiness: number;
  productivity: number;
  education: number;
}

export interface SocialMovement {
  id: string;
  name: string;
  support: number;
  influence: number;
  demands: string[];
}

export interface CulturalTrend {
  id: string;
  name: string;
  strength: number;
  effects: Record<string, number>;
}

// Environmental System Types
export interface EnvironmentalMetrics {
  pollution: number;
  sustainability: number;
  biodiversity: number;
  climate_stability: number;
}

export interface ResourceMetrics {
  renewable_energy: number;
  raw_materials: number;
  water_quality: number;
  air_quality: number;
}

export interface ClimateEvent {
  id: string;
  type: string;
  severity: number;
  duration: number;
  effects: Record<string, number>;
}

export interface EnvironmentalPolicy {
  id: string;
  name: string;
  cost: Record<ResourceType, number>;
  effects: Partial<EnvironmentalMetrics>;
}

// Research System Types
export interface ResearchField {
  id: string;
  name: string;
  progress: number;
  cost: Record<ResourceType, number>;
  requirements: string[];
}

export interface ResearchProject {
  id: string;
  name: string;
  field: string;
  progress: number;
  researchers: number;
  cost: Record<ResourceType, number>;
}

export interface TechnologyTree {
  id: string;
  name: string;
  nodes: ResearchField[];
  edges: [string, string][];
}

export interface ResearchFacility {
  id: string;
  name: string;
  level: number;
  capacity: number;
  efficiency: number;
  specialization: string;
}