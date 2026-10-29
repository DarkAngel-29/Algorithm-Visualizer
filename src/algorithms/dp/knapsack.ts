import type { AlgorithmMetadata, KnapsackItem, KnapsackStep } from '../../engine/types';

export const KNAPSACK_METADATA: AlgorithmMetadata = {
  id: 'knapsack-01',
  name: '0/1 Knapsack Problem',
  category: 'dp',
  paradigm: 'Dynamic Programming',
  timeComplexity: {
    best: 'O(n · W)',
    average: 'O(n · W)',
    worst: 'O(n · W)',
  },
  spaceComplexity: 'O(n · W)',
  description:
    'Given n items with weights and values, find the subset of items that maximizes total value without exceeding capacity W. The DP table stores optimal values for subproblems, and optimal items are recovered by backtracking.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm knapsack01(items, W):', indent: 0 },
      { lineNumber: 2, code: 'table ← (n + 1) × (W + 1) matrix initialized to 0', indent: 1 },
      { lineNumber: 3, code: 'for i ← 1 to n do:', indent: 1 },
      { lineNumber: 4, code: '  for w ← 0 to W do:', indent: 2 },
      { lineNumber: 5, code: '    if items[i].weight > w then', indent: 3 },
      { lineNumber: 6, code: '      table[i][w] ← table[i - 1][w]  // Cannot fit item', indent: 4 },
      { lineNumber: 7, code: '    else', indent: 3 },
      { lineNumber: 8, code: '      exclude ← table[i - 1][w]', indent: 4 },
      { lineNumber: 9, code: '      include ← table[i - 1][w - items[i].weight] + items[i].value', indent: 4 },
      { lineNumber: 10, code: '      table[i][w] ← max(exclude, include)', indent: 4 },
      { lineNumber: 11, code: 'return reconstructSolution(table, items, W)', indent: 1 },
    ],
  },
};

export const DEFAULT_KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 1, name: 'Item 1 (Gem)', weight: 2, value: 3 },
  { id: 2, name: 'Item 2 (Relic)', weight: 3, value: 4 },
  { id: 3, name: 'Item 3 (Artifact)', weight: 4, value: 5 },
  { id: 4, name: 'Item 4 (Crown)', weight: 5, value: 8 },
];

export const DEFAULT_KNAPSACK_CAPACITY = 8;

