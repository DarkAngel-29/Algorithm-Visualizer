import type { AlgorithmMetadata, BFNode, BFEdge, BellmanFordStep } from '../../engine/types';

export const BELLMAN_FORD_METADATA: AlgorithmMetadata = {
  id: 'bellman-ford',
  name: 'Bellman-Ford Algorithm',
  category: 'graph',
  paradigm: 'Dynamic Programming / Graph Theory',
  timeComplexity: {
    best: 'O(E)',
    average: 'O(V · E)',
    worst: 'O(V · E)',
  },
  spaceComplexity: 'O(V)',
  description:
    'Computes single-source shortest paths in weighted directed graphs. Unlike Dijkstra, Bellman-Ford supports negative edge weights and reliably detects reachable negative-weight cycles through |V| - 1 relaxation iterations plus a final verification pass.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm bellmanFord(vertices, edges, source):', indent: 0 },
      { lineNumber: 2, code: 'dist[source] ← 0; all other dist[v] ← ∞', indent: 1 },
      { lineNumber: 3, code: 'for i ← 1 to |V| - 1 do:', indent: 1 },
      { lineNumber: 4, code: '  updated ← false', indent: 2 },
      { lineNumber: 5, code: '  for each edge (u, v) with weight w do:', indent: 2 },
      { lineNumber: 6, code: '    if dist[u] + w < dist[v] then', indent: 3 },
      { lineNumber: 7, code: '      dist[v] ← dist[u] + w; pred[v] ← u; updated ← true', indent: 4 },
      { lineNumber: 8, code: '  if not updated then break  // Early termination', indent: 2 },
      { lineNumber: 9, code: 'for each edge (u, v) with weight w do: // Negative cycle check', indent: 1 },
      { lineNumber: 10, code: '  if dist[u] + w < dist[v] then report "Negative Cycle Detected"', indent: 2 },
      { lineNumber: 11, code: 'return dist, pred', indent: 1 },
    ],
  },
};

export const DEFAULT_BF_NODES: BFNode[] = [
  { id: 'A', label: 'A (Source)', x: 90, y: 170 },
  { id: 'B', label: 'B', x: 260, y: 70 },
  { id: 'C', label: 'C', x: 260, y: 270 },
  { id: 'D', label: 'D', x: 440, y: 70 },
  { id: 'E', label: 'E', x: 440, y: 270 },
  { id: 'F', label: 'F', x: 610, y: 170 },
];

export const DEFAULT_BF_EDGES: BFEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: -1 },
  { from: 'C', to: 'B', weight: 1 },
  { from: 'C', to: 'E', weight: 3 },
  { from: 'D', to: 'F', weight: 3 },
  { from: 'E', to: 'D', weight: 2 },
  { from: 'E', to: 'F', weight: -2 },
];

