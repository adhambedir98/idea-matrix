export type Tier = 'tier1' | 'tier2' | 'tier3' | 'tier4';
export type Status = 'brainstorm' | 'exploring' | 'building' | 'killed';
export type Category =
  | 'Consumer AI'
  | 'Creative AI'
  | 'Vertical SaaS'
  | 'Robotics'
  | 'Audio/Sound'
  | 'Film/Video'
  | 'Fintech'
  | 'Healthcare'
  | 'Other';

export interface Idea {
  id: string;
  name: string;
  oneLiner: string;
  tier: Tier;
  category: Category | string;

  // Scores (all 1-10)
  speedToDemo: number;
  sizeOfPrize: number;
  passion: number;
  teamFit: number;
  moat: number;
  ycAlignment: number;
  conviction: number;

  // Metadata
  sources: string;
  notes: string;
  status: Status;

  // Computed
  compositeScore?: number;
}

export interface Weights {
  speedToDemo: number;
  sizeOfPrize: number;
  passion: number;
  teamFit: number;
  moat: number;
  ycAlignment: number;
}

export const DEFAULT_WEIGHTS: Weights = {
  speedToDemo: 0.2,
  sizeOfPrize: 0.2,
  passion: 0.2,
  teamFit: 0.15,
  moat: 0.15,
  ycAlignment: 0.1,
};

export const TIER_COLORS: Record<Tier, string> = {
  tier1: '#F59E0B',
  tier2: '#3B82F6',
  tier3: '#6B7280',
  tier4: '#374151',
};

export const TIER_LABELS: Record<Tier, string> = {
  tier1: 'Tier 1 — Bring to Whiteboard',
  tier2: 'Tier 2 — Worth 10 Minutes',
  tier3: 'Tier 3 — Strong Signal, Wrong Founders',
  tier4: 'Tier 4 — Archived',
};

export const STATUS_COLORS: Record<Status, string> = {
  brainstorm: '#8B5CF6',
  exploring: '#3B82F6',
  building: '#10B981',
  killed: '#EF4444',
};

export const STATUS_LABELS: Record<Status, string> = {
  brainstorm: 'Brainstorm',
  exploring: 'Exploring',
  building: 'Building',
  killed: 'Killed',
};

export const CATEGORIES: Category[] = [
  'Consumer AI',
  'Creative AI',
  'Vertical SaaS',
  'Robotics',
  'Audio/Sound',
  'Film/Video',
  'Fintech',
  'Healthcare',
  'Other',
];

export type ViewMode = 'matrix' | 'table';
