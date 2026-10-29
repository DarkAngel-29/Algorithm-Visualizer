import React from 'react';
import { Terminal, ArrowRightCircle } from 'lucide-react';
import type { BaseAlgorithmStep } from '../../engine/types';

interface StepExplanationProps {
  step: BaseAlgorithmStep & {
    depth?: number;
    writeIndex?: number;
    writeValue?: number;
    comparedIndices?: [number, number];
  };
}

export const StepExplanation: React.FC<StepExplanationProps> = ({ step }) => {
  const getOperationBadge = (op: string) => {
    switch (op) {
      case 'SPLIT':
        return { label: 'DIVIDE', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'BASE_CASE':
        return { label: 'BASE CASE', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'PREPARE_MERGE':
        return { label: 'CONQUER', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'COMPARE':
      case 'TRY_CANDIDATE':
      case 'PAIR_PRODUCT':
      case 'CHAR_MATCH':
        return { label: 'COMPARE', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'CONFLICT_DETECTED':
      case 'CYCLE_DETECTED':
        return { label: 'CONFLICT', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'WRITE':
      case 'WRITE_REMAINING':
      case 'PLACE_QUEEN':
      case 'INCLUDE_ITEM':
      case 'STORE_RESULT':
      case 'AUGMENT_FLOW':
      case 'RELAX_EDGE':
        return { label: 'STATE UPDATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'REMOVE_QUEEN':
      case 'LPS_FALLBACK':
      case 'KMP_FALLBACK':
        return { label: 'BACKTRACK / FALLBACK', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      case 'SEGMENT_SORTED':
      case 'SOLUTION_FOUND':
      case 'OPTIMAL_SOLUTION_FOUND':
      case 'PATTERN_OCCURRENCE_FOUND':
      case 'MAX_FLOW_REACHED':
      case 'COMPLETE':
        return { label: 'SUCCESS', color: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40' };
      case 'INITIAL':
      default:
        return { label: op.replace(/_/g, ' '), color: 'bg-white/10 text-txt-secondary border-white/10' };
    }
  };

  const badge = getOperationBadge(step.operation);

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent-secondary" />
          <h3 className="text-sm font-semibold text-txt-primary">Live Step Explanation</h3>
        </div>
        <div className="flex items-center gap-2">
          {step.depth !== undefined && (
            <span className="text-[10px] font-mono text-txt-muted">
              Recursion Depth: <strong className="text-txt-primary">{step.depth}</strong>
            </span>
          )}
          <span
            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${badge.color} font-semibold`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <ArrowRightCircle className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm text-txt-primary font-medium leading-relaxed">
            {step.explanation}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-txt-muted">
            {step.writeIndex !== undefined && (
              <span className="font-mono">
                Target Index: <span className="text-amber-300">{step.writeIndex}</span>
              </span>
            )}
            {step.writeValue !== undefined && (
              <span className="font-mono">
                Value Written: <span className="text-amber-300">{step.writeValue}</span>
              </span>
            )}
            {step.comparedIndices && (
              <span className="font-mono">
                Comparing Indices:{' '}
                <span className="text-cyan-300">
                  [{step.comparedIndices[0]}, {step.comparedIndices[1]}]
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