export function generateKnapsackSteps(
  items: KnapsackItem[] = DEFAULT_KNAPSACK_ITEMS,
  capacity: number = DEFAULT_KNAPSACK_CAPACITY
): { steps: KnapsackStep[]; optimalValue: number; optimalWeight: number; selectedItemIds: number[] } {
  const steps: KnapsackStep[] = [];
  const n = items.length;
  let stepCounter = 0;

  // Initialize DP table with 0s
  const dpTable: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: capacity + 1 }, () => 0)
  );

  // Step 0: Initial Empty Table
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Initialized a (${n} + 1) × (${capacity} + 1) DP table with base case row 0 = 0 (0 items yields 0 value).`,
    codeLine: 2,
    items,
    capacity,
    dpTable: dpTable.map((r) => [...r]),
    currentItemIndex: 0,
    currentWeight: 0,
    decision: 'base_case',
  });

  // Table filling: row by row, col by col
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      const excludeVal = dpTable[i - 1][w];

      if (item.weight > w) {
        // Item too heavy for current subproblem capacity w
        dpTable[i][w] = excludeVal;

        steps.push({
          stepIndex: stepCounter++,
          phase: 'fill_cell',
          operation: 'EXCLUDE_TOO_HEAVY',
          explanation: `Row ${i} (${item.name}), Cap ${w}: Item weight (${item.weight}) > capacity (${w}). Must exclude; copying DP[${
            i - 1
          }][${w}] = ${excludeVal}.`,
          codeLine: 6,
          items,
          capacity,
          dpTable: dpTable.map((r) => [...r]),
          currentItemIndex: i,
          currentWeight: w,
          comparingCells: {
            excludeCell: [i - 1, w],
          },
          chosenValue: excludeVal,
          decision: 'too_heavy',
        });
      } else {
        // Item fits! Compare exclude vs include
        const includeVal = dpTable[i - 1][w - item.weight] + item.value;
        const chosen = Math.max(excludeVal, includeVal);
        dpTable[i][w] = chosen;

        const choseInclude = includeVal > excludeVal;

        steps.push({
          stepIndex: stepCounter++,
          phase: 'fill_cell',
          operation: choseInclude ? 'INCLUDE_ITEM' : 'EXCLUDE_ITEM',
          explanation: `Row ${i} (${item.name}), Cap ${w}: Compare Exclude (DP[${i - 1}][${w}] = ${excludeVal}) vs Include (DP[${
            i - 1
          }][${w - item.weight}] + ${item.value} = ${includeVal}). Chose ${
            choseInclude ? `Include (+${item.value})` : 'Exclude'
          } = ${chosen}.`,
          codeLine: 10,
          items,
          capacity,
          dpTable: dpTable.map((r) => [...r]),
          currentItemIndex: i,
          currentWeight: w,
          comparingCells: {
            excludeCell: [i - 1, w],
            includeCell: [i - 1, w - item.weight],
          },
          chosenValue: chosen,
          decision: choseInclude ? 'include' : 'exclude',
        });
      }
    }
  }

  // Solution Reconstruction (Backtracking through DP table)
  const tracebackPath: [number, number][] = [];
  const selectedItemIds: number[] = [];
  let currRow = n;
  let currCap = capacity;

  steps.push({
    stepIndex: stepCounter++,
    phase: 'traceback_start',
    operation: 'START_RECONSTRUCTION',
    explanation: `DP table complete! Starting solution traceback from cell [${n}][${capacity}] (Maximum Value = ${dpTable[n][capacity]}) to identify optimal items.`,
    codeLine: 11,
    items,
    capacity,
    dpTable: dpTable.map((r) => [...r]),
    currentItemIndex: currRow,
    currentWeight: currCap,
    tracebackPath: [[currRow, currCap]],
    selectedItemIds: [],
    isReconstruction: true,
  });

  tracebackPath.push([currRow, currCap]);

  while (currRow > 0 && currCap >= 0) {
    const item = items[currRow - 1];
    const excludeVal = dpTable[currRow - 1][currCap];

    if (dpTable[currRow][currCap] !== excludeVal) {
      // Item was included!
      selectedItemIds.push(item.id);
      currCap -= item.weight;
      currRow -= 1;
      tracebackPath.push([currRow, currCap]);

      steps.push({
        stepIndex: stepCounter++,
        phase: 'traceback_step',
        operation: 'RECONSTRUCT_INCLUDE',
        explanation: `Backtrack: DP[${currRow + 1}][${currCap + item.weight}] ≠ DP[${currRow}][${
          currCap + item.weight
        }], so ${item.name} (wt: ${item.weight}, val: ${
          item.value
        }) was INCLUDED. Jump to [${currRow}][${currCap}].`,
        codeLine: 11,
        items,
        capacity,
        dpTable: dpTable.map((r) => [...r]),
        currentItemIndex: currRow,
        currentWeight: currCap,
        tracebackPath: [...tracebackPath],
        selectedItemIds: [...selectedItemIds],
        isReconstruction: true,
      });
    } else {
      // Item was excluded
      currRow -= 1;
      tracebackPath.push([currRow, currCap]);

      steps.push({
        stepIndex: stepCounter++,
        phase: 'traceback_step',
        operation: 'RECONSTRUCT_EXCLUDE',
        explanation: `Backtrack: DP[${currRow + 1}][${currCap}] = DP[${currRow}][${currCap}], so ${
          item.name
        } was EXCLUDED. Moving up to [${currRow}][${currCap}].`,
        codeLine: 11,
        items,
        capacity,
        dpTable: dpTable.map((r) => [...r]),
        currentItemIndex: currRow,
        currentWeight: currCap,
        tracebackPath: [...tracebackPath],
        selectedItemIds: [...selectedItemIds],
        isReconstruction: true,
      });
    }
  }

  // Calculate totals
  const optimalItems = items.filter((it) => selectedItemIds.includes(it.id));
  const optimalValue = optimalItems.reduce((acc, it) => acc + it.value, 0);
  const optimalWeight = optimalItems.reduce((acc, it) => acc + it.weight, 0);

  // Terminal Step: Complete!
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'OPTIMAL_SOLUTION_FOUND',
    explanation: `Knapsack Solved! Optimal Total Value = ${optimalValue}, Total Weight = ${optimalWeight} / ${capacity}. ${optimalItems.length} item(s) selected without exceeding capacity.`,
    codeLine: 11,
    items,
    capacity,
    dpTable: dpTable.map((r) => [...r]),
    currentItemIndex: 0,
    currentWeight: 0,
    tracebackPath: [...tracebackPath],
    selectedItemIds: [...selectedItemIds],
    optimalValue,
    optimalWeight,
    isReconstruction: true,
  });

  return {
    steps,
    optimalValue,
    optimalWeight,
    selectedItemIds,
  };
}
