'use client';

import React, { useRef } from 'react';
import { Weights, DEFAULT_WEIGHTS, Idea } from '@/lib/types';
import { exportAsCSV, downloadFile } from '@/lib/utils';

interface SettingsPanelProps {
  weights: Weights;
  ideas: Idea[];
  onWeightsChange: (weights: Weights) => void;
  onClose: () => void;
  onImport: (ideas: Idea[]) => void;
  onReset: () => void;
}

const WEIGHT_LABELS: Record<keyof Weights, string> = {
  speedToDemo: 'Speed to Demo',
  sizeOfPrize: 'Size of Prize',
  passion: 'Passion',
  teamFit: 'Team Fit',
  moat: 'Moat',
  ycAlignment: 'YC Alignment',
};

export default function SettingsPanel({
  weights,
  ideas,
  onWeightsChange,
  onClose,
  onImport,
  onReset,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWeightChange = (key: keyof Weights, value: number) => {
    const newWeights = { ...weights, [key]: value / 100 };
    onWeightsChange(newWeights);
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleExportJSON = () => {
    const data = JSON.stringify(ideas, null, 2);
    downloadFile(data, 'idea-matrix-export.json', 'application/json');
  };

  const handleExportCSV = () => {
    const csv = exportAsCSV(ideas);
    downloadFile(csv, 'idea-matrix-export.csv', 'text/csv');
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">Settings</h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Weight Sliders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
                Composite Score Weights
              </h3>
              <span
                className={`text-xs font-mono ${
                  Math.abs(totalWeight - 1) < 0.01 ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                Total: {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>

            {(Object.keys(WEIGHT_LABELS) as (keyof Weights)[]).map(key => (
              <div key={key} className="flex items-center gap-3">
                <label className="text-xs text-[#94A3B8] w-28 shrink-0">
                  {WEIGHT_LABELS[key]}
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={Math.round(weights[key] * 100)}
                  onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono text-[#F8FAFC] w-10 text-right">
                  {Math.round(weights[key] * 100)}%
                </span>
              </div>
            ))}

            <button
              onClick={() => onWeightsChange(DEFAULT_WEIGHTS)}
              className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
            >
              Reset weights to defaults
            </button>
          </div>

          <div className="border-t border-[#334155]" />

          {/* Export / Import */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
              Data
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="px-3 py-2 text-xs font-medium text-[#E2E8F0] bg-[#0F172A] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 text-xs font-medium text-[#E2E8F0] bg-[#0F172A] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={handleImportJSON}
                className="px-3 py-2 text-xs font-medium text-[#E2E8F0] bg-[#0F172A] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
              >
                Import JSON
              </button>
              <button
                onClick={() => {
                  if (confirm('Reset all data to defaults? This will erase all your changes.')) {
                    onReset();
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-[#EF4444] bg-[#0F172A] border border-[#EF4444]/30 rounded-lg hover:bg-[#EF4444]/10 transition-colors"
              >
                Reset All
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
