import type { AlgorithmMetadata, FlowNode, FlowEdge, MaxFlowStep } from '../../engine/types';

export const MAX_FLOW_METADATA: AlgorithmMetadata = {
  id: 'max-flow',
  name: 'Maximum Flow (Edmonds-Karp)',
  category: 'flow',
  paradigm: 'Network Flow / Greedy Augmentation',
  timeComplexity: {
    best: 'O(V · E²)',
    average: 'O(V · E²)',
    worst: 'O(V · E²)',
  },
  spaceComplexity: 'O(V + E)',
  description:
    'Edmonds-Karp implements the Ford-Fulkerson method using Breadth-First Search (BFS) to discover shortest augmenting paths in the residual network. Flow is repeatedly pushed until no path from source to sink exists in the residual graph.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm edmondsKarp(graph, source, sink):', indent: 0 },
      { lineNumber: 2, code: 'flow ← 0', indent: 1 },
      { lineNumber: 3, code: 'while true do:', indent: 1 },
      { lineNumber: 4, code: '  path, bottleneck ← bfsAugmentingPath(residualGraph, source, sink)', indent: 2 },
      { lineNumber: 5, code: '  if path is empty then break  // No augmenting path remaining', indent: 2 },
      { lineNumber: 6, code: '  for each edge (u, v) in path do:', indent: 2 },
      { lineNumber: 7, code: '    if (u, v) is forward then flow(u, v) ← flow(u, v) + bottleneck', indent: 3 },
      { lineNumber: 8, code: '    else flow(v, u) ← flow(v, u) - bottleneck  // Reverse cancellation', indent: 3 },
      { lineNumber: 9, code: '  totalFlow ← totalFlow + bottleneck', indent: 2 },
      { lineNumber: 10, code: 'minCut ← reachableFromSourceInResidual(source)', indent: 1 },
      { lineNumber: 11, code: 'return totalFlow, minCut', indent: 1 },
    ],
  },
};

export const DEFAULT_FLOW_NODES: FlowNode[] = [
  { id: 's', label: 'S (Source)', x: 80, y: 170, isSource: true },
  { id: 'u', label: 'U', x: 260, y: 70 },
  { id: 'v', label: 'V', x: 260, y: 270 },
  { id: 'w', label: 'W', x: 440, y: 70 },
  { id: 'x', label: 'X', x: 440, y: 270 },
  { id: 't', label: 'T (Sink)', x: 620, y: 170, isSink: true },
];

export const DEFAULT_FLOW_EDGES: FlowEdge[] = [
  { from: 's', to: 'u', capacity: 10, flow: 0 },
  { from: 's', to: 'v', capacity: 10, flow: 0 },
  { from: 'u', to: 'v', capacity: 2, flow: 0 },
  { from: 'u', to: 'w', capacity: 4, flow: 0 },
  { from: 'u', to: 'x', capacity: 8, flow: 0 },
  { from: 'v', to: 'x', capacity: 9, flow: 0 },
  { from: 'w', to: 't', capacity: 10, flow: 0 },
  { from: 'x', to: 'w', capacity: 6, flow: 0 },
  { from: 'x', to: 't', capacity: 10, flow: 0 },
];

