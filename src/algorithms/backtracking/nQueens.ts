import type {
  AlgorithmMetadata,
  NQueensStep,
  QueenPosition,
  QueenConflict,
} from '../../engine/types';

export const N_QUEENS_METADATA: AlgorithmMetadata = {
  id: 'n-queens',
  name: 'N-Queens Problem',
  category: 'backtracking',
  paradigm: 'Backtracking',
  timeComplexity: {
    best: 'O(N!)',
    average: 'O(N!)',
    worst: 'O(N!)',
  },
  spaceComplexity: 'O(N)',
  description:
    'The N-Queens puzzle places N chess queens on an N×N chessboard so that no two queens threaten each other. The backtracking algorithm places queens row-by-row, testing candidates and unwinding dead ends immediately upon conflict.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm solveNQueens(board, row, N):', indent: 0 },
      { lineNumber: 2, code: 'if row = N then', indent: 1 },
      { lineNumber: 3, code: '  recordSolution(board)  // All N queens placed safely', indent: 2 },
      { lineNumber: 4, code: '  return', indent: 2 },
      { lineNumber: 5, code: 'for col ← 0 to N - 1 do', indent: 1 },
      { lineNumber: 6, code: '  if isSafe(board, row, col) then', indent: 2 },
      { lineNumber: 7, code: '    board[row] ← col  // Place queen', indent: 3 },
      { lineNumber: 8, code: '    solveNQueens(board, row + 1, N)', indent: 3 },
      { lineNumber: 9, code: '    board[row] ← empty // Backtrack', indent: 3 },
      { lineNumber: 10, code: 'return // Dead end in current branch', indent: 1 },
    ],
  },
};

export interface NQueensGeneratorResult {
  steps: NQueensStep[];
  solutions: QueenPosition[][];
  totalAttempts: number;
  totalBacktracks: number;
}

