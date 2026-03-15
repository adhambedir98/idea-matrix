'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Idea, Weights, DEFAULT_WEIGHTS, Tier, Status, ViewMode } from './types';
import { calculateComposite, generateId } from './utils';
import { seedIdeas } from '@/data/seedIdeas';

const STORAGE_KEY = 'idea-matrix-ideas';
const WEIGHTS_KEY = 'idea-matrix-weights';

function loadIdeas(): Idea[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load ideas from localStorage', e);
  }
  // Seed with default ideas
  const seeded = seedIdeas.map(idea => ({
    ...idea,
    id: generateId(),
  }));
  return seeded;
}

function loadWeights(): Weights {
  if (typeof window === 'undefined') return DEFAULT_WEIGHTS;
  try {
    const stored = localStorage.getItem(WEIGHTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load weights from localStorage', e);
  }
  return DEFAULT_WEIGHTS;
}

export function useStore() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [weights, setWeightsState] = useState<Weights>(DEFAULT_WEIGHTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [showLabels, setShowLabels] = useState(true);
  const [visibleTiers, setVisibleTiers] = useState<Set<Tier>>(
    new Set(['tier1', 'tier2', 'tier3'])
  );
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedIdeas = loadIdeas();
    const loadedWeights = loadWeights();
    setIdeas(loadedIdeas);
    setWeightsState(loadedWeights);
    setMounted(true);
  }, []);

  // Save ideas to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  }, [ideas, mounted]);

  // Save weights to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  }, [weights, mounted]);

  // Compute composite scores
  const ideasWithScores = useMemo(() => {
    return ideas.map(idea => ({
      ...idea,
      compositeScore: calculateComposite(idea, weights),
    }));
  }, [ideas, weights]);

  // Filtered ideas
  const filteredIdeas = useMemo(() => {
    return ideasWithScores.filter(idea => {
      if (!visibleTiers.has(idea.tier)) return false;
      if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
      return true;
    });
  }, [ideasWithScores, visibleTiers, statusFilter]);

  const selectedIdea = useMemo(() => {
    return ideasWithScores.find(i => i.id === selectedId) ?? null;
  }, [ideasWithScores, selectedId]);

  const updateIdea = useCallback((id: string, updates: Partial<Idea>) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === id ? { ...idea, ...updates } : idea
    ));
  }, []);

  const addIdea = useCallback((idea: Idea) => {
    setIdeas(prev => [...prev, idea]);
    setSelectedId(idea.id);
    setIsAddingNew(false);
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [selectedId]);

  const setWeights = useCallback((newWeights: Weights) => {
    setWeightsState(newWeights);
  }, []);

  const toggleTier = useCallback((tier: Tier) => {
    setVisibleTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  }, []);

  const importIdeas = useCallback((importedIdeas: Idea[]) => {
    setIdeas(importedIdeas);
    setSelectedId(null);
  }, []);

  const resetToDefaults = useCallback(() => {
    const seeded = seedIdeas.map(idea => ({
      ...idea,
      id: generateId(),
    }));
    setIdeas(seeded);
    setWeightsState(DEFAULT_WEIGHTS);
    setSelectedId(null);
  }, []);

  return {
    ideas: ideasWithScores,
    filteredIdeas,
    weights,
    selectedId,
    selectedIdea,
    viewMode,
    showLabels,
    visibleTiers,
    statusFilter,
    isAddingNew,
    showSettings,
    mounted,

    setSelectedId,
    setViewMode,
    setShowLabels,
    setStatusFilter,
    setIsAddingNew,
    setShowSettings,

    updateIdea,
    addIdea,
    deleteIdea,
    setWeights,
    toggleTier,
    importIdeas,
    resetToDefaults,
  };
}
