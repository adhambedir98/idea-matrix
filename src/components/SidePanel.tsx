'use client';

import React, { useState } from 'react';
import { Idea, Tier, Status, TIER_LABELS, TIER_COLORS, STATUS_LABELS, STATUS_COLORS, CATEGORIES } from '@/lib/types';

interface SidePanelProps {
  idea: Idea;
  onUpdate: (id: string, updates: Partial<Idea>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function ScoreSlider({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-[#94A3B8] w-28 shrink-0">{label}</label>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1"
        style={color ? { accentColor: color } : undefined}
      />
      <span className="text-sm font-mono text-[#F8FAFC] w-6 text-right">{value}</span>
    </div>
  );
}

export default function SidePanel({ idea, onUpdate, onDelete, onClose }: SidePanelProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const update = (updates: Partial<Idea>) => onUpdate(idea.id, updates);

  return (
    <div className="w-full h-full bg-[#1E293B] border-l border-[#334155] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: TIER_COLORS[idea.tier] }}
          />
          <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
            {idea.tier === 'tier1' ? 'Tier 1' : idea.tier === 'tier2' ? 'Tier 2' : idea.tier === 'tier3' ? 'Tier 3' : 'Tier 4'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Composite score badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0F172A] rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Score</span>
            <span className="text-xl font-bold text-[#10B981]">
              {idea.compositeScore?.toFixed(1)}
            </span>
            <span className="text-xs text-[#475569]">/10</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <input
            type="text"
            value={idea.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full bg-transparent text-lg font-semibold text-[#F8FAFC] border-none outline-none placeholder-[#475569]"
            placeholder="Idea name..."
          />
        </div>

        {/* One-liner */}
        <div>
          <textarea
            value={idea.oneLiner}
            onChange={(e) => update({ oneLiner: e.target.value.slice(0, 140) })}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] resize-none outline-none focus:border-[#3B82F6] transition-colors"
            rows={2}
            placeholder="One-liner (max 140 chars)..."
          />
          <div className="text-xs text-[#475569] text-right mt-1">
            {idea.oneLiner.length}/140
          </div>
        </div>

        {/* Tier & Category & Status row */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Tier</label>
            <select
              value={idea.tier}
              onChange={(e) => update({ tier: e.target.value as Tier })}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3B82F6]"
            >
              {(Object.keys(TIER_LABELS) as Tier[]).map(t => (
                <option key={t} value={t}>{TIER_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Category</label>
            <select
              value={idea.category}
              onChange={(e) => update({ category: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3B82F6]"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Status</label>
            <select
              value={idea.status}
              onChange={(e) => update({ status: e.target.value as Status })}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3B82F6]"
            >
              {(Object.keys(STATUS_LABELS) as Status[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#334155]" />

        {/* Score sliders */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Scores</h3>
          <ScoreSlider label="Speed to Demo" value={idea.speedToDemo} onChange={(v) => update({ speedToDemo: v })} />
          <ScoreSlider label="Size of Prize" value={idea.sizeOfPrize} onChange={(v) => update({ sizeOfPrize: v })} />
          <ScoreSlider label="Passion" value={idea.passion} onChange={(v) => update({ passion: v })} />
          <ScoreSlider label="Team Fit" value={idea.teamFit} onChange={(v) => update({ teamFit: v })} />
          <ScoreSlider label="Moat" value={idea.moat} onChange={(v) => update({ moat: v })} />
          <ScoreSlider label="YC Alignment" value={idea.ycAlignment} onChange={(v) => update({ ycAlignment: v })} />
        </div>

        <div className="border-t border-[#334155]" />

        {/* Conviction */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Conviction (Bubble Size)</h3>
          <ScoreSlider label="Conviction" value={idea.conviction} onChange={(v) => update({ conviction: v })} color="#F59E0B" />
        </div>

        <div className="border-t border-[#334155]" />

        {/* Sources */}
        <div>
          <label className="text-xs text-[#94A3B8] mb-1 block">Sources</label>
          <textarea
            value={idea.sources}
            onChange={(e) => update({ sources: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] resize-none outline-none focus:border-[#3B82F6] transition-colors"
            rows={2}
            placeholder="Where this idea came from..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-[#94A3B8] mb-1 block">Notes</label>
          <textarea
            value={idea.notes}
            onChange={(e) => update({ notes: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] resize-none outline-none focus:border-[#3B82F6] transition-colors"
            rows={4}
            placeholder="Freeform notes..."
          />
        </div>

        <div className="border-t border-[#334155]" />

        {/* Delete */}
        <div className="pb-4">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-4 py-2 text-sm text-[#EF4444] border border-[#EF4444]/30 rounded-lg hover:bg-[#EF4444]/10 transition-colors"
            >
              Delete Idea
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-[#EF4444]">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onDelete(idea.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 text-sm text-white bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm text-[#94A3B8] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
