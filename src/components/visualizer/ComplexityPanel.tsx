import React from 'react';
import { Clock, HardDrive, Cpu, GitFork } from 'lucide-react';
import { MERGE_SORT_METADATA } from '../../algorithms/sorting/mergeSort';
import type { AlgorithmMetadata } from '../../engine/types';

interface ComplexityPanelProps {
  metadata?: AlgorithmMetadata;
  customNote?: string;
}

export const ComplexityPanel: React.FC<ComplexityPanelProps> = ({
  metadata = MERGE_SORT_METADATA,
  customNote,
}) => {
  const { timeComplexity, spaceComplexity, paradigm, description } = metadata;

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4">
        <Cpu className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-txt-primary">Complexity & Algorithm Analysis</h3>
      </div>

      {/* Grid of complexity cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Best Case */}
        <div className="clay-card p-3 rounded-clay-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-txt-muted text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Best Case</span>
          </div>
          <div className="text-base font-mono font-bold text-emerald-300">
            {timeComplexity.best}
          </div>
          <div className="text-[10px] text-txt-muted mt-0.5">Optimal execution scenario</div>
        </div>

        {/* Average Case */}
        <div className="clay-card p-3 rounded-clay-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-txt-muted text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Average Case</span>
          </div>
          <div className="text-base font-mono font-bold text-cyan-300">
            {timeComplexity.average}
          </div>
          <div className="text-[10px] text-txt-muted mt-0.5">Expected runtime complexity</div>
        </div>

        {/* Worst Case */}
        <div className="clay-card p-3 rounded-clay-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-txt-muted text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Worst Case</span>
          </div>
          <div className="text-base font-mono font-bold text-amber-300">
            {timeComplexity.worst}
          </div>
          <div className="text-[10px] text-txt-muted mt-0.5">Upper asymptotic bound</div>
        </div>

        {/* Space Complexity */}
        <div className="clay-card p-3 rounded-clay-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-txt-muted text-xs mb-1">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span>Auxiliary Space</span>
          </div>
          <div className="text-base font-mono font-bold text-purple-300">
            {spaceComplexity}
          </div>
          <div className="text-[10px] text-txt-muted mt-0.5">Memory consumed during execution</div>
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="text-xs text-txt-secondary leading-relaxed bg-[#161920] p-3 rounded-clay-sm border border-white/5 flex items-start gap-2.5">
        <GitFork className="w-4 h-4 text-accent-secondary shrink-0 mt-0.5" />
        <p>
          <strong className="text-txt-primary">{paradigm}:</strong>{' '}
          {customNote || description}
        </p>
      </div>
    </div>
  );
};
