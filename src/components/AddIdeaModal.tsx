'use client';

import React, { useState } from 'react';
import { Idea, Tier, TIER_LABELS, CATEGORIES } from '@/lib/types';
import { createNewIdea } from '@/lib/utils';

interface AddIdeaModalProps {
  onAdd: (idea: Idea) => void;
  onClose: () => void;
}

export default function AddIdeaModal({ onAdd, onClose }: AddIdeaModalProps) {
  const [name, setName] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [tier, setTier] = useState<Tier>('tier2');
  const [category, setCategory] = useState('Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const idea = createNewIdea();
    idea.name = name.trim();
    idea.oneLiner = oneLiner.trim();
    idea.tier = tier;
    idea.category = category;
    onAdd(idea);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">New Idea</h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="Idea name..."
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">One-liner</label>
            <textarea
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value.slice(0, 140))}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] resize-none outline-none focus:border-[#3B82F6] transition-colors"
              rows={2}
              placeholder="Brief description (max 140 chars)..."
            />
            <div className="text-xs text-[#475569] text-right mt-1">{oneLiner.length}/140</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#94A3B8] mb-1 block">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3B82F6]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-[#475569]">
            All scores default to 5. Edit them after adding.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#334155] disabled:text-[#475569] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Add Idea
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-[#94A3B8] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
