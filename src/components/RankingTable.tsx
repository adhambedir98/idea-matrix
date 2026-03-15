'use client';

import React, { useState, useMemo } from 'react';
import { Idea, Tier, Status, TIER_COLORS, STATUS_COLORS, STATUS_LABELS } from '@/lib/types';

interface RankingTableProps {
  ideas: Idea[];
  selectedId: string | null;
  onSelectIdea: (id: string) => void;
}

type SortField = 'compositeScore' | 'name' | 'speedToDemo' | 'sizeOfPrize' | 'passion' | 'teamFit' | 'moat' | 'ycAlignment' | 'conviction';
type SortDir = 'asc' | 'desc';

const columns: { key: SortField; label: string; short: string; width: string }[] = [
  { key: 'compositeScore', label: 'Composite', short: 'Score', width: 'w-20' },
  { key: 'name', label: 'Name', short: 'Name', width: 'flex-1 min-w-[200px]' },
  { key: 'speedToDemo', label: 'Speed', short: 'Speed', width: 'w-16' },
  { key: 'sizeOfPrize', label: 'TAM', short: 'TAM', width: 'w-14' },
  { key: 'passion', label: 'Passion', short: 'Pass', width: 'w-14' },
  { key: 'teamFit', label: 'Team Fit', short: 'TF', width: 'w-14' },
  { key: 'moat', label: 'Moat', short: 'Moat', width: 'w-14' },
  { key: 'ycAlignment', label: 'YC', short: 'YC', width: 'w-14' },
  { key: 'conviction', label: 'Conviction', short: 'Conv', width: 'w-16' },
];

export default function RankingTable({ ideas, selectedId, onSelectIdea }: RankingTableProps) {
  const [sortField, setSortField] = useState<SortField>('compositeScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    return [...ideas].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [ideas, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-[#1E293B]">
            <th className="px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider w-12">
              #
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider w-10">
              Tier
            </th>
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider cursor-pointer hover:text-[#F8FAFC] transition-colors ${col.width}`}
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.short}
                  {sortField === col.key && (
                    <span className="text-[#3B82F6]">
                      {sortDir === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider w-20">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((idea, idx) => (
            <tr
              key={idea.id}
              onClick={() => onSelectIdea(idea.id)}
              className={`cursor-pointer transition-colors ${
                idea.id === selectedId
                  ? 'bg-[#334155]'
                  : 'hover:bg-[#1E293B]/50'
              }`}
            >
              <td className="px-3 py-3 text-[#475569] font-mono text-xs">
                {idx + 1}
              </td>
              <td className="px-3 py-3">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: TIER_COLORS[idea.tier as Tier] }}
                />
              </td>
              {columns.map(col => (
                <td key={col.key} className={`px-3 py-3 ${col.width}`}>
                  {col.key === 'name' ? (
                    <div>
                      <div className="font-medium text-[#F8FAFC]">{idea.name}</div>
                      <div className="text-xs text-[#94A3B8] truncate max-w-[300px]">{idea.oneLiner}</div>
                    </div>
                  ) : col.key === 'compositeScore' ? (
                    <span className="font-bold text-[#10B981]">
                      {idea.compositeScore?.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-[#E2E8F0] font-mono">
                      {idea[col.key]}
                    </span>
                  )}
                </td>
              ))}
              <td className="px-3 py-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: STATUS_COLORS[idea.status as Status] + '20',
                    color: STATUS_COLORS[idea.status as Status],
                  }}
                >
                  {STATUS_LABELS[idea.status as Status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
