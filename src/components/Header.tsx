'use client';

import React from 'react';
import { Tier, Status, ViewMode, TIER_COLORS, STATUS_LABELS } from '@/lib/types';

interface HeaderProps {
  viewMode: ViewMode;
  showLabels: boolean;
  visibleTiers: Set<Tier>;
  statusFilter: Status | 'all';
  onViewModeChange: (mode: ViewMode) => void;
  onShowLabelsChange: (show: boolean) => void;
  onToggleTier: (tier: Tier) => void;
  onStatusFilterChange: (status: Status | 'all') => void;
  onAddIdea: () => void;
  onToggleSettings: () => void;
}

export default function Header({
  viewMode,
  showLabels,
  visibleTiers,
  statusFilter,
  onViewModeChange,
  onShowLabelsChange,
  onToggleTier,
  onStatusFilterChange,
  onAddIdea,
  onToggleSettings,
}: HeaderProps) {
  const tiers: { key: Tier; label: string }[] = [
    { key: 'tier1', label: 'T1' },
    { key: 'tier2', label: 'T2' },
    { key: 'tier3', label: 'T3' },
    { key: 'tier4', label: 'T4' },
  ];

  const statuses: { key: Status | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'exploring', label: 'Exploring' },
    { key: 'building', label: 'Building' },
    { key: 'brainstorm', label: 'Brainstorm' },
    { key: 'killed', label: 'Killed' },
  ];

  return (
    <header className="bg-[#1E293B]/80 backdrop-blur-md border-b border-[#334155] px-4 py-3 flex items-center gap-4 flex-wrap">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#10B981] rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="5" cy="5" r="2.5" fill="white" opacity="0.9" />
            <circle cx="13" cy="5" r="1.5" fill="white" opacity="0.7" />
            <circle cx="5" cy="13" r="1.5" fill="white" opacity="0.5" />
            <circle cx="13" cy="13" r="3" fill="white" opacity="0.9" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-[#F8FAFC]">Idea Matrix</h1>
      </div>

      {/* View Toggle */}
      <div className="flex bg-[#0F172A] rounded-lg p-0.5">
        <button
          onClick={() => onViewModeChange('matrix')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            viewMode === 'matrix'
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Matrix
        </button>
        <button
          onClick={() => onViewModeChange('table')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            viewMode === 'table'
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Table
        </button>
      </div>

      {/* Tier Filters */}
      <div className="flex items-center gap-1.5">
        {tiers.map(t => (
          <button
            key={t.key}
            onClick={() => onToggleTier(t.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              visibleTiers.has(t.key)
                ? 'bg-[#0F172A] text-[#F8FAFC]'
                : 'text-[#475569] hover:text-[#94A3B8]'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full transition-opacity"
              style={{
                backgroundColor: TIER_COLORS[t.key],
                opacity: visibleTiers.has(t.key) ? 1 : 0.3,
              }}
            />
            {t.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as Status | 'all')}
        className="bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-[#E2E8F0] outline-none focus:border-[#3B82F6]"
      >
        {statuses.map(s => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>

      {/* Show Labels Toggle (matrix only) */}
      {viewMode === 'matrix' && (
        <button
          onClick={() => onShowLabelsChange(!showLabels)}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            showLabels
              ? 'bg-[#0F172A] text-[#F8FAFC]'
              : 'text-[#475569] hover:text-[#94A3B8]'
          }`}
        >
          Labels
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <button
        onClick={onToggleSettings}
        className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1.5"
        title="Settings & Weights"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      </button>

      {/* Add Idea */}
      <button
        onClick={onAddIdea}
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Idea
      </button>
    </header>
  );
}
