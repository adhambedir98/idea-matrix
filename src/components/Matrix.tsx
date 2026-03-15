'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { Idea, Tier, TIER_COLORS } from '@/lib/types';
import { getBubbleRadius } from '@/lib/utils';

interface MatrixProps {
  ideas: Idea[];
  selectedId: string | null;
  showLabels: boolean;
  onSelectIdea: (id: string | null) => void;
  onUpdateIdea: (id: string, updates: Partial<Idea>) => void;
}

const MARGIN = { top: 60, right: 60, bottom: 80, left: 90 };

const X_TICKS = [
  { value: 1, label: '6+ months' },
  { value: 3, label: '' },
  { value: 5, label: '1-3 months' },
  { value: 7, label: '1-4 weeks' },
  { value: 10, label: 'This week' },
];

const Y_TICKS = [
  { value: 1, label: '<$1B' },
  { value: 3, label: '' },
  { value: 5, label: '$1-10B' },
  { value: 7, label: '$10-50B' },
  { value: 10, label: '$50B+' },
];

export default function Matrix({ ideas, selectedId, showLabels, onSelectIdea, onUpdateIdea }: MatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; idea: Idea } | null>(null);

  // Observe container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(400, width), height: Math.max(300, height) });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const renderMatrix = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    const { width, height } = dimensions;
    const plotWidth = width - MARGIN.left - MARGIN.right;
    const plotHeight = height - MARGIN.top - MARGIN.bottom;

    svg.selectAll('*').remove();

    // Scales
    const xScale = d3.scaleLinear().domain([0.5, 10.5]).range([0, plotWidth]);
    const yScale = d3.scaleLinear().domain([0.5, 10.5]).range([plotHeight, 0]);

    // Main group with margin
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Quadrant backgrounds
    const midX = xScale(5.5);
    const midY = yScale(5.5);

    const quadrants = [
      { x: 0, y: 0, w: midX, h: midY, color: 'rgba(139, 92, 246, 0.04)', label: '🔬 LONG BET', lx: midX * 0.5, ly: midY * 0.5 },
      { x: midX, y: 0, w: plotWidth - midX, h: midY, color: 'rgba(16, 185, 129, 0.06)', label: '🚀 BUILD NOW', lx: midX + (plotWidth - midX) * 0.5, ly: midY * 0.5 },
      { x: 0, y: midY, w: midX, h: plotHeight - midY, color: 'rgba(239, 68, 68, 0.04)', label: '❌ AVOID', lx: midX * 0.5, ly: midY + (plotHeight - midY) * 0.5 },
      { x: midX, y: midY, w: plotWidth - midX, h: plotHeight - midY, color: 'rgba(245, 158, 11, 0.04)', label: '⚡ QUICK WIN', lx: midX + (plotWidth - midX) * 0.5, ly: midY + (plotHeight - midY) * 0.5 },
    ];

    quadrants.forEach(q => {
      g.append('rect')
        .attr('x', q.x)
        .attr('y', q.y)
        .attr('width', q.w)
        .attr('height', q.h)
        .attr('fill', q.color);

      g.append('text')
        .attr('x', q.lx)
        .attr('y', q.ly)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'rgba(248, 250, 252, 0.08)')
        .attr('font-size', Math.min(plotWidth, plotHeight) * 0.04)
        .attr('font-weight', '700')
        .attr('pointer-events', 'none')
        .text(q.label);
    });

    // Quadrant dividing lines
    g.append('line')
      .attr('x1', midX).attr('y1', 0).attr('x2', midX).attr('y2', plotHeight)
      .attr('stroke', '#334155').attr('stroke-width', 1).attr('stroke-dasharray', '6,4');
    g.append('line')
      .attr('x1', 0).attr('y1', midY).attr('x2', plotWidth).attr('y2', midY)
      .attr('stroke', '#334155').attr('stroke-width', 1).attr('stroke-dasharray', '6,4');

    // Grid lines
    for (let i = 1; i <= 10; i++) {
      g.append('line')
        .attr('x1', xScale(i)).attr('y1', 0).attr('x2', xScale(i)).attr('y2', plotHeight)
        .attr('stroke', '#1E293B').attr('stroke-width', 0.5);
      g.append('line')
        .attr('x1', 0).attr('y1', yScale(i)).attr('x2', plotWidth).attr('y2', yScale(i))
        .attr('stroke', '#1E293B').attr('stroke-width', 0.5);
    }

    // X axis
    const xAxisG = g.append('g').attr('transform', `translate(0,${plotHeight})`);
    X_TICKS.forEach(tick => {
      const x = xScale(tick.value);
      xAxisG.append('line')
        .attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', 6)
        .attr('stroke', '#94A3B8');
      if (tick.label) {
        xAxisG.append('text')
          .attr('x', x).attr('y', 22)
          .attr('text-anchor', 'middle')
          .attr('fill', '#94A3B8').attr('font-size', 11)
          .text(tick.label);
      }
      // Numeric tick
      xAxisG.append('text')
        .attr('x', x).attr('y', tick.label ? 38 : 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#475569').attr('font-size', 10)
        .text(tick.value.toString());
    });

    // X axis label
    xAxisG.append('text')
      .attr('x', plotWidth / 2).attr('y', 58)
      .attr('text-anchor', 'middle')
      .attr('fill', '#CBD5E1').attr('font-size', 13).attr('font-weight', '600')
      .text('Speed to Demo →');

    // Y axis
    const yAxisG = g.append('g');
    Y_TICKS.forEach(tick => {
      const y = yScale(tick.value);
      yAxisG.append('line')
        .attr('x1', -6).attr('y1', y).attr('x2', 0).attr('y2', y)
        .attr('stroke', '#94A3B8');
      if (tick.label) {
        yAxisG.append('text')
          .attr('x', -12).attr('y', y)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#94A3B8').attr('font-size', 11)
          .text(tick.label);
      }
      yAxisG.append('text')
        .attr('x', tick.label ? -60 : -12).attr('y', y)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#475569').attr('font-size', 10)
        .text(tick.value.toString());
    });

    // Y axis label
    yAxisG.append('text')
      .attr('transform', `translate(${-72},${plotHeight / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#CBD5E1').attr('font-size', 13).attr('font-weight', '600')
      .text('↑ Size of the Prize (TAM)');

    // Bubbles
    const bubbleG = g.append('g').attr('class', 'bubbles');

    // Sort: smaller bubbles on top for visibility
    const sortedIdeas = [...ideas].sort((a, b) => b.conviction - a.conviction);

    sortedIdeas.forEach(idea => {
      const cx = xScale(idea.speedToDemo);
      const cy = yScale(idea.sizeOfPrize);
      const r = getBubbleRadius(idea.conviction);
      const color = TIER_COLORS[idea.tier as Tier];
      const isSelected = idea.id === selectedId;

      const bubble = bubbleG.append('g')
        .attr('class', 'bubble-group')
        .attr('cursor', 'pointer')
        .attr('transform', `translate(${cx},${cy})`);

      // Glow filter
      if (isSelected) {
        bubble.append('circle')
          .attr('r', r + 4)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('opacity', 0.6);
      }

      // Main bubble
      bubble.append('circle')
        .attr('r', r)
        .attr('fill', color)
        .attr('fill-opacity', isSelected ? 0.9 : 0.7)
        .attr('stroke', isSelected ? '#F8FAFC' : color)
        .attr('stroke-width', isSelected ? 2 : 1)
        .style('filter', `drop-shadow(0 0 ${isSelected ? 8 : 4}px ${color}40)`);

      // Label
      if (showLabels) {
        const labelText = idea.name.length > 18 ? idea.name.substring(0, 16) + '…' : idea.name;
        bubble.append('text')
          .attr('y', r + 14)
          .attr('text-anchor', 'middle')
          .attr('fill', '#E2E8F0')
          .attr('font-size', 10)
          .attr('font-weight', '500')
          .attr('pointer-events', 'none')
          .text(labelText);
      }

      // Interaction handlers
      bubble.on('click', (event: MouseEvent) => {
        event.stopPropagation();
        onSelectIdea(idea.id);
      });

      bubble.on('mouseenter', (event: MouseEvent) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            idea,
          });
        }
      });

      bubble.on('mouseleave', () => {
        setTooltip(null);
      });

      // Drag behavior
      const drag = d3.drag<SVGGElement, unknown>()
        .on('start', function () {
          d3.select(this).raise();
          setTooltip(null);
        })
        .on('drag', function (event: d3.D3DragEvent<SVGGElement, unknown, unknown>) {
          const newX = Math.max(0, Math.min(plotWidth, event.x));
          const newY = Math.max(0, Math.min(plotHeight, event.y));
          d3.select(this).attr('transform', `translate(${newX},${newY})`);
        })
        .on('end', function (event: d3.D3DragEvent<SVGGElement, unknown, unknown>) {
          const newX = Math.max(0, Math.min(plotWidth, event.x));
          const newY = Math.max(0, Math.min(plotHeight, event.y));
          const newSpeed = Math.round(Math.max(1, Math.min(10, xScale.invert(newX))));
          const newSize = Math.round(Math.max(1, Math.min(10, yScale.invert(newY))));
          onUpdateIdea(idea.id, { speedToDemo: newSpeed, sizeOfPrize: newSize });
          onSelectIdea(idea.id);
        });

      drag(bubble as unknown as d3.Selection<SVGGElement, unknown, null, undefined>);
    });

    // Click background to deselect
    svg.on('click', () => {
      onSelectIdea(null);
    });

  }, [ideas, selectedId, showLabels, dimensions, onSelectIdea, onUpdateIdea]);

  useEffect(() => {
    renderMatrix();
  }, [renderMatrix]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: '#0F172A' }}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 shadow-xl max-w-xs"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 10,
            transform: tooltip.x > dimensions.width * 0.6 ? 'translateX(-110%)' : 'none',
          }}
        >
          <div className="font-semibold text-sm text-[#F8FAFC] mb-1">{tooltip.idea.name}</div>
          <div className="text-xs text-[#94A3B8] mb-2">{tooltip.idea.oneLiner}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="text-[#94A3B8]">Speed: <span className="text-[#F8FAFC]">{tooltip.idea.speedToDemo}/10</span></div>
            <div className="text-[#94A3B8]">TAM: <span className="text-[#F8FAFC]">{tooltip.idea.sizeOfPrize}/10</span></div>
            <div className="text-[#94A3B8]">Passion: <span className="text-[#F8FAFC]">{tooltip.idea.passion}/10</span></div>
            <div className="text-[#94A3B8]">Team Fit: <span className="text-[#F8FAFC]">{tooltip.idea.teamFit}/10</span></div>
            <div className="text-[#94A3B8]">Moat: <span className="text-[#F8FAFC]">{tooltip.idea.moat}/10</span></div>
            <div className="text-[#94A3B8]">YC: <span className="text-[#F8FAFC]">{tooltip.idea.ycAlignment}/10</span></div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#334155] flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: TIER_COLORS[tooltip.idea.tier as Tier] }}
            />
            <span className="text-xs text-[#94A3B8]">
              {tooltip.idea.tier === 'tier1' ? 'Tier 1' :
               tooltip.idea.tier === 'tier2' ? 'Tier 2' :
               tooltip.idea.tier === 'tier3' ? 'Tier 3' : 'Tier 4'}
            </span>
            <span className="text-xs text-[#94A3B8] ml-auto">
              Conviction: {tooltip.idea.conviction}/10
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
