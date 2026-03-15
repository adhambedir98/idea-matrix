import { Idea, Weights, DEFAULT_WEIGHTS, TIER_COLORS, Tier } from './types';

export function calculateComposite(idea: Idea, weights: Weights = DEFAULT_WEIGHTS): number {
  const score =
    idea.speedToDemo * weights.speedToDemo +
    idea.sizeOfPrize * weights.sizeOfPrize +
    idea.passion * weights.passion +
    idea.teamFit * weights.teamFit +
    idea.moat * weights.moat +
    idea.ycAlignment * weights.ycAlignment;
  return Math.round(score * 10) / 10;
}

export function getTierColor(tier: Tier): string {
  return TIER_COLORS[tier];
}

export function getBubbleRadius(compositeScore: number): number {
  // composite score 1-10 -> radius 14-44
  return 14 + (Math.max(1, Math.min(10, compositeScore)) - 1) * (30 / 9);
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

export function createNewIdea(): Idea {
  return {
    id: generateId(),
    name: '',
    oneLiner: '',
    tier: 'tier2',
    category: 'Other',
    speedToDemo: 5,
    sizeOfPrize: 5,
    passion: 5,
    teamFit: 5,
    moat: 5,
    ycAlignment: 5,
    conviction: 5,
    sources: '',
    notes: '',
    status: 'brainstorm',
  };
}

export function exportAsCSV(ideas: Idea[]): string {
  const headers = [
    'Name', 'One-Liner', 'Tier', 'Category', 'Status',
    'Speed to Demo', 'Size of Prize', 'Passion', 'Team Fit', 'Moat',
    'YC Alignment', 'Conviction', 'Composite Score', 'Sources', 'Notes'
  ];

  const rows = ideas.map(idea => [
    `"${idea.name.replace(/"/g, '""')}"`,
    `"${idea.oneLiner.replace(/"/g, '""')}"`,
    idea.tier,
    idea.category,
    idea.status,
    idea.speedToDemo,
    idea.sizeOfPrize,
    idea.passion,
    idea.teamFit,
    idea.moat,
    idea.ycAlignment,
    idea.conviction,
    idea.compositeScore ?? '',
    `"${idea.sources.replace(/"/g, '""')}"`,
    `"${idea.notes.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
