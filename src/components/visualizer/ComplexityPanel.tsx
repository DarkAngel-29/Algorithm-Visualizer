import React from 'react';
import { Clock, HardDrive, Cpu, GitFork } from 'lucide-react';
import { MERGE_SORT_METADATA } from '../../algorithms/sorting/mergeSort';

export const ComplexityPanel: React.FC = () => {
  const { timeComplexity, spaceComplexity, paradigm } = MERGE_SORT_METADATA;

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
          <div className="text-[10px] text-txt-muted mt-0.5">Always divides all log n levels</div>
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
          <div className="text-[10px] text-txt-muted mt-0.5">Consistent divide & conquer</div>
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
          <div className="text-[10px] text-txt-muted mt-0.5">Independent of initial array order</div>
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
          <div className="text-[10px] text-txt-muted mt-0.5">Temporary buffers for merging</div>
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="text-xs text-txt-secondary leading-relaxed bg-[#161920] p-3 rounded-clay-sm border border-white/5 flex items-start gap-2.5">
        <GitFork className="w-4 h-4 text-accent-secondary shrink-0 mt-0.5" />
        <p>
          <strong className="text-txt-primary">{paradigm}:</strong> The algorithm divides the
          problem into independent subproblems of size <span className="font-mono text-purple-300">n / 2</span>{' '}
          (depth: <span className="font-mono text-cyan-300">⌈log₂ n⌉</span>), and at each level performs a linear{' '}
          <span className="font-mono text-emerald-300">O(n)</span> merge of the sorted subarrays. This guarantees{' '}
          <span className="font-mono text-amber-300">O(n log n)</span> time complexity in all cases.
        </p>
      </div>
    </div>
  );
};