export function generateMaxFlowSteps(
  nodes: FlowNode[] = DEFAULT_FLOW_NODES,
  initialEdges: FlowEdge[] = DEFAULT_FLOW_EDGES,
  sourceId: string = 's',
  sinkId: string = 't'
): { steps: MaxFlowStep[]; maxFlow: number; minCut: string[] } {
  const steps: MaxFlowStep[] = [];
  const edges: FlowEdge[] = initialEdges.map((e) => ({ ...e, flow: 0 }));

  let totalFlow = 0;
  let iteration = 0;
  let stepCounter = 0;

  // Helper to get residual capacities map
  const getResidualMap = (): Record<string, number> => {
    const res: Record<string, number> = {};
    for (const e of edges) {
      // Forward residual: capacity - flow
      res[`${e.from}->${e.to}`] = e.capacity - e.flow;
      // Reverse residual: flow
      res[`${e.to}->${e.from}`] = e.flow;
    }
    return res;
  };

  // Step 0: Initial Zero Flow
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Starting Edmonds-Karp Maximum Flow with source "${sourceId}" and sink "${sinkId}". Initial flow = 0.`,
    codeLine: 2,
    nodes,
    edges: edges.map((e) => ({ ...e })),
    sourceId,
    sinkId,
    currentFlow: 0,
    residualCapacities: getResidualMap(),
    iterationNumber: 0,
  });

  // Main Edmonds-Karp Loop
  while (true) {
    iteration++;

    // BFS to find augmenting path in residual graph
    const parent: Record<string, { u: string; isForward: boolean; edgeIdx: number } | null> = {};
    for (const n of nodes) parent[n.id] = null;

    const queue: string[] = [sourceId];
    const visited: string[] = [sourceId];

    steps.push({
      stepIndex: stepCounter++,
      phase: 'bfs_start',
      operation: 'BFS_SEARCH',
      explanation: `Iteration ${iteration}: Starting BFS from source "${sourceId}" to find an augmenting path in the residual graph.`,
      codeLine: 4,
      nodes,
      edges: edges.map((e) => ({ ...e })),
      sourceId,
      sinkId,
      currentFlow: totalFlow,
      bfsQueue: [...queue],
      visitedNodes: [...visited],
      residualCapacities: getResidualMap(),
      iterationNumber: iteration,
    });

    let pathFound = false;

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === sinkId) {
        pathFound = true;
        break;
      }

      // Check all forward edges from u
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (e.from === u && parent[e.to] === null && e.to !== sourceId) {
          const residualCap = e.capacity - e.flow;
          if (residualCap > 0) {
            parent[e.to] = { u, isForward: true, edgeIdx: i };
            visited.push(e.to);
            queue.push(e.to);
          }
        }
      }

      // Check all reverse edges into u
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (e.to === u && parent[e.from] === null && e.from !== sourceId) {
          const residualCap = e.flow;
          if (residualCap > 0) {
            parent[e.from] = { u, isForward: false, edgeIdx: i };
            visited.push(e.from);
            queue.push(e.from);
          }
        }
      }
    }

    if (!pathFound) {
      // No augmenting path exists! Flow is maximum
      break;
    }

    // Reconstruct augmenting path
    const path: string[] = [];
    let curr = sinkId;
    let bottleneck = Infinity;

    while (curr !== sourceId) {
      path.unshift(curr);
      const pInfo = parent[curr]!;
      const e = edges[pInfo.edgeIdx];
      const resCap = pInfo.isForward ? e.capacity - e.flow : e.flow;
      bottleneck = Math.min(bottleneck, resCap);
      curr = pInfo.u;
    }
    path.unshift(sourceId);

    // Step: Augmenting Path Discovered
    steps.push({
      stepIndex: stepCounter++,
      phase: 'path_found',
      operation: 'AUGMENTING_PATH',
      explanation: `Augmenting path found: ${path.join(
        ' → '
      )} with bottleneck residual capacity = ${bottleneck}.`,
      codeLine: 4,
      nodes,
      edges: edges.map((e) => ({ ...e })),
      sourceId,
      sinkId,
      currentFlow: totalFlow,
      augmentingPath: [...path],
      bottleneckCapacity: bottleneck,
      residualCapacities: getResidualMap(),
      iterationNumber: iteration,
    });

    // Augment flow along the path
    curr = sinkId;
    while (curr !== sourceId) {
      const pInfo = parent[curr]!;
      const e = edges[pInfo.edgeIdx];
      if (pInfo.isForward) {
        e.flow += bottleneck;
      } else {
        e.flow -= bottleneck; // Flow cancellation on reverse edge
      }
      curr = pInfo.u;
    }

    totalFlow += bottleneck;

    // Step: Flow Augmented
    steps.push({
      stepIndex: stepCounter++,
      phase: 'flow_augmented',
      operation: 'AUGMENT_FLOW',
      explanation: `Pushed +${bottleneck} units along ${path.join(
        ' → '
      )}. Total network flow is now ${totalFlow}.`,
      codeLine: 9,
      nodes,
      edges: edges.map((e) => ({ ...e })),
      sourceId,
      sinkId,
      currentFlow: totalFlow,
      augmentingPath: [...path],
      bottleneckCapacity: bottleneck,
      residualCapacities: getResidualMap(),
      iterationNumber: iteration,
    });
  }

  // Derive Minimum Cut: All nodes reachable from source in final residual graph
  const minCutVisited = new Set<string>([sourceId]);
  const minCutQueue = [sourceId];

  while (minCutQueue.length > 0) {
    const u = minCutQueue.shift()!;
    for (const e of edges) {
      if (e.from === u && !minCutVisited.has(e.to) && e.capacity - e.flow > 0) {
        minCutVisited.add(e.to);
        minCutQueue.push(e.to);
      }
      if (e.to === u && !minCutVisited.has(e.from) && e.flow > 0) {
        minCutVisited.add(e.from);
        minCutQueue.push(e.from);
      }
    }
  }

  const minCutReachableNodes = Array.from(minCutVisited);

  // Terminal Step: Complete!
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'MAX_FLOW_REACHED',
    explanation: `No more augmenting paths exist in the residual network. Maximum Flow = ${totalFlow}. Minimum Cut S-partition = {${minCutReachableNodes.join(
      ', '
    )}}.`,
    codeLine: 11,
    nodes,
    edges: edges.map((e) => ({ ...e })),
    sourceId,
    sinkId,
    currentFlow: totalFlow,
    residualCapacities: getResidualMap(),
    iterationNumber: iteration,
    minCutReachableNodes,
    isComplete: true,
  });

  return {
    steps,
    maxFlow: totalFlow,
    minCut: minCutReachableNodes,
  };
}
