import {
  ResearchField,
  ResearchProject,
  TechnologyTree,
  ResearchFacility,
  ResourceType
} from '@/types/game';

export class ResearchSystem {
  private fields: Map<string, ResearchField>;
  private projects: Map<string, ResearchProject>;
  private facilities: Map<string, ResearchFacility>;
  private techTrees: Map<string, TechnologyTree>;

  constructor() {
    this.fields = new Map();
    this.projects = new Map();
    this.facilities = new Map();
    this.techTrees = new Map();
  }

  public processResearchAction(
    action: string,
    targetId: string,
    value: number
  ): boolean {
    const project = this.projects.get(targetId);
    if (!project) return false;

    switch (action) {
      case 'allocate_resources':
        project.progress = Math.min(100, project.progress + value);
        break;
      case 'adjust_researchers':
        project.researchers = Math.max(0, project.researchers + value);
        break;
      default:
        return false;
    }

    this.projects.set(targetId, project);
    return true;
  }

  public updateResearch(): void {
    this.projects.forEach((project, id) => {
      const facility = this.getFacilityForProject(project);
      if (facility) {
        const progressRate = this.calculateProgressRate(project, facility);
        project.progress = Math.min(100, project.progress + progressRate);
        this.projects.set(id, project);

        if (project.progress >= 100) {
          this.handleBreakthrough(project);
        }
      }
    });
  }

  public startResearchProject(project: ResearchProject): boolean {
    if (this.validateProject(project) && this.checkRequirements(project)) {
      this.projects.set(project.id, project);
      return true;
    }
    return false;
  }

  public upgradeFacility(
    facilityId: string,
    upgrades: { level?: number; capacity?: number; efficiency?: number }
  ): boolean {
    const facility = this.facilities.get(facilityId);
    if (!facility) return false;

    if (upgrades.level) facility.level = Math.min(10, facility.level + upgrades.level);
    if (upgrades.capacity) facility.capacity = Math.min(100, facility.capacity + upgrades.capacity);
    if (upgrades.efficiency) facility.efficiency = Math.min(2, facility.efficiency + upgrades.efficiency);

    this.facilities.set(facilityId, facility);
    return true;
  }

  public allocateResearchers(projectId: string, count: number): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const facility = this.getFacilityForProject(project);
    if (!facility || facility.capacity < count) return false;

    project.researchers = count;
    this.projects.set(projectId, project);
    return true;
  }

  public initiateCollaboration(
    projectId: string,
    partnerIds: string[]
  ): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const collaborationBonus = this.calculateCollaborationBonus(partnerIds);
    project.progress = Math.min(100, project.progress + collaborationBonus);
    this.projects.set(projectId, project);

    return true;
  }

  private validateProject(project: ResearchProject): boolean {
    return (
      project.id &&
      project.name &&
      project.field &&
      project.progress >= 0 &&
      project.progress <= 100 &&
      project.researchers >= 0 &&
      project.cost &&
      Object.values(project.cost).every(cost => cost >= 0)
    );
  }

  private checkRequirements(project: ResearchProject): boolean {
    const field = this.fields.get(project.field);
    if (!field) return false;

    return field.requirements.every(req => {
      const requiredField = this.fields.get(req);
      return requiredField && requiredField.progress >= 100;
    });
  }

  private calculateProgressRate(
    project: ResearchProject,
    facility: ResearchFacility
  ): number {
    const baseRate = 0.1;
    const researcherContribution = project.researchers * 0.05;
    const facilityBonus = facility.efficiency * (facility.level / 10);
    
    return baseRate + researcherContribution * facilityBonus;
  }

  private getFacilityForProject(project: ResearchProject): ResearchFacility | undefined {
    return Array.from(this.facilities.values()).find(
      facility => facility.specialization === this.fields.get(project.field)?.name
    );
  }

  private calculateCollaborationBonus(partnerIds: string[]): number {
    const baseBonus = 5;
    const partnerCount = partnerIds.length;
    const diminishingReturns = Math.log10(partnerCount + 1);
    return baseBonus * diminishingReturns;
  }

  private handleBreakthrough(project: ResearchProject): void {
    const field = this.fields.get(project.field);
    if (field) {
      field.progress = 100;
      this.fields.set(project.field, field);

      // Update technology trees
      this.techTrees.forEach(tree => {
        if (tree.nodes.some(node => node.id === field.id)) {
          this.updateTechTree(tree, field);
        }
      });
    }
  }

  private updateTechTree(tree: TechnologyTree, completedField: ResearchField): void {
    tree.nodes = tree.nodes.map(node =>
      node.id === completedField.id ? completedField : node
    );
    this.techTrees.set(tree.id, tree);
  }

  public getResearchField(id: string): ResearchField | undefined {
    return this.fields.get(id);
  }

  public getActiveProjects(): ResearchProject[] {
    return Array.from(this.projects.values());
  }

  public getFacilities(): ResearchFacility[] {
    return Array.from(this.facilities.values());
  }

  public getTechnologyTree(id: string): TechnologyTree | undefined {
    return this.techTrees.get(id);
  }
}