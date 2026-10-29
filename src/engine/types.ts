/**
 * Core types for Algorithm Visualizer Engine
 * Designed to be generic and easily extensible to future sorting, searching, graph, and tree algorithms.
 */

export type AlgorithmCategory = 'sorting' | 'searching' | 'graph' | 'tree' | 'dp';

export type AlgorithmPhase =
  | 'idle'
  | 'initial'
  | 'divide'
  | 'base_case'
  | 'compare'
  | 'write'
  | 'merge_segment_complete'
  | 'complete';

export interface ArrayElement {
  id: string; // Unique identifier for smooth transitions
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

export interface AlgorithmStep {
  stepIndex: number;
  phase: AlgorithmPhase;
  operation: string; // e.g., 'SPLIT', 'COMPARE', 'OVERWRITE', 'MERGE_DONE', 'COMPLETE'
  array: number[]; // Full snapshot of the array at this step
  activeRange?: [number, number]; // [left, right]
  mid?: number;
  leftSubarray?: [number, number]; // [left, mid]
  rightSubarray?: [number, number]; // [mid + 1, right]
  comparedIndices?: [number, number]; // Indices of items being compared
  writeIndex?: number; // Index where a value is written
  writeValue?: number;
  sortedRanges?: [number, number][]; // Subarrays that are currently sorted
  sortedIndices?: number[]; // Individual indices that are finalized
  explanation: string; // Educational natural language explanation
  codeLine: number; // 1-based line number in pseudocode to highlight
  depth?: number; // Recursion tree depth (useful for visual insight)
}

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
