'use client';

import React from 'react';
import { useStore } from '@/lib/useStore';
import Header from '@/components/Header';
import Matrix from '@/components/Matrix';
import RankingTable from '@/components/RankingTable';
import SidePanel from '@/components/SidePanel';
import AddIdeaModal from '@/components/AddIdeaModal';
import SettingsPanel from '@/components/SettingsPanel';

export default function Home() {
  const store = useStore();

  if (!store.mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#10B981] rounded-lg animate-pulse" />
          <span className="text-[#94A3B8] text-sm">Loading Idea Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0F172A]">
      <Header
        viewMode={store.viewMode}
        showLabels={store.showLabels}
        visibleTiers={store.visibleTiers}
        statusFilter={store.statusFilter}
        onViewModeChange={store.setViewMode}
        onShowLabelsChange={store.setShowLabels}
        onToggleTier={store.toggleTier}
        onStatusFilterChange={store.setStatusFilter}
        onAddIdea={() => store.setIsAddingNew(true)}
        onToggleSettings={() => store.setShowSettings(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main area */}
        <div className="flex-1 overflow-hidden">
          {store.viewMode === 'matrix' ? (
            <Matrix
              ideas={store.filteredIdeas}
              selectedId={store.selectedId}
              showLabels={store.showLabels}
              onSelectIdea={store.setSelectedId}
              onUpdateIdea={store.updateIdea}
            />
          ) : (
            <RankingTable
              ideas={store.filteredIdeas}
              selectedId={store.selectedId}
              onSelectIdea={store.setSelectedId}
            />
          )}
        </div>

        {/* Side panel */}
        {store.selectedIdea && (
          <div className="w-[360px] shrink-0 border-l border-[#334155]">
            <SidePanel
              idea={store.selectedIdea}
              onUpdate={store.updateIdea}
              onDelete={store.deleteIdea}
              onClose={() => store.setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {store.isAddingNew && (
        <AddIdeaModal
          onAdd={store.addIdea}
          onClose={() => store.setIsAddingNew(false)}
        />
      )}

      {store.showSettings && (
        <SettingsPanel
          weights={store.weights}
          ideas={store.ideas}
          onWeightsChange={store.setWeights}
          onClose={() => store.setShowSettings(false)}
          onImport={store.importIdeas}
          onReset={store.resetToDefaults}
        />
      )}
    </div>
  );
}
