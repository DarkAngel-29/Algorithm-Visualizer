import React from 'react';
import { Network, AlertOctagon } from 'lucide-react';
import type { BellmanFordStep, BFNode } from '../../../engine/types';

interface BellmanFordVisualizerProps {
  step: BellmanFordStep;
}

export const BellmanFordVisualizer: React.FC<BellmanFordVisualizerProps> = ({ step }) => {
  const {
    nodes,
    edges,
    sourceId,
    distances,
    predecessors,
    activeEdge,
    relaxedSuccessfully,
    isNegativeCycleDetected,
    negativeCycleNodes,
    currentIteration,
  } = step;

  const nodeMap = new Map<string, BFNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Metrics Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 mb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-txt-primary flex items-center gap-1.5">
            <Network className="w-4 h-4 text-accent-secondary" />
            Relaxation Status:
          </span>
          <span className="font-mono text-purple-300 font-bold bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-500/30">
            Pass {currentIteration} / {nodes.length - 1}
          </span>
        </div>

        {isNegativeCycleDetected && (
          <div className="flex items-center gap-1.5 text-xs text-red-300 bg-red-950/40 px-2.5 py-1 rounded border border-red-500/30 animate-pulse font-semibold">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Negative-Weight Cycle Detected!</span>
          </div>
        )}
      </div>

      {/* Directed Graph Canvas */}
      <div className="clay-inset p-2 sm:p-4 rounded-clay-sm relative overflow-x-auto flex justify-center">
        <svg
          viewBox="0 0 700 340"
          className="w-full max-w-[700px] h-[340px] select-none"
        >
          <defs>
            <marker
              id="bf-arrow-default"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6B7280" />
            </marker>
            <marker
              id="bf-arrow-active"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#67E8F9" />
            </marker>
            <marker
              id="bf-arrow-relaxed"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FBBF24" />
            </marker>
            <marker
              id="bf-arrow-cycle"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
            </marker>
          </defs>

          {/* Directed Weighted Edges */}
          {edges.map((e, idx) => {
            const u = nodeMap.get(e.from);
            const v = nodeMap.get(e.to);
            if (!u || !v) return null;

            const isActive = activeEdge && activeEdge.from === e.from && activeEdge.to === e.to;
            const isCycleEdge =
              isNegativeCycleDetected &&
              negativeCycleNodes?.includes(e.from) &&
              negativeCycleNodes?.includes(e.to);

            let strokeColor = '#374151';
            let strokeWidth = 2;
            let marker = 'url(#bf-arrow-default)';

            if (isCycleEdge) {
              strokeColor = '#EF4444';
              strokeWidth = 3.5;
              marker = 'url(#bf-arrow-cycle)';
            } else if (isActive) {
              if (relaxedSuccessfully) {
                strokeColor = '#FBBF24';
                strokeWidth = 3.5;
                marker = 'url(#bf-arrow-relaxed)';
              } else {
                strokeColor = '#67E8F9';
                strokeWidth = 3;
                marker = 'url(#bf-arrow-active)';
              }
            }

            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const offsetX = -dy / len * 14;
            const offsetY = dx / len * 14;

            return (
              <g key={`edge-${e.from}-${e.to}-${idx}`}>
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  className="transition-colors duration-200"
                />
                {/* Weight badge */}
                <g transform={`translate(${midX + offsetX}, ${midY + offsetY})`}>
                  <rect
                    x="-14"
                    y="-8"
                    width="28"
                    height="16"
                    rx="3"
                    fill="#111318"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="font-mono text-[10px] font-bold"
                    fill={e.weight < 0 ? '#F87171' : '#F3F4F6'}
                  >
                    {e.weight}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Graph Nodes */}
          {nodes.map((node) => {
            const isSource = node.id === sourceId;
            const dist = distances[node.id];
            const inCycle = negativeCycleNodes?.includes(node.id);

            let nodeFill = '#20242D';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';

            if (inCycle) {
              nodeFill = '#450A0A';
              strokeColor = '#EF4444';
            } else if (isSource) {
              nodeFill = '#581C87';
              strokeColor = '#A78BFA';
            }

            return (
              <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r="22"
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  className="shadow-lg transition-all duration-200"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  className="font-mono text-xs font-bold"
                  fill="#F3F4F6"
                >
                  {node.id}
                </text>
                {/* Tentative Distance */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  className="font-mono text-[9px] font-bold"
                  fill={dist === Infinity ? '#9CA3AF' : '#86EFAC'}
                >
                  {dist === Infinity ? '∞' : dist}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Distance and Predecessor Summary Table */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-txt-muted mb-2">
          Current Distance & Predecessor Table:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
          {nodes.map((node) => {
            const dist = distances[node.id];
            const pred = predecessors[node.id];
            const inCycle = negativeCycleNodes?.includes(node.id);

            return (
              <div
                key={`tbl-${node.id}`}
                className={`p-2 rounded-clay-sm border ${
                  inCycle
                    ? 'bg-red-950/30 border-red-500/40 text-red-300'
                    : 'clay-card text-txt-secondary'
                }`}
              >
                <div className="flex items-center justify-between text-txt-primary font-bold">
                  <span>Node {node.id}</span>
                  {node.id === sourceId && (
                    <span className="text-[9px] text-purple-300 bg-purple-500/20 px-1 rounded">
                      SRC
                    </span>
                  )}
                </div>
                <div className="text-[11px] mt-1 text-emerald-300">
                  dist: <strong className="text-white">{dist === Infinity ? '∞' : dist}</strong>
                </div>
                <div className="text-[10px] text-txt-muted">
                  pred: {pred ? pred : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
