import React from 'react';
import { Activity, Scissors } from 'lucide-react';
import type { MaxFlowStep, FlowNode } from '../../../engine/types';

interface NetworkFlowVisualizerProps {
  step: MaxFlowStep;
}

export const NetworkFlowVisualizer: React.FC<NetworkFlowVisualizerProps> = ({ step }) => {
  const {
    nodes,
    edges,
    sourceId,
    sinkId,
    currentFlow,
    augmentingPath,
    bottleneckCapacity,
    minCutReachableNodes,
    isComplete,
  } = step;

  const nodeMap = new Map<string, FlowNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const isEdgeInAugmentingPath = (from: string, to: string): boolean => {
    if (!augmentingPath || augmentingPath.length < 2) return false;
    for (let i = 0; i < augmentingPath.length - 1; i++) {
      if (
        (augmentingPath[i] === from && augmentingPath[i + 1] === to) ||
        (augmentingPath[i] === to && augmentingPath[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Network Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 mb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-txt-primary flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-accent-secondary" />
            Network State:
          </span>
          <span className="font-mono text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            Current Flow: {currentFlow}
          </span>
          {bottleneckCapacity !== undefined && (
            <span className="font-mono text-amber-300 font-medium bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Bottleneck: +{bottleneckCapacity}
            </span>
          )}
        </div>

        {augmentingPath && (
          <div className="flex items-center gap-1.5 font-mono text-cyan-300 text-[11px] bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-500/30">
            <span>Path:</span>
            <span>{augmentingPath.join(' → ')}</span>
          </div>
        )}

        {isComplete && minCutReachableNodes && (
          <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-500/30">
            <Scissors className="w-3.5 h-3.5 text-accent-primary" />
            <span>
              Min-Cut: S-Side = {'{'}
              {minCutReachableNodes.join(', ')}
              {'}'}
            </span>
          </div>
        )}
      </div>

      {/* SVG Network Graph Canvas */}
      <div className="clay-inset p-2 sm:p-4 rounded-clay-sm relative overflow-x-auto flex justify-center">
        <svg
          viewBox="0 0 700 340"
          className="w-full max-w-[700px] h-[340px] select-none"
        >
          <defs>
            <marker
              id="arrow-default"
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
              id="arrow-active"
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
              id="arrow-saturated"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FBBF24" />
            </marker>
          </defs>

          {/* Directed Edges */}
          {edges.map((e, idx) => {
            const u = nodeMap.get(e.from);
            const v = nodeMap.get(e.to);
            if (!u || !v) return null;

            const isPath = isEdgeInAugmentingPath(e.from, e.to);
            const isSaturated = e.flow === e.capacity && e.capacity > 0;
            const hasFlow = e.flow > 0;

            let strokeColor = '#374151';
            let strokeWidth = 2;
            let marker = 'url(#arrow-default)';

            if (isPath) {
              strokeColor = '#67E8F9';
              strokeWidth = 4;
              marker = 'url(#arrow-active)';
            } else if (isSaturated) {
              strokeColor = '#FBBF24';
              strokeWidth = 2.5;
              marker = 'url(#arrow-saturated)';
            } else if (hasFlow) {
              strokeColor = '#818CF8';
              strokeWidth = 2.5;
            }

            // Calculate label position (midpoint with slight normal offset)
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const offsetX = -dy / len * 12;
            const offsetY = dx / len * 12;

            return (
              <g key={`edge-${e.from}-${e.to}-${idx}`}>
                {/* Edge line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isPath ? '4 2' : 'none'}
                  markerEnd={marker}
                  className="transition-colors duration-200"
                />

                {/* Flow / Capacity Label */}
                <g transform={`translate(${midX + offsetX}, ${midY + offsetY})`}>
                  <rect
                    x="-20"
                    y="-9"
                    width="40"
                    height="18"
                    rx="4"
                    fill="#111318"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    className="font-mono text-[10px] font-bold"
                    fill={isSaturated ? '#FBBF24' : hasFlow ? '#A78BFA' : '#9CA3AF'}
                  >
                    {e.flow}/{e.capacity}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Graph Nodes */}
          {nodes.map((node) => {
            const isSource = node.id === sourceId;
            const isSink = node.id === sinkId;
            const isInMinCutS = isComplete && minCutReachableNodes?.includes(node.id);

            let nodeFill = '#20242D';
            let strokeColor = 'rgba(255, 255, 255, 0.15)';
            if (isSource) {
              nodeFill = '#581C87';
              strokeColor = '#A78BFA';
            } else if (isSink) {
              nodeFill = '#164E63';
              strokeColor = '#67E8F9';
            } else if (isInMinCutS) {
              nodeFill = '#3B1F54';
              strokeColor = '#C084FC';
            }

            return (
              <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r="20"
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  className="shadow-lg transition-all duration-200"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className="font-mono text-xs font-bold"
                  fill="#F3F4F6"
                >
                  {node.id.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* State Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-[11px] text-txt-secondary border-t border-white/5 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#581C87] border border-purple-400" />
          <span>Source (S)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#164E63] border border-cyan-400" />
          <span>Sink (T)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-cyan-400 rounded" />
          <span>Augmenting Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-amber-400 rounded" />
          <span>Saturated Edge (Flow = Cap)</span>
        </div>
      </div>
    </div>
  );
};
