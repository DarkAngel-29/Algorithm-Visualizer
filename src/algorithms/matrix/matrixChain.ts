import type { AlgorithmMetadata, MatrixChainStep } from '../../engine/types';

export const MATRIX_CHAIN_METADATA: AlgorithmMetadata = {
  id: 'matrix-chain-multiplication',
  name: 'Matrix Chain Multiplication',
  category: 'dp',
  paradigm: 'Dynamic Programming',
  timeComplexity: {
    best: 'O(n³)',
    average: 'O(n³)',
    worst: 'O(n³)',
  },
  spaceComplexity: 'O(n²)',
  description:
    'Finds the most efficient parenthesization for a sequence of matrices to minimize total scalar multiplications. Fills a 2D cost table m[i][j] by chain length and records the optimal split indices in s[i][j] for solution reconstruction.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm matrixChainOrder(p):', indent: 0 },
      { lineNumber: 2, code: 'n ← length(p) - 1; let m[1..n, 1..n] and s[1..n, 1..n] be tables', indent: 1 },
      { lineNumber: 3, code: 'for i ← 1 to n do m[i, i] ← 0  // Base case: chains of length 1', indent: 1 },
      { lineNumber: 4, code: 'for L ← 2 to n do  // L is chain length', indent: 1 },
      { lineNumber: 5, code: '  for i ← 1 to n - L + 1 do', indent: 2 },
      { lineNumber: 6, code: '    j ← i + L - 1; m[i, j] ← ∞', indent: 3 },
      { lineNumber: 7, code: '    for k ← i to j - 1 do', indent: 3 },
      { lineNumber: 8, code: '      cost ← m[i, k] + m[k + 1, j] + p[i - 1] · p[k] · p[j]', indent: 4 },
      { lineNumber: 9, code: '      if cost < m[i, j] then m[i, j] ← cost; s[i, j] ← k', indent: 4 },
      { lineNumber: 10, code: 'return m[1, n], reconstructParentheses(s, 1, n)', indent: 1 },
    ],
  },
};

export const DEFAULT_MCM_DIMENSIONS = [10, 30, 5, 60];

export interface MCMGeneratorResult {
  steps: MatrixChainStep[];
  minCost: number;
  optimalParenthesization: string;
}