export function generateNQueensSteps(
  boardSize: number = 8,
  mode: 'first' | 'all' = 'first',
  searchStrategy: 'ltr' | 'rtl' | 'middle_out' = 'ltr',
  maxSteps: number = 3000
): NQueensGeneratorResult {
  const steps: NQueensStep[] = [];
  const placedQueens: QueenPosition[] = [];
  const foundSolutions: QueenPosition[][] = [];

  let stepCounter = 0;
  let attemptsCount = 0;
  let backtrackCount = 0;
  let solutionsCount = 0;
  let searchAbortedDueToLimit = false;

  const getColumnOrder = (n: number, strat: 'ltr' | 'rtl' | 'middle_out'): number[] => {
    if (strat === 'rtl') {
      return Array.from({ length: n }, (_, i) => n - 1 - i);
    }
    if (strat === 'middle_out') {
      const cols: number[] = [];
      const mid = Math.floor(n / 2);
      cols.push(mid);
      for (let offset = 1; offset <= n; offset++) {
        if (mid - offset >= 0) cols.push(mid - offset);
        if (mid + offset < n) cols.push(mid + offset);
      }
      return cols;
    }
    return Array.from({ length: n }, (_, i) => i);
  };

  const colOrder = getColumnOrder(boardSize, searchStrategy);

  // Initial Step: Empty Board
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Starting N-Queens search on a ${boardSize}×${boardSize} chessboard with ${
      mode === 'first' ? 'First Solution' : 'All Solutions'
    } mode.`,
    codeLine: 1,
    boardSize,
    queens: [],
    currentRow: 0,
    candidateCol: null,
    status: 'searching',
    attemptsCount: 0,
    backtrackCount: 0,
    solutionsCount: 0,
  });

  function checkSafety(
    row: number,
    col: number
  ): { isSafe: boolean; conflict?: QueenConflict } {
    for (const q of placedQueens) {
      // Column check
      if (q.col === col) {
        return {
          isSafe: false,
          conflict: {
            from: { row, col },
            to: { ...q },
            reason: 'column',
          },
        };
      }

      // Diagonal check (slope = 1)
      if (q.row - q.col === row - col) {
        return {
          isSafe: false,
          conflict: {
            from: { row, col },
            to: { ...q },
            reason: 'diagonal',
          },
        };
      }

      // Anti-diagonal check (slope = -1)
      if (q.row + q.col === row + col) {
        return {
          isSafe: false,
          conflict: {
            from: { row, col },
            to: { ...q },
            reason: 'anti-diagonal',
          },
        };
      }
    }

    return { isSafe: true };
  }

  function backtrack(row: number) {
    if (stepCounter >= maxSteps) {
      searchAbortedDueToLimit = true;
      return;
    }

    // Base Case: All rows successfully assigned
    if (row === boardSize) {
      solutionsCount++;
      const currentSol = placedQueens.map((q) => ({ ...q }));
      foundSolutions.push(currentSol);

      steps.push({
        stepIndex: stepCounter++,
        phase: 'solution_found',
        operation: 'SOLUTION_FOUND',
        explanation: `Solution #${solutionsCount} found! All ${boardSize} queens are in safe non-attacking positions.`,
        codeLine: 3,
        boardSize,
        queens: [...placedQueens],
        currentRow: row,
        candidateCol: null,
        status: 'solution_found',
        attemptsCount,
        backtrackCount,
        solutionsCount,
        allSolutions: [...foundSolutions],
      });

      return;
    }

    for (const col of colOrder) {
      if (stepCounter >= maxSteps) {
        searchAbortedDueToLimit = true;
        return;
      }

      if (mode === 'first' && foundSolutions.length >= 1) {
        return;
      }

      attemptsCount++;

      // Candidate Testing Step
      steps.push({
        stepIndex: stepCounter++,
        phase: 'trying',
        operation: 'TRY_CANDIDATE',
        explanation: `Row ${row + 1}: Attempting to place Queen at column ${String.fromCharCode(
          65 + col
        )}${boardSize - row}.`,
        codeLine: 5,
        boardSize,
        queens: [...placedQueens],
        currentRow: row,
        candidateCol: col,
        status: 'placing',
        attemptsCount,
        backtrackCount,
        solutionsCount,
      });

      const safety = checkSafety(row, col);

      if (!safety.isSafe && safety.conflict) {
        const { to, reason } = safety.conflict;
        const reasonDesc =
          reason === 'column'
            ? 'same vertical column'
            : reason === 'diagonal'
            ? 'same main diagonal'
            : 'same anti-diagonal';

        steps.push({
          stepIndex: stepCounter++,
          phase: 'conflict',
          operation: 'CONFLICT_DETECTED',
          explanation: `Position rejected: Queen at ${String.fromCharCode(65 + col)}${
            boardSize - row
          } conflicts with Queen at ${String.fromCharCode(65 + to.col)}${
            boardSize - to.row
          } on the ${reasonDesc}.`,
          codeLine: 6,
          boardSize,
          queens: [...placedQueens],
          currentRow: row,
          candidateCol: col,
          status: 'conflict',
          conflict: safety.conflict,
          attemptsCount,
          backtrackCount,
          solutionsCount,
        });
      } else {
        // Safe candidate! Place Queen
        placedQueens.push({ row, col });

        steps.push({
          stepIndex: stepCounter++,
          phase: 'placed',
          operation: 'PLACE_QUEEN',
          explanation: `Safe position! Placed Queen at ${String.fromCharCode(65 + col)}${
            boardSize - row
          }. Advancing to row ${row + 2}.`,
          codeLine: 7,
          boardSize,
          queens: [...placedQueens],
          currentRow: row,
          candidateCol: col,
          status: 'safe',
          attemptsCount,
          backtrackCount,
          solutionsCount,
        });

        // Recurse to next row
        backtrack(row + 1);

        if (mode === 'first' && foundSolutions.length >= 1) {
          return;
        }

        // Backtrack
        if (stepCounter >= maxSteps) {
          searchAbortedDueToLimit = true;
          return;
        }

        placedQueens.pop();
        backtrackCount++;

        steps.push({
          stepIndex: stepCounter++,
          phase: 'backtracking',
          operation: 'REMOVE_QUEEN',
          explanation: `Backtracking: Removing Queen from ${String.fromCharCode(65 + col)}${
            boardSize - row
          } to explore alternative placements.`,
          codeLine: 9,
          boardSize,
          queens: [...placedQueens],
          currentRow: row,
          candidateCol: col,
          status: 'backtracking',
          attemptsCount,
          backtrackCount,
          solutionsCount,
        });
      }
    }
  }

  backtrack(0);

  // Terminal Step
  const finalExplanation = searchAbortedDueToLimit
    ? `Search halted after reaching safety limit of ${maxSteps} steps. Found ${solutionsCount} solution(s).`
    : foundSolutions.length > 0
    ? `Search complete! Found ${solutionsCount} valid non-attacking configuration(s).`
    : `Search complete! No valid configuration exists for N=${boardSize}.`;

  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'COMPLETE',
    explanation: finalExplanation,
    codeLine: 10,
    boardSize,
    queens: foundSolutions.length > 0 ? foundSolutions[0] : [...placedQueens],
    currentRow: boardSize,
    candidateCol: null,
    status: 'complete',
    attemptsCount,
    backtrackCount,
    solutionsCount,
    allSolutions: [...foundSolutions],
    isTerminal: true,
  });

  return {
    steps,
    solutions: foundSolutions,
    totalAttempts: attemptsCount,
    totalBacktracks: backtrackCount,
  };
}
