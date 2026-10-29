import type { AlgorithmMetadata, MatrixStep } from '../../engine/types';

export const MATRIX_MULT_METADATA: AlgorithmMetadata = {
  id: 'matrix-multiplication',
  name: 'Matrix Multiplication',
  category: 'matrix',
  paradigm: 'Iterative / Linear Algebra',
  timeComplexity: {
    best: 'O(r_A · c_A · c_B)',
    average: 'O(r_A · c_A · c_B)',
    worst: 'O(r_A · c_A · c_B)',
  },
  spaceComplexity: 'O(r_A · c_B)',
  description:
    'Computes the matrix product C = A × B where each cell C[i][j] is the vector dot product of row i from matrix A and column j from matrix B. The number of columns in A must strictly match the number of rows in B.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm matrixMultiply(A, B):', indent: 0 },
      { lineNumber: 2, code: 'C ← new matrix of size rows(A) × cols(B)', indent: 1 },
      { lineNumber: 3, code: 'for i ← 0 to rows(A) - 1 do', indent: 1 },
      { lineNumber: 4, code: '  for j ← 0 to cols(B) - 1 do', indent: 2 },
      { lineNumber: 5, code: '    sum ← 0', indent: 3 },
      { lineNumber: 6, code: '    for k ← 0 to cols(A) - 1 do', indent: 3 },
      { lineNumber: 7, code: '      product ← A[i][k] × B[k][j]', indent: 4 },
      { lineNumber: 8, code: '      sum ← sum + product', indent: 4 },
      { lineNumber: 9, code: '    C[i][j] ← sum', indent: 3 },
      { lineNumber: 10, code: 'return C', indent: 1 },
    ],
  },
};

export const DEFAULT_MATRIX_A: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

export const DEFAULT_MATRIX_B: number[][] = [
  [7, 8],
  [9, 1],
  [2, 3],
];

export function generateMatrixSteps(
  matrixA: number[][] = DEFAULT_MATRIX_A,
  matrixB: number[][] = DEFAULT_MATRIX_B
): { steps: MatrixStep[]; resultMatrix: number[][] } {
  const steps: MatrixStep[] = [];
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  if (colsA !== rowsB) {
    throw new Error(`Incompatible matrix dimensions: A is ${rowsA}×${colsA}, B is ${rowsB}×${colsB}.`);
  }

  // Result matrix initialized with nulls
  const matrixC: (number | null)[][] = Array.from({ length: rowsA }, () =>
    Array.from({ length: colsB }, () => null)
  );

  let stepCounter = 0;

  // Step 0: Initial
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Starting multiplication of Matrix A (${rowsA}×${colsA}) by Matrix B (${rowsB}×${colsB}) to produce Matrix C (${rowsA}×${colsB}).`,
    codeLine: 2,
    matrixA,
    matrixB,
    matrixC: matrixC.map((r) => [...r]),
    accumulatedSum: 0,
  });

  // Calculate each cell C[i][j]
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      const terms: string[] = [];

      // Step: Start computing C[i][j]
      steps.push({
        stepIndex: stepCounter++,
        phase: 'start_cell',
        operation: 'START_DOT_PRODUCT',
        explanation: `Computing C[${i}][${j}]: Selecting Row ${i} in Matrix A and Column ${j} in Matrix B.`,
        codeLine: 5,
        matrixA,
        matrixB,
        matrixC: matrixC.map((r) => [...r]),
        activeRowA: i,
        activeColB: j,
        activeResultCell: [i, j],
        accumulatedSum: 0,
        expressionString: `C[${i}][${j}] = `,
      });

      // Dot product accumulation loop over k
      for (let k = 0; k < colsA; k++) {
        const valA = matrixA[i][k];
        const valB = matrixB[k][j];
        const product = valA * valB;
        sum += product;
        terms.push(`(${valA} × ${valB})`);

        const expr = `C[${i}][${j}] = ${terms.join(' + ')} = ${sum}`;

        steps.push({
          stepIndex: stepCounter++,
          phase: 'multiply_pair',
          operation: 'PAIR_PRODUCT',
          explanation: `k=${k}: Multiply A[${i}][${k}] (${valA}) × B[${k}][${j}] (${valB}) = ${product}. Running sum = ${sum}.`,
          codeLine: 7,
          matrixA,
          matrixB,
          matrixC: matrixC.map((r) => [...r]),
          activeRowA: i,
          activeColB: j,
          activeResultCell: [i, j],
          currentPairIndex: k,
          pairMultiplication: { valA, valB, product },
          accumulatedSum: sum,
          expressionString: expr,
        });
      }

      // Finalize C[i][j]
      matrixC[i][j] = sum;
      const completedExpr = `C[${i}][${j}] = ${terms.join(' + ')} = ${sum}`;

      steps.push({
        stepIndex: stepCounter++,
        phase: 'cell_complete',
        operation: 'STORE_RESULT',
        explanation: `Completed cell C[${i}][${j}] = ${sum}. Written to result matrix.`,
        codeLine: 9,
        matrixA,
        matrixB,
        matrixC: matrixC.map((r) => [...r]),
        activeRowA: i,
        activeColB: j,
        activeResultCell: [i, j],
        accumulatedSum: sum,
        expressionString: completedExpr,
      });
    }
  }

  // Complete
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'COMPLETE',
    explanation: `Matrix multiplication complete! Result Matrix C (${rowsA}×${colsB}) successfully calculated.`,
    codeLine: 10,
    matrixA,
    matrixB,
    matrixC: matrixC.map((r) => [...r]),
    accumulatedSum: 0,
    isCompleted: true,
  });

  return {
    steps,
    resultMatrix: matrixC as number[][],
  };
}
