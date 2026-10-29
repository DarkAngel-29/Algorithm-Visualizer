import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlgorithmStep, BarState } from '../../engine/types';
import { Legend } from './Legend';

interface ArrayVisualizerProps {
  step: AlgorithmStep;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ step }) => {
  const array = step.array;

  // Determine min and max values for scaling
  const { minVal, maxVal, hasNegatives } = useMemo(() => {
    if (array.length === 0) return { minVal: 0, maxVal: 100, hasNegatives: false };
    let min = array[0];
    let max = array[0];
    for (const num of array) {
      if (num < min) min = num;
      if (num > max) max = num;
    }
    return {
      minVal: min,
      maxVal: max,
      hasNegatives: min < 0,
    };
  }, [array]);

  // Determine state of each bar
  const getBarState = (idx: number): BarState => {
    if (step.phase === 'complete') {
      return 'fully_sorted';
    }

    if (step.writeIndex === idx) {
      return 'writing';
    }

    if (
      step.comparedIndices &&
      (step.comparedIndices[0] === idx || step.comparedIndices[1] === idx)
    ) {
      return 'comparing';
    }

    // Check if element belongs to a finalized sorted segment
    if (step.sortedRanges) {
      const inSortedRange = step.sortedRanges.some(([s, e]) => idx >= s && idx <= e);
      if (inSortedRange && step.phase === 'merge_segment_complete') {
        return 'sorted_segment';
      }
    }

    if (
      step.leftSubarray &&
      idx >= step.leftSubarray[0] &&
      idx <= step.leftSubarray[1]
    ) {
      return 'left_subarray';
    }

    if (
      step.rightSubarray &&
      idx >= step.rightSubarray[0] &&
      idx <= step.rightSubarray[1]
    ) {
      return 'right_subarray';
    }

    // Check if previously sorted
    if (step.sortedRanges) {
      const inSortedRange = step.sortedRanges.some(([s, e]) => idx >= s && idx <= e);
      if (inSortedRange) {
        return 'sorted_segment';
      }
    }

    return 'default';
  };

  // Color classes and styles according to dark claymorphism palette
  const getBarStyles = (state: BarState) => {
    switch (state) {
      case 'comparing':
        return {
          bg: 'bg-cyan-400',
          textColor: 'text-slate-950 font-bold',
          border: 'border-cyan-200',
          shadow: '0 0 16px rgba(103, 232, 249, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        };
      case 'writing':
        return {
          bg: 'bg-amber-400',
          textColor: 'text-slate-950 font-bold',
          border: 'border-amber-200',
          shadow: '0 0 16px rgba(251, 191, 36, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        };
      case 'left_subarray':
        return {
          bg: 'bg-indigo-500',
          textColor: 'text-white font-medium',
          border: 'border-indigo-400',
          shadow: '0 4px 12px rgba(99, 102, 241, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        };
      case 'right_subarray':
        return {
          bg: 'bg-sky-500',
          textColor: 'text-white font-medium',
          border: 'border-sky-400',
          shadow: '0 4px 12px rgba(14, 165, 233, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        };
      case 'sorted_segment':
        return {
          bg: 'bg-emerald-500',
          textColor: 'text-slate-950 font-semibold',
          border: 'border-emerald-300',
          shadow: '0 4px 12px rgba(16, 185, 129, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        };
      case 'fully_sorted':
        return {
          bg: 'bg-emerald-400',
          textColor: 'text-slate-950 font-bold',
          border: 'border-emerald-200',
          shadow: '0 0 18px rgba(74, 222, 128, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        };
      case 'default':
      default:
        return {
          bg: 'bg-[#2E3442]',
          textColor: 'text-slate-200',
          border: 'border-white/10',
          shadow: '4px 4px 10px rgba(0, 0, 0, 0.4), inset 1px 1px 1px rgba(255, 255, 255, 0.08)',
        };
    }
  };

  const containerHeight = 280; // pixels for bar chart area

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Visual Subarray Range Indicator */}
      <div className="min-h-[28px] mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-txt-muted text-[11px] uppercase tracking-wider">
            Range:
          </span>
          {step.activeRange ? (
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-txt-primary">
              [{step.activeRange[0]} ... {step.activeRange[1]}]
            </span>
          ) : (
            <span className="text-txt-muted italic text-[11px]">Inactive</span>
          )}

          {step.mid !== undefined && (
            <span className="text-txt-muted font-mono text-[11px]">
              Mid: <strong className="text-accent-secondary">{step.mid}</strong>
            </span>
          )}
        </div>

        {/* Phase Badge */}
        <div className="flex items-center gap-2">
          {step.leftSubarray && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Left [{step.leftSubarray[0]}..{step.leftSubarray[1]}]
            </span>
          )}
          {step.rightSubarray && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Right [{step.rightSubarray[0]}..{step.rightSubarray[1]}]
            </span>
          )}
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div
        className="clay-inset p-4 sm:p-6 relative flex items-end justify-center gap-1 sm:gap-2.5 overflow-x-auto min-h-[300px]"
        style={{ height: `${containerHeight + 60}px` }}
      >
        {/* Zero baseline when negative values exist */}
        {hasNegatives && (
          <div
            className="absolute left-4 right-4 border-b border-dashed border-white/20 z-0 pointer-events-none"
            style={{
              bottom: `${Math.max(
                30,
                ((0 - minVal) / (maxVal - minVal || 1)) * containerHeight + 30
              )}px`,
            }}
          >
            <span className="absolute -left-2 -top-2.5 text-[9px] font-mono text-txt-muted bg-[#161920] px-1">
              0
            </span>
          </div>
        )}

        {/* Render Bars */}
        <AnimatePresence mode="popLayout">
          {array.map((value, idx) => {
            const barState = getBarState(idx);
            const style = getBarStyles(barState);

            // Calculate height in pixels
            let heightPx: number;
            const minBarPx = 28;

            if (hasNegatives) {
              const range = Math.max(1, maxVal - minVal);
              const absRatio = Math.abs(value) / range;
              heightPx = Math.max(minBarPx, absRatio * containerHeight);
            } else {
              const max = Math.max(1, maxVal);
              const ratio = value / max;
              heightPx = Math.max(minBarPx, ratio * (containerHeight - 20));
            }



            return (
              <div
                key={`bar-col-${idx}`}
                className="flex flex-col items-center flex-1 max-w-[56px] min-w-[20px] h-full justify-end z-10"
              >
                {/* Active marker pin */}
                <div className="h-4 flex items-center justify-center mb-1">
                  {step.writeIndex === idx && (
                    <motion.div
                      initial={{ scale: 0, y: -5 }}
                      animate={{ scale: 1, y: 0 }}
                      className="text-amber-400 text-xs font-bold"
                    >
                      ▼
                    </motion.div>
                  )}
                  {step.comparedIndices &&
                    (step.comparedIndices[0] === idx || step.comparedIndices[1] === idx) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-cyan-400 text-xs font-bold"
                      >
                        ●
                      </motion.div>
                    )}
                </div>

                {/* Vertical Bar */}
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: `${heightPx}px`,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className={`w-full rounded-t-lg ${style.bg} border ${style.border} flex flex-col items-center justify-between py-1.5 transition-colors duration-200 cursor-default select-none relative group`}
                  style={{
                    boxShadow: style.shadow,
                  }}
                >
                  {/* Numerical Value Label */}
                  <span
                    className={`font-mono text-[10px] sm:text-xs leading-none ${style.textColor} truncate px-0.5`}
                    title={`Value: ${value} (Index: ${idx})`}
                  >
                    {value}
                  </span>

                  {/* Visual texture highlight */}
                  <div className="w-2/3 h-1 rounded-full bg-white/20 mt-auto" />
                </motion.div>

                {/* Index Label Underneath */}
                <div className="mt-2 text-center">
                  <span className="font-mono text-[10px] sm:text-[11px] text-txt-muted block">
                    {idx}
                  </span>
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* State Legend */}
      <Legend />
    </div>
  );
};
