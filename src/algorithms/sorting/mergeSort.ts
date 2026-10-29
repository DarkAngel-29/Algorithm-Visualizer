import type { AlgorithmMetadata, AlgorithmGeneratorResult, AlgorithmStep } from '../../engine/types';

export const MERGE_SORT_METADATA: AlgorithmMetadata = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  paradigm: 'Divide and Conquer',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  description:
    'Merge Sort is an efficient, stable, comparison-based sorting algorithm. It recursively divides an array into two halves until single-element subarrays remain, then repeatedly merges sorted subarrays back together in sorted order.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm mergeSort(arr, left, right):', indent: 0 },
      { lineNumber: 2, code: 'if left >= right then return  // Base case', indent: 1 },
      { lineNumber: 3, code: 'mid ← ⌊(left + right) / 2⌋', indent: 1 },
      { lineNumber: 4, code: 'mergeSort(arr, left, mid)      // Divide left half', indent: 1 },
      { lineNumber: 5, code: 'mergeSort(arr, mid + 1, right)  // Divide right half', indent: 1 },
      { lineNumber: 6, code: 'merge(arr, left, mid, right)    // Conquer & combine', indent: 1 },
      { lineNumber: 7, code: '', indent: 0 },
      { lineNumber: 8, code: 'algorithm merge(arr, left, mid, right):', indent: 0 },
      { lineNumber: 9, code: 'temp ← copy of arr[left...right]', indent: 1 },
      { lineNumber: 10, code: 'i ← left, j ← mid + 1, k ← left', indent: 1 },
      { lineNumber: 11, code: 'while i ≤ mid and j ≤ right do:', indent: 1 },
      { lineNumber: 12, code: '  if temp[i] ≤ temp[j] then arr[k++] ← temp[i++]', indent: 2 },
      { lineNumber: 13, code: '  else arr[k++] ← temp[j++]', indent: 2 },
      { lineNumber: 14, code: 'copy any remaining elements of temp to arr', indent: 1 },
      { lineNumber: 15, code: 'return sorted segment arr[left...right]', indent: 1 },
    ],
  },
};

/**
 * Pure generator function for Merge Sort execution events.
 * Produces an immutable sequence of deterministic steps with full array snapshots.
 */
