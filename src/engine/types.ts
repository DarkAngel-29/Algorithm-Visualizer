/**
 * Core types for Algorithm Visualizer Engine
 * Supports sorting, backtracking, dynamic programming, matrix operations,
 * network flow, shortest paths, and string pattern matching.
 */

export type AlgorithmCategory =
  | 'sorting'
  | 'backtracking'
  | 'dp'
  | 'matrix'
  | 'flow'
  | 'graph'
  | 'string';

export interface BaseAlgorithmStep {
  stepIndex: number;
  phase: string;
  operation: string;
  explanation: string;
  codeLine: number;
}

export type AlgorithmPhase =
  | 'idle'
  | 'initial'
  | 'divide'
  | 'base_case'
  | 'compare'
  | 'write'
  | 'merge_segment_complete'
  | 'complete'
  | string;

export interface ArrayElement {
  id: string;
  value: number;
  originalIndex: number;
}

export type BarState =
  | 'default'
  | 'left_subarray'
  | 'right_subarray'
  | 'comparing'
  | 'writing'
  | 'sorted_segment'
  | 'fully_sorted';

export interface AlgorithmStep extends BaseAlgorithmStep {
  array: number[];
  activeRange?: [number, number];
  mid?: number;
  leftSubarray?: [number, number];
  rightSubarray?: [number, number];
  comparedIndices?: [number, number];
  writeIndex?: number;
  writeValue?: number;
  sortedRanges?: [number, number][];
  sortedIndices?: number[];
  depth?: number;
}

// ================= N-QUEENS TYPES =================
export interface QueenPosition {
  row: number;
  col: number;
}

export interface QueenConflict {
  from: QueenPosition;
  to: QueenPosition;
  reason: 'column' | 'diagonal' | 'anti-diagonal';
}

export interface NQueensStep extends BaseAlgorithmStep {
  boardSize: number;
  queens: QueenPosition[];
  currentRow: number;
  candidateCol: number | null;
  status: 'searching' | 'placing' | 'conflict' | 'safe' | 'backtracking' | 'solution_found' | 'complete';
  conflict?: QueenConflict;
  attemptsCount: number;
  backtrackCount: number;
  solutionsCount: number;
  allSolutions?: QueenPosition[][];
  searchStrategy?: 'ltr' | 'rtl' | 'middle_out';
  isTerminal?: boolean;
}

// ================= KNAPSACK 0/1 TYPES =================
export interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface KnapsackStep extends BaseAlgorithmStep {
  items: KnapsackItem[];
  capacity: number;
  dpTable: number[][]; // (n+1) x (W+1)
  currentItemIndex: number; // 1-based (0 represents no item)
  currentWeight: number;
  comparingCells?: {
    excludeCell: [number, number]; // [i-1, w]
    includeCell?: [number, number]; // [i-1, w - weight]
  };
  chosenValue?: number;
  decision?: 'exclude' | 'include' | 'too_heavy' | 'base_case' | 'traceback';
  tracebackPath?: [number, number][];
  selectedItemIds?: number[];
  optimalValue?: number;
  optimalWeight?: number;
  isReconstruction?: boolean;
}

// ================= MATRIX CHAIN MULTIPLICATION TYPES =================
export interface MatrixChainStep extends BaseAlgorithmStep {
  dimensions: number[]; // e.g. [10, 30, 5, 60] -> A1(10x30), A2(30x5), A3(5x60)
  matrixCount: number; // n
  mTable: (number | null)[][]; // 1-indexed (n+1) x (n+1)
  sTable: (number | null)[][]; // 1-indexed (n+1) x (n+1)
  chainLength: number; // L (from 2 to n)
  subproblemI: number; // i
  subproblemJ: number; // j
  candidateK?: number; // k
  leftCost?: number; // m[i][k]
  rightCost?: number; // m[k+1][j]
  combineCost?: number; // p[i-1] * p[k] * p[j]
  candidateCost?: number; // leftCost + rightCost + combineCost
  currentBestCost?: number;
  bestSplitSoFar?: number;
  isNewBestFound?: boolean;
  optimalParenthesization?: string;
  isReconstruction?: boolean;
  isComplete?: boolean;
}

export type MatrixStep = MatrixChainStep;

// ================= MAXIMUM FLOW (EDMONDS-KARP) TYPES =================
export interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isSource?: boolean;
  isSink?: boolean;
}

export interface FlowEdge {
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

export interface MaxFlowStep extends BaseAlgorithmStep {
  nodes: FlowNode[];
  edges: FlowEdge[];
  sourceId: string;
  sinkId: string;
  currentFlow: number;
  bfsQueue?: string[];
  visitedNodes?: string[];
  augmentingPath?: string[]; // Node IDs from source to sink
  bottleneckCapacity?: number;
  activeEdge?: [string, string];
  residualCapacities?: Record<string, number>; // key: "u->v", val: capacity - flow
  iterationNumber: number;
  minCutReachableNodes?: string[];
  isComplete?: boolean;
}

// ================= BELLMAN-FORD TYPES =================
export interface BFNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface BFEdge {
  from: string;
  to: string;
  weight: number;
}

export interface BellmanFordStep extends BaseAlgorithmStep {
  nodes: BFNode[];
  edges: BFEdge[];
  sourceId: string;
  distances: Record<string, number>; // Distance from source; Infinity if unreachable
  predecessors: Record<string, string | null>;
  currentIteration: number;
  activeEdgeIndex?: number;
  activeEdge?: BFEdge;
  relaxedSuccessfully?: boolean;
  isNegativeCycleDetected?: boolean;
  negativeCycleNodes?: string[];
  unreachableNodes?: string[];
  destinationId?: string;
  shortestPathToDestination?: string[];
  isComplete?: boolean;
}

// ================= LPS + KMP TYPES =================
export interface KMPStep extends BaseAlgorithmStep {
  stage: 'lps' | 'search';
  text: string;
  pattern: string;
  lpsTable: number[];
  currentPatternIndex: number;
  currentPrefixLen: number;
  currentTextIndex: number;
  comparisonIndices?: {
    textCharIdx?: number;
    patternCharIdx: number;
    isMatch: boolean;
  };
  matchedIndices: number[]; // Starting indices of complete matches in text
  comparisonCount: number;
  isLPSComplete?: boolean;
  isSearchComplete?: boolean;
  fallbackReason?: string;
}

// ================= COMMON METADATA & RESULTS =================
export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  paradigm: string;
  description: string;
  pseudocode: {
    language: string;
    lines: {
      lineNumber: number;
      code: string;
      indent: number;
      comment?: string;
    }[];
  };
}

export interface AlgorithmGeneratorResult {
  steps: AlgorithmStep[];
  initialArray: number[];
  finalArray: number[];
}
