import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import type { MatrixStep } from '../../../engine/types';

interface MatrixVisualizerProps {
  step: MatrixStep;
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ step }) => {
  const {
    matrixA,
    matrixB,
    matrixC,
    activeRowA,
    activeColB,
    activeResultCell,
    currentPairIndex,
    expressionString,
    pairMultiplication,
  } = step;

  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Side-by-side Matrix Formulation Layout */}
      <div className="flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8 overflow-x-auto py-4">
        {/* Matrix A */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono font-semibold text-purple-300 mb-2">
            Matrix A ({rowsA}×{colsA})
          </div>
          <div className="relative p-2 rounded-clay-sm bg-[#161920] border-l-4 border-r-4 border-purple-500/40 shadow-clay-card">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${colsA}, minmax(44px, 52px))`,
                gridTemplateRows: `repeat(${rowsA}, 44px)`,
              }}
            >
              {matrixA.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isRowActive = activeRowA === rIdx;
                  const isPairActive = isRowActive && currentPairIndex === cIdx;

                  let cellStyle = 'bg-[#20242D] text-txt-secondary border-white/5';
                  if (isPairActive) {
                    cellStyle = 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md';
                  } else if (isRowActive) {
                    cellStyle = 'bg-purple-600/25 text-purple-200 border-purple-400/60 font-semibold';
                  }

                  return (
                    <motion.div
                      key={`a-${rIdx}-${cIdx}`}
                      layout
                      className={`flex items-center justify-center rounded-lg border text-sm font-mono transition-all duration-150 ${cellStyle}`}
                    >
                      {val}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Multiplication Symbol */}
        <div className="text-xl font-bold text-txt-muted select-none">✕</div>

        {/* Matrix B */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono font-semibold text-cyan-300 mb-2">
            Matrix B ({rowsB}×{colsB})
          </div>
          <div className="relative p-2 rounded-clay-sm bg-[#161920] border-l-4 border-r-4 border-cyan-500/40 shadow-clay-card">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${colsB}, minmax(44px, 52px))`,
                gridTemplateRows: `repeat(${rowsB}, 44px)`,
              }}
            >
              {matrixB.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isColActive = activeColB === cIdx;
                  const isPairActive = isColActive && currentPairIndex === rIdx;

                  let cellStyle = 'bg-[#20242D] text-txt-secondary border-white/5';
                  if (isPairActive) {
                    cellStyle = 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-md';
                  } else if (isColActive) {
                    cellStyle = 'bg-cyan-600/25 text-cyan-200 border-cyan-400/60 font-semibold';
                  }

                  return (
                    <motion.div
                      key={`b-${rIdx}-${cIdx}`}
                      layout
                      className={`flex items-center justify-center rounded-lg border text-sm font-mono transition-all duration-150 ${cellStyle}`}
                    >
                      {val}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Equals Symbol */}
        <div className="text-xl font-bold text-txt-muted select-none">=</div>

        {/* Result Matrix C */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono font-semibold text-emerald-300 mb-2">
            Result Matrix C ({rowsA}×{colsB})
          </div>
          <div className="relative p-2 rounded-clay-sm bg-[#161920] border-l-4 border-r-4 border-emerald-500/40 shadow-clay-card">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${colsB}, minmax(48px, 56px))`,
                gridTemplateRows: `repeat(${rowsA}, 44px)`,
              }}
            >
              {matrixC.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isTargetCell =
                    activeResultCell && activeResultCell[0] === rIdx && activeResultCell[1] === cIdx;
                  const isFilled = val !== null;

                  let cellStyle = 'bg-[#181B22] text-txt-muted border-white/5';
                  if (isTargetCell) {
                    cellStyle = 'bg-accent-primary/25 text-accent-primary border-accent-primary font-bold shadow-md animate-pulse';
                  } else if (isFilled) {
                    cellStyle = 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40 font-semibold';
                  }

                  return (
                    <motion.div
                      key={`c-${rIdx}-${cIdx}`}
                      layout
                      className={`flex items-center justify-center rounded-lg border text-sm font-mono transition-all duration-150 ${cellStyle}`}
                    >
                      {val !== null ? val : '·'}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Vector Dot-Product Expression Box */}
      <div className="mt-4 p-4 rounded-clay-sm bg-[#161920] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-accent-secondary shrink-0" />
          <span className="font-semibold text-txt-primary">Dot Product Accumulator:</span>
        </div>

        <div className="font-mono text-sm text-cyan-300 font-semibold tracking-wide truncate max-w-xl">
          {expressionString || 'Ready to compute dot products...'}
        </div>

        {pairMultiplication && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
            <span>
              {pairMultiplication.valA} × {pairMultiplication.valB} = {pairMultiplication.product}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
