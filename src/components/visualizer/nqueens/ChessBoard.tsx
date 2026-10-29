import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChessQueen } from './ChessQueen';
import type { NQueensStep, QueenPosition } from '../../../engine/types';

interface ChessBoardProps {
  step: NQueensStep;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ step }) => {
  const { boardSize, queens, currentRow, candidateCol, status, conflict } = step;

  // Board square calculation
  const squares = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      squares.push({ row: r, col: c });
    }
  }

  // Quick lookup for placed queens
  const isQueenPlacedAt = (r: number, c: number): boolean => {
    return queens.some((q) => q.row === r && q.col === c);
  };

  const isThreatQueen = (r: number, c: number): boolean => {
    return !!conflict && conflict.to.row === r && conflict.to.col === c;
  };

  const isCandidateSquare = (r: number, c: number): boolean => {
    return r === currentRow && c === candidateCol;
  };

  // Convert row, col to percentage coordinates for SVG attack line overlay
  const getCenterCoord = (pos: QueenPosition) => {
    const stepPercent = 100 / boardSize;
    return {
      x: (pos.col + 0.5) * stepPercent,
      y: (pos.row + 0.5) * stepPercent,
    };
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Outer Claymorphic Chessboard Frame */}
      <div className="clay-surface-elevated p-3 sm:p-6 rounded-clay-lg relative max-w-[540px] w-full aspect-square flex flex-col items-center justify-center">
        {/* Board Surface */}
        <div
          className="w-full h-full relative grid rounded-xl overflow-hidden border-2 border-white/10 shadow-clay-inset"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          }}
        >
          {/* Tiles */}
          {squares.map(({ row, col }) => {
            const isDark = (row + col) % 2 === 1;
            const isCurrentRow = row === currentRow && status !== 'complete';
            const isCandidate = isCandidateSquare(row, col);
            const isConflictedCandidate = isCandidate && status === 'conflict';
            const isSafeCandidate = isCandidate && status === 'safe';
            const isThreat = isThreatQueen(row, col);
            const isPlaced = isQueenPlacedAt(row, col);

            // Tile styling
            let tileBg = isDark ? 'bg-[#1C2028]' : 'bg-[#2A313E]';
            if (isCurrentRow && !isCandidate) {
              tileBg = isDark ? 'bg-[#242436]' : 'bg-[#31334E]';
            }
            if (isConflictedCandidate) {
              tileBg = 'bg-red-950/70';
            } else if (isSafeCandidate) {
              tileBg = 'bg-emerald-950/60';
            } else if (isThreat) {
              tileBg = 'bg-amber-950/60';
            } else if (step.status === 'solution_found' && isPlaced) {
              tileBg = isDark ? 'bg-emerald-900/30' : 'bg-emerald-800/40';
            }

            return (
              <div
                key={`sq-${row}-${col}`}
                className={`relative flex items-center justify-center select-none transition-colors duration-200 ${tileBg} border-[0.5px] border-black/10`}
              >
                {/* Board Coordinate Labels (edges only) */}
                {col === 0 && (
                  <span className="absolute left-1 top-0.5 text-[9px] font-mono text-txt-muted/50 select-none">
                    {boardSize - row}
                  </span>
                )}
                {row === boardSize - 1 && (
                  <span className="absolute right-1 bottom-0.5 text-[9px] font-mono text-txt-muted/50 select-none">
                    {String.fromCharCode(65 + col)}
                  </span>
                )}

                {/* Placed Queens */}
                <AnimatePresence mode="popLayout">
                  {isPlaced && (
                    <motion.div
                      key={`queen-${row}-${col}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className="w-full h-full flex items-center justify-center p-1 z-10"
                    >
                      <ChessQueen
                        variant={
                          step.status === 'solution_found' || step.status === 'complete'
                            ? 'solution'
                            : isThreat
                            ? 'threat'
                            : 'placed'
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Candidate Testing Queen (not yet confirmed) */}
                <AnimatePresence>
                  {isCandidate && !isPlaced && (
                    <motion.div
                      key={`candidate-${row}-${col}`}
                      initial={{ scale: 0.3, opacity: 0, y: -8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-full h-full flex items-center justify-center p-1 z-20"
                    >
                      <ChessQueen
                        variant={status === 'conflict' ? 'conflicted' : 'candidate'}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Conflict X Overlay Badge */}
                {isConflictedCandidate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center text-[11px] font-bold shadow-lg">
                      ✕
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Conflict Vector Lines Overlay */}
          {conflict && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="conflict-arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
                </marker>
              </defs>
              {(() => {
                const cFrom = getCenterCoord(conflict.from);
                const cTo = getCenterCoord(conflict.to);
                return (
                  <g>
                    {/* Pulsing Backlight */}
                    <line
                      x1={`${cTo.x}%`}
                      y1={`${cTo.y}%`}
                      x2={`${cFrom.x}%`}
                      y2={`${cFrom.y}%`}
                      stroke="rgba(239, 68, 68, 0.4)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Laser Attack Ray */}
                    <line
                      x1={`${cTo.x}%`}
                      y1={`${cTo.y}%`}
                      x2={`${cFrom.x}%`}
                      y2={`${cFrom.y}%`}
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
