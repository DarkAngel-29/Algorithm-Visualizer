import React from 'react';
import { Calculator } from 'lucide-react';
import type { MatrixChainStep } from '../../../engine/types';

interface MatrixChainVisualizerProps {
  step: MatrixChainStep;
}

export const MatrixChainVisualizer: React.FC<MatrixChainVisualizerProps> = ({ step }) => {
  const {
    dimensions,
    matrixCount,
    mTable,
    sTable,
    chainLength,
    subproblemI,
    subproblemJ,
    candidateK,
    leftCost,
    rightCost,
    combineCost,
    candidateCost,
    currentBestCost,
    bestSplitSoFar,
    isNewBestFound,
    optimalParenthesization,
  } = step;

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Matrix Sequence Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-txt-primary">
              Matrix Chain Sequence ({matrixCount} Matrices)
            </span>
          </div>
          <span className="text-[11px] font-mono text-txt-muted">
            Dimensions: [{dimensions.join(', ')}]
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: matrixCount }, (_, idx) => {
            const matrixIdx = idx + 1;
            const rows = dimensions[idx];
            const cols = dimensions[idx + 1];

            const inCurrentSubproblem =
              matrixIdx >= subproblemI && matrixIdx <= subproblemJ;
            const inLeftSubchain =
              candidateK !== undefined && matrixIdx >= subproblemI && matrixIdx <= candidateK;
            const inRightSubchain =
              candidateK !== undefined && matrixIdx > candidateK && matrixIdx <= subproblemJ;

            let cardBorder = 'border-white/5';
            let cardBg = 'bg-[#1C2028]';

            if (inLeftSubchain) {
              cardBorder = 'border-purple-400 shadow-purple-500/10';
              cardBg = 'bg-purple-950/40 text-purple-200';
            } else if (inRightSubchain) {
              cardBorder = 'border-cyan-400 shadow-cyan-500/10';
              cardBg = 'bg-cyan-950/40 text-cyan-200';
            } else if (inCurrentSubproblem) {
              cardBorder = 'border-amber-400/50';
              cardBg = 'bg-[#252834]';
            }

            return (
              <div
                key={`matrix-card-${matrixIdx}`}
                className={`clay-card px-3 py-2 rounded-clay-sm border ${cardBorder} ${cardBg} transition-all duration-200 flex flex-col items-center min-w-[70px]`}
              >
                <span className="font-bold text-xs text-txt-primary">A{matrixIdx}</span>
                <span className="font-mono text-[11px] text-txt-muted mt-0.5">
                  {rows} × {cols}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Split Evaluation Panel */}
      {candidateK !== undefined && (
        <div className="mb-6 p-4 rounded-clay-sm bg-[#161920] border border-white/5 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
            <span className="text-txt-primary font-semibold flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-accent-secondary" />
              Candidate Split Evaluation (k = {candidateK})
            </span>
            <span className="text-txt-muted">
              Subproblem: A{subproblemI}..A{subproblemJ} (Length {chainLength})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="clay-card p-2.5 rounded-clay-sm border border-purple-500/30 bg-purple-950/20">
              <div className="text-[10px] text-purple-300">Left Chain: m[{subproblemI}][{candidateK}]</div>
              <div className="text-sm font-bold text-purple-200 mt-1">{leftCost}</div>
              <div className="text-[9px] text-txt-muted">(A{subproblemI}..A{candidateK})</div>
            </div>

            <div className="clay-card p-2.5 rounded-clay-sm border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-[10px] text-cyan-300">Right Chain: m[{candidateK + 1}][{subproblemJ}]</div>
              <div className="text-sm font-bold text-cyan-200 mt-1">{rightCost}</div>
              <div className="text-[9px] text-txt-muted">(A{candidateK + 1}..A{subproblemJ})</div>
            </div>

            <div className="clay-card p-2.5 rounded-clay-sm border border-amber-500/30 bg-amber-950/20">
              <div className="text-[10px] text-amber-300">
                Multiply: p[{subproblemI - 1}]·p[{candidateK}]·p[{subproblemJ}]
              </div>
              <div className="text-sm font-bold text-amber-200 mt-1">{combineCost}</div>
              <div className="text-[9px] text-txt-muted">
                {dimensions[subproblemI - 1]} × {dimensions[candidateK]} × {dimensions[subproblemJ]}
              </div>
            </div>

            <div
              className={`clay-card p-2.5 rounded-clay-sm border ${
                isNewBestFound
                  ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400/50'
                  : 'border-emerald-500/30 bg-emerald-950/20'
              }`}
            >
              <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                <span>Total Candidate Cost</span>
                {isNewBestFound && (
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 rounded">
                    NEW BEST
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-emerald-200 mt-1">{candidateCost}</div>
              <div className="text-[9px] text-txt-muted">
                Best Split: {bestSplitSoFar !== undefined ? `k=${bestSplitSoFar}` : '—'} (Cost: {currentBestCost !== undefined ? currentBestCost : '—'})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side: Cost Table m[i][j] and Split Table s[i][j] */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Table m[i][j] */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">
              DP Cost Matrix m[i][j] (Min Multiplications)
            </h4>
          </div>

          <div className="clay-inset p-3 rounded-clay-sm overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-txt-muted">
                  <th className="p-1.5 text-txt-secondary text-[11px]">i \ j</th>
                  {Array.from({ length: matrixCount }, (_, c) => (
                    <th key={`th-col-${c + 1}`} className="p-1.5 text-[11px]">
                      {c + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: matrixCount }, (_, r) => {
                  const rowIdx = r + 1;
                  return (
                    <tr key={`tr-m-${rowIdx}`} className="border-b border-white/5">
                      <td className="p-1.5 font-bold text-txt-muted">{rowIdx}</td>
                      {Array.from({ length: matrixCount }, (_, c) => {
                        const colIdx = c + 1;
                        if (colIdx < rowIdx) {
                          return (
                            <td key={`m-empty-${rowIdx}-${colIdx}`} className="p-1.5 text-txt-muted/20 select-none">
                              —
                            </td>
                          );
                        }

                        const val = mTable[rowIdx][colIdx];
                        const isActiveCell = subproblemI === rowIdx && subproblemJ === colIdx;
                        const isLeftRef =
                          candidateK !== undefined && subproblemI === rowIdx && candidateK === colIdx;
                        const isRightRef =
                          candidateK !== undefined && candidateK + 1 === rowIdx && subproblemJ === colIdx;

                        let cellClass = 'bg-[#1C2028] text-txt-secondary';
                        if (isActiveCell) {
                          cellClass = 'bg-accent-primary/30 text-accent-primary font-bold border border-accent-primary shadow-sm animate-pulse';
                        } else if (isLeftRef) {
                          cellClass = 'bg-purple-950/50 text-purple-200 font-semibold border border-purple-500/40';
                        } else if (isRightRef) {
                          cellClass = 'bg-cyan-950/50 text-cyan-200 font-semibold border border-cyan-500/40';
                        }

                        return (
                          <td
                            key={`m-cell-${rowIdx}-${colIdx}`}
                            className={`p-1.5 rounded-sm transition-all duration-150 ${cellClass}`}
                          >
                            {val !== null ? val : '·'}
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

        {/* Split Table s[i][j] */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">
              Optimal Split Matrix s[i][j] (Best k)
            </h4>
          </div>

          <div className="clay-inset p-3 rounded-clay-sm overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-txt-muted">
                  <th className="p-1.5 text-txt-secondary text-[11px]">i \ j</th>
                  {Array.from({ length: matrixCount }, (_, c) => (
                    <th key={`th-scol-${c + 1}`} className="p-1.5 text-[11px]">
                      {c + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: matrixCount }, (_, r) => {
                  const rowIdx = r + 1;
                  return (
                    <tr key={`tr-s-${rowIdx}`} className="border-b border-white/5">
                      <td className="p-1.5 font-bold text-txt-muted">{rowIdx}</td>
                      {Array.from({ length: matrixCount }, (_, c) => {
                        const colIdx = c + 1;
                        if (colIdx <= rowIdx) {
                          return (
                            <td key={`s-empty-${rowIdx}-${colIdx}`} className="p-1.5 text-txt-muted/20 select-none">
                              —
                            </td>
                          );
                        }

                        const val = sTable[rowIdx][colIdx];
                        const isActive = subproblemI === rowIdx && subproblemJ === colIdx;

                        return (
                          <td
                            key={`s-cell-${rowIdx}-${colIdx}`}
                            className={`p-1.5 rounded-sm transition-all duration-150 ${
                              isActive
                                ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400'
                                : val !== null
                                ? 'bg-[#20242D] text-emerald-300 font-semibold'
                                : 'bg-[#1C2028] text-txt-muted'
                            }`}
                          >
                            {val !== null ? `k=${val}` : '·'}
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

      {/* Prominent Optimal Parenthesization Display */}
      {optimalParenthesization && (
        <div className="mt-6 p-4 rounded-clay-sm bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
              Optimal Parenthesization Order
            </span>
            <span className="font-mono text-base text-emerald-200 font-bold tracking-wide mt-1 block">
              {optimalParenthesization}
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-txt-muted uppercase tracking-wider block">
              Minimum Multiplications
            </span>
            <span className="font-mono text-base text-accent-secondary font-bold">
              {mTable[1][matrixCount]} scalar ops
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
