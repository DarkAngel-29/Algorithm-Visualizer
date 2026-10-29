import React from 'react';
import { motion } from 'framer-motion';
import { Package, Check, Scale, DollarSign } from 'lucide-react';
import type { KnapsackStep } from '../../../engine/types';

interface KnapsackVisualizerProps {
  step: KnapsackStep;
}

export const KnapsackVisualizer: React.FC<KnapsackVisualizerProps> = ({ step }) => {
  const {
    items,
    capacity,
    dpTable,
    currentItemIndex,
    currentWeight,
    comparingCells,
    tracebackPath,
    selectedItemIds = [],
    isReconstruction,
  } = step;

  // Check if cell is in traceback path
  const isCellInTraceback = (r: number, c: number): boolean => {
    return !!tracebackPath && tracebackPath.some(([row, col]) => row === r && col === c);
  };

  // Check if cell is being referenced in current comparison
  const isExcludeRef = (r: number, c: number): boolean => {
    return !!comparingCells && comparingCells.excludeCell[0] === r && comparingCells.excludeCell[1] === c;
  };

  const isIncludeRef = (r: number, c: number): boolean => {
    return (
      !!comparingCells &&
      !!comparingCells.includeCell &&
      comparingCells.includeCell[0] === r &&
      comparingCells.includeCell[1] === c
    );
  };

  const isActiveCell = (r: number, c: number): boolean => {
    return !isReconstruction && r === currentItemIndex && c === currentWeight;
  };

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Top Region: Item Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-accent-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">
              Available Items Pool
            </h3>
          </div>
          <span className="text-[11px] font-mono text-txt-muted">
            Knapsack Limit: <strong className="text-cyan-300">{capacity} kg</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((item, idx) => {
            const isCurrentlyConsidering = !isReconstruction && currentItemIndex === idx + 1;
            const isSelectedInOptimal = selectedItemIds.includes(item.id);

            let cardBorder = 'border-white/5';
            let cardBg = 'bg-[#1C2028]';
            if (isSelectedInOptimal) {
              cardBorder = 'border-emerald-500/50 shadow-emerald-500/10';
              cardBg = 'bg-emerald-950/30';
            } else if (isCurrentlyConsidering) {
              cardBorder = 'border-cyan-400/60 shadow-cyan-400/10';
              cardBg = 'bg-cyan-950/30';
            }

            return (
              <motion.div
                key={item.id}
                layout
                className={`clay-card p-3 rounded-clay-sm border ${cardBorder} ${cardBg} transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-txt-primary truncate">
                    {item.name}
                  </span>
                  {isSelectedInOptimal && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Picked
                    </span>
                  )}
                  {isCurrentlyConsidering && (
                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono animate-pulse">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-txt-secondary font-mono">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3 text-txt-muted" />
                    {item.weight} kg
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <DollarSign className="w-3 h-3 text-amber-400" />${item.value}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Region: 2D Dynamic Programming Table */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">
            2D Dynamic Programming Table (Rows = Items, Cols = Capacities 0..{capacity})
          </h3>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-txt-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/40 border border-purple-400" /> Active Cell
            </span>
            <span className="flex items-center gap-1 text-txt-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40 border border-cyan-400" /> Include Ref
            </span>
            <span className="flex items-center gap-1 text-txt-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400" /> Optimal Path
            </span>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="clay-inset p-3 rounded-clay-sm overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs font-mono min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10 text-txt-muted">
                <th className="p-2 text-left text-[11px] font-semibold text-txt-secondary">
                  Item / Cap (w)
                </th>
                {Array.from({ length: capacity + 1 }, (_, w) => (
                  <th
                    key={`th-cap-${w}`}
                    className={`p-2 font-mono text-[11px] ${
                      currentWeight === w ? 'text-accent-secondary font-bold' : 'text-txt-muted'
                    }`}
                  >
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((rowValues, rowIdx) => {
                const item = rowIdx > 0 ? items[rowIdx - 1] : null;
                const isRowActive = !isReconstruction && currentItemIndex === rowIdx;

                return (
                  <tr
                    key={`dp-row-${rowIdx}`}
                    className={`border-b border-white/5 transition-colors ${
                      isRowActive ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    {/* Row Header */}
                    <td className="p-2 text-left font-sans text-xs text-txt-secondary whitespace-nowrap">
                      {rowIdx === 0 ? (
                        <span className="text-txt-muted text-[11px] font-mono">i=0 (None)</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-purple-300 font-semibold">i={rowIdx}</span>
                          <span className="text-[11px] text-txt-primary truncate max-w-[120px]">
                            {item?.name}
                          </span>
                          <span className="text-[10px] text-txt-muted font-mono">
                            (w:{item?.weight}, v:{item?.value})
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Cell Values */}
                    {rowValues.map((val, colIdx) => {
                      const active = isActiveCell(rowIdx, colIdx);
                      const isTrace = isCellInTraceback(rowIdx, colIdx);
                      const isExRef = isExcludeRef(rowIdx, colIdx);
                      const isIncRef = isIncludeRef(rowIdx, colIdx);

                      let cellBg = 'bg-transparent text-txt-secondary';
                      let cellBorder = 'border border-transparent';

                      if (isTrace) {
                        cellBg = 'bg-emerald-500/25 text-emerald-200 font-bold';
                        cellBorder = 'border border-emerald-400';
                      } else if (active) {
                        cellBg = 'bg-purple-500/30 text-purple-200 font-bold shadow-sm';
                        cellBorder = 'border-2 border-accent-primary animate-pulse';
                      } else if (isIncRef) {
                        cellBg = 'bg-cyan-500/25 text-cyan-200 font-bold';
                        cellBorder = 'border border-cyan-400';
                      } else if (isExRef) {
                        cellBg = 'bg-amber-500/20 text-amber-200 font-bold';
                        cellBorder = 'border border-amber-400';
                      }

                      return (
                        <td
                          key={`cell-${rowIdx}-${colIdx}`}
                          className={`p-2 transition-all duration-150 rounded-sm ${cellBg} ${cellBorder}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