export function generateMatrixChainSteps(
  dimensions: number[] = DEFAULT_MCM_DIMENSIONS
): MCMGeneratorResult {
  const p = [...dimensions];
  const n = p.length - 1; // number of matrices
  const steps: MatrixChainStep[] = [];
  let stepCounter = 0;

  // 1-indexed tables of size (n+1) x (n+1)
  const mTable: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: n + 1 }, () => null)
  );
  const sTable: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: n + 1 }, () => null)
  );

  // Base Case: m[i][i] = 0 for single matrices
  for (let i = 1; i <= n; i++) {
    mTable[i][i] = 0;
  }

  // Helper snapshot copier
  const copyTable = (tbl: (number | null)[][]) => tbl.map((row) => [...row]);

  // Step 0: Initialization
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Starting Matrix Chain Multiplication for ${n} matrices with dimensions [${p.join(
      ', '
    )}]. Chains of length 1 require 0 scalar multiplications (m[i][i] = 0).`,
    codeLine: 3,
    dimensions: p,
    matrixCount: n,
    mTable: copyTable(mTable),
    sTable: copyTable(sTable),
    chainLength: 1,
    subproblemI: 1,
    subproblemJ: 1,
  });

  // Dynamic Programming: solve for increasing chain lengths L = 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      let bestCostForIJ: number | null = null;
      let bestKForIJ: number | null = null;

      // Start subproblem A_i ... A_j
      steps.push({
        stepIndex: stepCounter++,
        phase: 'subproblem_start',
        operation: 'START_SUBPROBLEM',
        explanation: `Evaluating subchain of length ${L}: matrices A${i} through A${j} (subproblem m[${i}][${j}]).`,
        codeLine: 6,
        dimensions: p,
        matrixCount: n,
        mTable: copyTable(mTable),
        sTable: copyTable(sTable),
        chainLength: L,
        subproblemI: i,
        subproblemJ: j,
        currentBestCost: undefined,
      });

      // Try every split point k from i to j - 1
      for (let k = i; k < j; k++) {
        const leftCost = mTable[i][k]!;
        const rightCost = mTable[k + 1][j]!;
        const combineCost = p[i - 1] * p[k] * p[j];
        const totalCandidateCost = leftCost + rightCost + combineCost;

        const isNewBest = bestCostForIJ === null || totalCandidateCost < bestCostForIJ;

        if (isNewBest) {
          bestCostForIJ = totalCandidateCost;
          bestKForIJ = k;
          mTable[i][j] = totalCandidateCost;
          sTable[i][j] = k;
        }

        steps.push({
          stepIndex: stepCounter++,
          phase: 'test_split',
          operation: isNewBest ? 'NEW_BEST_SPLIT' : 'EVALUATE_SPLIT',
          explanation: `Split at k=${k} (A${i}..A${k})(A${k + 1}..A${j}): Left m[${i}][${k}]=${leftCost} + Right m[${
            k + 1
          }][${j}]=${rightCost} + Multiply (${p[i - 1]}×${p[k]}×${p[j]}=${combineCost}) = ${totalCandidateCost}.${
            isNewBest
              ? ` New minimum cost found for m[${i}][${j}] = ${totalCandidateCost} with optimal split at k=${k}.`
              : ` Exceeds current minimum (${bestCostForIJ}).`
          }`,
          codeLine: 9,
          dimensions: p,
          matrixCount: n,
          mTable: copyTable(mTable),
          sTable: copyTable(sTable),
          chainLength: L,
          subproblemI: i,
          subproblemJ: j,
          candidateK: k,
          leftCost,
          rightCost,
          combineCost,
          candidateCost: totalCandidateCost,
          currentBestCost: bestCostForIJ ?? undefined,
          bestSplitSoFar: bestKForIJ ?? undefined,
          isNewBestFound: isNewBest,
        });
      }

      // Subproblem complete
      steps.push({
        stepIndex: stepCounter++,
        phase: 'subproblem_complete',
        operation: 'SUBPROBLEM_SOLVED',
        explanation: `Optimal cost for subchain A${i}..A${j} determined: m[${i}][${j}] = ${bestCostForIJ} with split s[${i}][${j}] = ${bestKForIJ}.`,
        codeLine: 9,
        dimensions: p,
        matrixCount: n,
        mTable: copyTable(mTable),
        sTable: copyTable(sTable),
        chainLength: L,
        subproblemI: i,
        subproblemJ: j,
        currentBestCost: bestCostForIJ ?? undefined,
        bestSplitSoFar: bestKForIJ ?? undefined,
      });
    }
  }

  // Reconstruct Parenthesization
  function reconstruct(i: number, j: number): string {
    if (i === j) {
      return `A${i}`;
    }
    const k = sTable[i][j]!;
    return `(${reconstruct(i, k)}${reconstruct(k + 1, j)})`;
  }

  const optimalParenthesization = reconstruct(1, n);
  const minCost = mTable[1][n]!;

  // Traceback / Reconstruction Phase
  steps.push({
    stepIndex: stepCounter++,
    phase: 'reconstruction',
    operation: 'RECONSTRUCT_OPTIMAL',
    explanation: `Reconstructing optimal parenthesization using split table s: ${optimalParenthesization} with minimum scalar multiplication cost = ${minCost}.`,
    codeLine: 10,
    dimensions: p,
    matrixCount: n,
    mTable: copyTable(mTable),
    sTable: copyTable(sTable),
    chainLength: n,
    subproblemI: 1,
    subproblemJ: n,
    optimalParenthesization,
    isReconstruction: true,
  });

  // Final Terminal Step
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'COMPLETE',
    explanation: `Matrix Chain Multiplication Complete! Minimum cost = ${minCost} scalar multiplications. Optimal order: ${optimalParenthesization}.`,
    codeLine: 10,
    dimensions: p,
    matrixCount: n,
    mTable: copyTable(mTable),
    sTable: copyTable(sTable),
    chainLength: n,
    subproblemI: 1,
    subproblemJ: n,
    optimalParenthesization,
    isComplete: true,
  });

  return {
    steps,
    minCost,
    optimalParenthesization,
  };
}