export function generateMergeSortSteps(inputArray: number[]): AlgorithmGeneratorResult {
  const arr = [...inputArray];
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  // Active sorted segments tracking
  const sortedSegments: [number, number][] = [];

  const addSortedRange = (start: number, end: number) => {
    // Add new range and merge overlapping/adjacent intervals
    sortedSegments.push([start, end]);
    sortedSegments.sort((a, b) => a[0] - b[0]);

    const merged: [number, number][] = [];
    for (const seg of sortedSegments) {
      if (merged.length === 0) {
        merged.push([...seg]);
      } else {
        const last = merged[merged.length - 1];
        if (seg[0] <= last[1] + 1) {
          last[1] = Math.max(last[1], seg[1]);
        } else {
          merged.push([...seg]);
        }
      }
    }
    sortedSegments.length = 0;
    sortedSegments.push(...merged);
  };

  // Step 0: Initial State
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIAL',
    array: [...arr],
    activeRange: [0, arr.length - 1],
    sortedRanges: [],
    explanation: `Starting Merge Sort on an array of ${arr.length} element${arr.length === 1 ? '' : 's'}.`,
    codeLine: 1,
    depth: 0,
  });

  if (arr.length <= 1) {
    if (arr.length === 1) {
      addSortedRange(0, 0);
      steps.push({
        stepIndex: stepCounter++,
        phase: 'base_case',
        operation: 'BASE_CASE',
        array: [...arr],
        activeRange: [0, 0],
        sortedRanges: [[0, 0]],
        sortedIndices: [0],
        explanation: `Base case: Array with a single element [${arr[0]}] is inherently sorted.`,
        codeLine: 2,
        depth: 1,
      });
    }

    steps.push({
      stepIndex: stepCounter++,
      phase: 'complete',
      operation: 'COMPLETE',
      array: [...arr],
      activeRange: arr.length === 1 ? [0, 0] : undefined,
      sortedRanges: arr.length === 1 ? [[0, 0]] : [],
      sortedIndices: arr.length === 1 ? [0] : [],
      explanation: 'Complete: Array is sorted.',
      codeLine: 1,
      depth: 0,
    });

    return {
      steps,
      initialArray: [...inputArray],
      finalArray: [...arr],
    };
  }

  function mergeSortHelper(left: number, right: number, depth: number) {
    if (left >= right) {
      addSortedRange(left, right);
      steps.push({
        stepIndex: stepCounter++,
        phase: 'base_case',
        operation: 'BASE_CASE',
        array: [...arr],
        activeRange: [left, right],
        sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
        sortedIndices: [left],
        explanation: `Base case: Single-element subarray at index ${left} (${arr[left]}) is already sorted.`,
        codeLine: 2,
        depth,
      });
      return;
    }

    const mid = Math.floor((left + right) / 2);

    // Divide event
    steps.push({
      stepIndex: stepCounter++,
      phase: 'divide',
      operation: 'SPLIT',
      array: [...arr],
      activeRange: [left, right],
      mid,
      leftSubarray: [left, mid],
      rightSubarray: [mid + 1, right],
      sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
      explanation: `Divide: Subarray [${left}..${right}] is split at index ${mid} into left [${left}..${mid}] and right [${mid + 1}..${right}].`,
      codeLine: 3,
      depth,
    });

    // Recursively sort left half
    mergeSortHelper(left, mid, depth + 1);

    // Recursively sort right half
    mergeSortHelper(mid + 1, right, depth + 1);

    // Now merge left and right
    merge(left, mid, right, depth);
  }

  function merge(left: number, mid: number, right: number, depth: number) {
    // Before merging, announce the conquer phase
    steps.push({
      stepIndex: stepCounter++,
      phase: 'compare',
      operation: 'PREPARE_MERGE',
      array: [...arr],
      activeRange: [left, right],
      mid,
      leftSubarray: [left, mid],
      rightSubarray: [mid + 1, right],
      sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
      explanation: `Conquer: Merging sorted left subarray [${left}..${mid}] and sorted right subarray [${mid + 1}..${right}].`,
      codeLine: 8,
      depth,
    });

    // Make an auxiliary copy of elements in [left..right]
    const temp = arr.slice();

    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      // Comparison step
      const leftVal = temp[i];
      const rightVal = temp[j];
      const isLeftSmallerOrEqual = leftVal <= rightVal;

      steps.push({
        stepIndex: stepCounter++,
        phase: 'compare',
        operation: 'COMPARE',
        array: [...arr],
        activeRange: [left, right],
        mid,
        leftSubarray: [left, mid],
        rightSubarray: [mid + 1, right],
        comparedIndices: [i, j],
        sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
        explanation: `Compare: ${leftVal} (index ${i}) with ${rightVal} (index ${j}). ${
          isLeftSmallerOrEqual
            ? `${leftVal} ≤ ${rightVal}, so select ${leftVal} from left subarray.`
            : `${rightVal} < ${leftVal}, so select ${rightVal} from right subarray.`
        }`,
        codeLine: 11,
        depth,
      });

      // Write chosen value
      if (isLeftSmallerOrEqual) {
        arr[k] = leftVal;
        steps.push({
          stepIndex: stepCounter++,
          phase: 'write',
          operation: 'WRITE',
          array: [...arr],
          activeRange: [left, right],
          mid,
          leftSubarray: [left, mid],
          rightSubarray: [mid + 1, right],
          writeIndex: k,
          writeValue: leftVal,
          sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
          explanation: `Merge: Placed smaller value ${leftVal} into position ${k}.`,
          codeLine: 12,
          depth,
        });
        i++;
      } else {
        arr[k] = rightVal;
        steps.push({
          stepIndex: stepCounter++,
          phase: 'write',
          operation: 'WRITE',
          array: [...arr],
          activeRange: [left, right],
          mid,
          leftSubarray: [left, mid],
          rightSubarray: [mid + 1, right],
          writeIndex: k,
          writeValue: rightVal,
          sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
          explanation: `Merge: Placed smaller value ${rightVal} into position ${k}.`,
          codeLine: 13,
          depth,
        });
        j++;
      }
      k++;
    }

    // Copy any remaining elements from left subarray
    while (i <= mid) {
      const leftVal = temp[i];
      arr[k] = leftVal;
      steps.push({
        stepIndex: stepCounter++,
        phase: 'write',
        operation: 'WRITE_REMAINING',
        array: [...arr],
        activeRange: [left, right],
        mid,
        leftSubarray: [left, mid],
        rightSubarray: [mid + 1, right],
        writeIndex: k,
        writeValue: leftVal,
        sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
        explanation: `Append: Appending remaining element ${leftVal} from left subarray to position ${k}.`,
        codeLine: 14,
        depth,
      });
      i++;
      k++;
    }

    // Copy any remaining elements from right subarray
    while (j <= right) {
      const rightVal = temp[j];
      arr[k] = rightVal;
      steps.push({
        stepIndex: stepCounter++,
        phase: 'write',
        operation: 'WRITE_REMAINING',
        array: [...arr],
        activeRange: [left, right],
        mid,
        leftSubarray: [left, mid],
        rightSubarray: [mid + 1, right],
        writeIndex: k,
        writeValue: rightVal,
        sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
        explanation: `Append: Appending remaining element ${rightVal} from right subarray to position ${k}.`,
        codeLine: 14,
        depth,
      });
      j++;
      k++;
    }

    // Segment merged completely
    addSortedRange(left, right);
    steps.push({
      stepIndex: stepCounter++,
      phase: 'merge_segment_complete',
      operation: 'SEGMENT_SORTED',
      array: [...arr],
      activeRange: [left, right],
      sortedRanges: sortedSegments.map(r => [...r] as [number, number]),
      explanation: `Segment complete: Subarray [${left}..${right}] is fully merged and sorted: [${arr
        .slice(left, right + 1)
        .join(', ')}].`,
      codeLine: 15,
      depth,
    });
  }

  // Execute full recursive merge sort
  mergeSortHelper(0, arr.length - 1, 0);

  // Final step: Sort Complete
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'COMPLETE',
    array: [...arr],
    activeRange: [0, arr.length - 1],
    sortedRanges: [[0, arr.length - 1]],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    explanation: `Sorting Complete: The entire array is sorted in ascending order!`,
    codeLine: 1,
    depth: 0,
  });

  return {
    steps,
    initialArray: [...inputArray],
    finalArray: [...arr],
  };
}