export function generateBellmanFordSteps(
  nodes: BFNode[] = DEFAULT_BF_NODES,
  edges: BFEdge[] = DEFAULT_BF_EDGES,
  sourceId: string = 'A'
): { steps: BellmanFordStep[]; hasNegativeCycle: boolean } {
  const steps: BellmanFordStep[] = [];
  const V = nodes.length;

  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};

  for (const n of nodes) {
    distances[n.id] = n.id === sourceId ? 0 : Infinity;
    predecessors[n.id] = null;
  }

  let stepCounter = 0;

  // Step 0: Initialization
  steps.push({
    stepIndex: stepCounter++,
    phase: 'initial',
    operation: 'INITIALIZE',
    explanation: `Initialized distances: dist[${sourceId}] = 0, all other vertices set to ∞. Preparing for at most ${
      V - 1
    } relaxation passes.`,
    codeLine: 2,
    nodes,
    edges,
    sourceId,
    distances: { ...distances },
    predecessors: { ...predecessors },
    currentIteration: 0,
  });

  let hasNegativeCycle = false;
  const negativeCycleNodes: string[] = [];

  // Relaxation passes 1 to |V| - 1
  for (let iter = 1; iter <= V - 1; iter++) {
    let updatedInThisPass = false;

    // Start of pass notification
    steps.push({
      stepIndex: stepCounter++,
      phase: 'pass_start',
      operation: 'START_PASS',
      explanation: `Starting Relaxation Pass ${iter} of ${V - 1}. Examining all ${edges.length} directed edges.`,
      codeLine: 3,
      nodes,
      edges,
      sourceId,
      distances: { ...distances },
      predecessors: { ...predecessors },
      currentIteration: iter,
    });

    for (let eIdx = 0; eIdx < edges.length; eIdx++) {
      const edge = edges[eIdx];
      const { from, to, weight } = edge;
      const distU = distances[from];
      const distV = distances[to];

      if (distU === Infinity) {
        // Source vertex is currently unreachable
        steps.push({
          stepIndex: stepCounter++,
          phase: 'edge_examine',
          operation: 'CANNOT_RELAX_INFINITY',
          explanation: `Pass ${iter}, Edge (${from} → ${to}, w=${weight}): Cannot relax because dist[${from}] = ∞ (unreachable).`,
          codeLine: 6,
          nodes,
          edges,
          sourceId,
          distances: { ...distances },
          predecessors: { ...predecessors },
          currentIteration: iter,
          activeEdgeIndex: eIdx,
          activeEdge: edge,
          relaxedSuccessfully: false,
        });
      } else {
        const candidateDist = distU + weight;

        if (candidateDist < distV) {
          // Relaxation successful!
          distances[to] = candidateDist;
          predecessors[to] = from;
          updatedInThisPass = true;

          steps.push({
            stepIndex: stepCounter++,
            phase: 'edge_relaxed',
            operation: 'RELAX_EDGE',
            explanation: `Pass ${iter}, Edge (${from} → ${to}, w=${weight}): Relaxed! dist[${from}] + ${weight} = ${candidateDist} < ${
              distV === Infinity ? '∞' : distV
            }. Updated dist[${to}] = ${candidateDist}, pred[${to}] = ${from}.`,
            codeLine: 7,
            nodes,
            edges,
            sourceId,
            distances: { ...distances },
            predecessors: { ...predecessors },
            currentIteration: iter,
            activeEdgeIndex: eIdx,
            activeEdge: edge,
            relaxedSuccessfully: true,
          });
        } else {
          // No improvement
          steps.push({
            stepIndex: stepCounter++,
            phase: 'edge_examine',
            operation: 'NO_IMPROVEMENT',
            explanation: `Pass ${iter}, Edge (${from} → ${to}, w=${weight}): dist[${from}] + ${weight} = ${candidateDist} ≥ current dist[${to}] (${distV}). No update.`,
            codeLine: 6,
            nodes,
            edges,
            sourceId,
            distances: { ...distances },
            predecessors: { ...predecessors },
            currentIteration: iter,
            activeEdgeIndex: eIdx,
            activeEdge: edge,
            relaxedSuccessfully: false,
          });
        }
      }
    }

    if (!updatedInThisPass) {
      steps.push({
        stepIndex: stepCounter++,
        phase: 'early_termination',
        operation: 'EARLY_STOP',
        explanation: `Pass ${iter} completed with 0 updates. Shortest path tree has converged early!`,
        codeLine: 8,
        nodes,
        edges,
        sourceId,
        distances: { ...distances },
        predecessors: { ...predecessors },
        currentIteration: iter,
      });
      break;
    }
  }

  // Pass |V|: Negative-Cycle Detection Check
  steps.push({
    stepIndex: stepCounter++,
    phase: 'negative_cycle_check',
    operation: 'NEGATIVE_CYCLE_VERIFICATION',
    explanation: `Verification Pass: Checking whether any edge can still be relaxed. If so, a reachable negative-weight cycle exists.`,
    codeLine: 9,
    nodes,
    edges,
    sourceId,
    distances: { ...distances },
    predecessors: { ...predecessors },
    currentIteration: V,
  });

  for (let eIdx = 0; eIdx < edges.length; eIdx++) {
    const edge = edges[eIdx];
    const { from, to, weight } = edge;
    if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
      hasNegativeCycle = true;
      if (!negativeCycleNodes.includes(from)) negativeCycleNodes.push(from);
      if (!negativeCycleNodes.includes(to)) negativeCycleNodes.push(to);

      steps.push({
        stepIndex: stepCounter++,
        phase: 'negative_cycle_detected',
        operation: 'CYCLE_DETECTED',
        explanation: `NEGATIVE CYCLE DETECTED on edge (${from} → ${to}, w=${weight})! dist[${from}] + ${weight} = ${
          distances[from] + weight
        } < ${distances[to]}. Shortest paths are undefined (distance can decrease indefinitely to -∞).`,
        codeLine: 10,
        nodes,
        edges,
        sourceId,
        distances: { ...distances },
        predecessors: { ...predecessors },
        currentIteration: V,
        activeEdgeIndex: eIdx,
        activeEdge: edge,
        isNegativeCycleDetected: true,
        negativeCycleNodes: [...negativeCycleNodes],
      });
    }
  }

  const unreachableNodes = nodes.filter((n) => distances[n.id] === Infinity).map((n) => n.id);

  // Terminal Step
  const completionMessage = hasNegativeCycle
    ? `Bellman-Ford finished: Reachable negative-weight cycle detected! Vertices {${negativeCycleNodes.join(
        ', '
      )}} are trapped in infinite negative loops.`
    : `Bellman-Ford converged successfully! All finite shortest paths from source "${sourceId}" are verified.`;

  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'COMPLETE',
    explanation: completionMessage,
    codeLine: 11,
    nodes,
    edges,
    sourceId,
    distances: { ...distances },
    predecessors: { ...predecessors },
    currentIteration: V,
    isNegativeCycleDetected: hasNegativeCycle,
    negativeCycleNodes,
    unreachableNodes,
    isComplete: true,
  });

  return {
    steps,
    hasNegativeCycle,
  };
}
