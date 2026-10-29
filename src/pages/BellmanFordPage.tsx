import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Network,
  Sparkles,
  Bookmark,
  Play,
  Plus,
  Trash2,
  Dice5,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  generateBellmanFordSteps,
  BELLMAN_FORD_METADATA,
  DEFAULT_BF_NODES,
  DEFAULT_BF_EDGES,
} from '../algorithms/graph/bellmanFord';
import type { BFNode, BFEdge } from '../engine/types';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { BellmanFordVisualizer } from '../components/visualizer/graph/BellmanFordVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const BellmanFordPage: React.FC = () => {
  const [nodes, setNodes] = useState<BFNode[]>(DEFAULT_BF_NODES);
  const [edges, setEdges] = useState<BFEdge[]>(DEFAULT_BF_EDGES);
  const [sourceId, setSourceId] = useState<string>('A');
  const [destinationId, setDestinationId] = useState<string>('F'); // Optional destination

  // Form states for adding node/edge
  const [newNodeId, setNewNodeId] = useState<string>('');
  const [newEdgeFrom, setNewEdgeFrom] = useState<string>('A');
  const [newEdgeTo, setNewEdgeTo] = useState<string>('B');
  const [newEdgeWeight, setNewEdgeWeight] = useState<number>(3);
  const [validationError, setValidationError] = useState<string | null>(null);

  const effectiveSourceId = nodes.some((n) => n.id === sourceId) ? sourceId : nodes[0]?.id || 'A';
  const effectiveDestinationId = destinationId && nodes.some((n) => n.id === destinationId) ? destinationId : '';
  const effectiveNewEdgeFrom = nodes.some((n) => n.id === newEdgeFrom) ? newEdgeFrom : nodes[0]?.id || '';
  const effectiveNewEdgeTo = nodes.some((n) => n.id === newEdgeTo) ? newEdgeTo : nodes[nodes.length - 1]?.id || '';

  const executionResult = useMemo(() => {
    return generateBellmanFordSteps(
      nodes,
      edges,
      effectiveSourceId,
      effectiveDestinationId ? effectiveDestinationId : undefined
    );
  }, [nodes, edges, effectiveSourceId, effectiveDestinationId]);

  const handleComplete = useCallback(() => {
    if (!executionResult.hasNegativeCycle) {
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#A78BFA', '#67E8F9', '#86EFAC', '#FBBF24'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback
      }
    }
  }, [executionResult.hasNegativeCycle]);

  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speedIndex,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    jumpToStep,
    setSpeedIndex,
  } = useAlgorithmPlayback({
    steps: executionResult.steps,
    onComplete: handleComplete,
  });

  const handleLoadPreset = (type: 'standard' | 'negative_cycle' | 'unreachable') => {
    setValidationError(null);
    if (type === 'standard') {
      setNodes(DEFAULT_BF_NODES);
      setEdges(DEFAULT_BF_EDGES);
      setSourceId('A');
      setDestinationId('F');
    } else if (type === 'negative_cycle') {
      // Graph containing a negative weight cycle: B -> D -> E -> B (weights: 2, -5, 1 => sum = -2)
      setNodes([
        { id: 'A', label: 'A', x: 100, y: 170 },
        { id: 'B', label: 'B', x: 280, y: 100 },
        { id: 'C', label: 'C', x: 280, y: 240 },
        { id: 'D', label: 'D', x: 460, y: 100 },
        { id: 'E', label: 'E', x: 460, y: 240 },
        { id: 'F', label: 'F', x: 620, y: 170 },
      ]);
      setEdges([
        { from: 'A', to: 'B', weight: 3 },
        { from: 'A', to: 'C', weight: 5 },
        { from: 'B', to: 'D', weight: 2 },
        { from: 'D', to: 'E', weight: -5 },
        { from: 'E', to: 'B', weight: 1 }, // Cycle: 2 + (-5) + 1 = -2
        { from: 'E', to: 'F', weight: 4 },
      ]);
      setSourceId('A');
      setDestinationId('F');
    } else {
      setNodes([
        { id: 'A', label: 'A', x: 120, y: 170 },
        { id: 'B', label: 'B', x: 300, y: 100 },
        { id: 'C', label: 'C', x: 300, y: 240 },
        { id: 'D', label: 'D (Unreachable)', x: 550, y: 170 },
      ]);
      setEdges([
        { from: 'A', to: 'B', weight: 4 },
        { from: 'B', to: 'C', weight: -2 },
        { from: 'C', to: 'A', weight: 3 },
      ]);
      setSourceId('A');
      setDestinationId('D');
    }
  };

  const handleGenerateRandom = () => {
    setValidationError(null);
    const newN: BFNode[] = [
      { id: 'A', label: 'A', x: 100, y: 170 },
      { id: 'B', label: 'B', x: 280, y: 80 },
      { id: 'C', label: 'C', x: 280, y: 260 },
      { id: 'D', label: 'D', x: 460, y: 80 },
      { id: 'E', label: 'E', x: 460, y: 260 },
      { id: 'F', label: 'F', x: 620, y: 170 },
    ];

    // Generate random weights between -3 and 8
    const randWeight = () => Math.floor(Math.random() * 12) - 3;

    const newE: BFEdge[] = [
      { from: 'A', to: 'B', weight: Math.max(1, randWeight()) },
      { from: 'A', to: 'C', weight: Math.max(1, randWeight()) },
      { from: 'B', to: 'D', weight: randWeight() },
      { from: 'C', to: 'E', weight: randWeight() },
      { from: 'B', to: 'C', weight: randWeight() },
      { from: 'D', to: 'F', weight: randWeight() },
      { from: 'E', to: 'F', weight: randWeight() },
      { from: 'E', to: 'D', weight: randWeight() },
    ];

    setNodes(newN);
    setEdges(newE);
    setSourceId('A');
    setDestinationId('F');
  };

  // Node Management
  const handleAddNode = () => {
    const rawId = newNodeId.trim().toUpperCase();
    if (!rawId) {
      setValidationError('Please enter a vertex ID (e.g. "G").');
      return;
    }
    if (nodes.some((n) => n.id.toUpperCase() === rawId)) {
      setValidationError(`Vertex "${rawId}" already exists.`);
      return;
    }
    if (nodes.length >= 8) {
      setValidationError('Maximum 8 vertices supported for clean diagram layout.');
      return;
    }

    setValidationError(null);
    const count = nodes.length;
    const xPos = 200 + (count % 3) * 150;
    const yPos = 80 + Math.floor(count / 3) * 110;

    const newNode: BFNode = {
      id: rawId,
      label: rawId,
      x: Math.min(xPos, 600),
      y: Math.min(yPos, 280),
    };

    setNodes([...nodes, newNode]);
    setNewNodeId('');
  };

  const handleRemoveNode = (idToRemove: string) => {
    if (nodes.length <= 2) {
      setValidationError('At least 2 vertices are required in the graph.');
      return;
    }

    setValidationError(null);
    const remainingNodes = nodes.filter((n) => n.id !== idToRemove);
    const remainingEdges = edges.filter(
      (e) => e.from !== idToRemove && e.to !== idToRemove
    );

    if (sourceId === idToRemove) {
      setSourceId(remainingNodes[0].id);
    }
    if (destinationId === idToRemove) {
      setDestinationId('');
    }

    setNodes(remainingNodes);
    setEdges(remainingEdges);
  };

  // Edge Management
  const handleAddEdge = () => {
    const fromNode = effectiveNewEdgeFrom;
    const toNode = effectiveNewEdgeTo;
    if (!fromNode || !toNode || fromNode === toNode) {
      setValidationError('Self-loops are omitted in this shortest-path demonstration.');
      return;
    }
    if (!Number.isInteger(newEdgeWeight)) {
      setValidationError('Edge weight must be an integer (negative weights are supported).');
      return;
    }
    if (edges.some((e) => e.from === fromNode && e.to === toNode)) {
      setValidationError(`Directed edge ${fromNode} → ${toNode} already exists.`);
      return;
    }

    setValidationError(null);
    setEdges([
      ...edges,
      { from: fromNode, to: toNode, weight: newEdgeWeight },
    ]);
  };

  const handleRemoveEdge = (from: string, to: string) => {
    setValidationError(null);
    setEdges(edges.filter((e) => !(e.from === from && e.to === to)));
  };

  const handleUpdateEdgeWeight = (from: string, to: string, val: number) => {
    if (!Number.isInteger(val)) return;
    setEdges(
      edges.map((e) => (e.from === from && e.to === to ? { ...e, weight: val } : e))
    );
  };

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextStep, prevStep, reset]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Heading Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="clay-badge px-3 py-1 text-xs font-medium text-purple-300 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-accent-primary" />
                Shortest Path
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(V · E)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(V)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              Bellman-Ford Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Compute single-source shortest paths on weighted directed graphs. Configure vertices, directed edges, and positive/negative weights. Detect reachable negative cycles and reconstruct optimal paths.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>DP Edge Relaxation & Cycle Audit</span>
          </div>
        </div>
      </section>

      {/* Graph Editor Controls */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-5">
          {/* Top Bar: Source / Optional Destination / Presets / Run */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
            {/* Source & Destination Selectors */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-txt-secondary">Source (Start):</label>
                <select
                  value={effectiveSourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2.5 py-1 text-xs font-mono text-purple-300 bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`bf-src-${n.id}`} value={n.id}>
                      {n.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-txt-secondary">Destination (Target):</label>
                <select
                  value={effectiveDestinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2.5 py-1 text-xs font-mono text-emerald-300 bg-[#161922] focus:outline-none"
                >
                  <option value="">None (All-Pairs Single Source)</option>
                  {nodes
                    .filter((n) => n.id !== effectiveSourceId)
                    .map((n) => (
                      <option key={`bf-dst-${n.id}`} value={n.id}>
                        {n.id}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Presets Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-txt-muted flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-accent-secondary" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => handleLoadPreset('standard')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Standard (Negative Weights)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('negative_cycle')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Negative Cycle
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('unreachable')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Unreachable
              </button>
              <button
                type="button"
                onClick={handleGenerateRandom}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs flex items-center gap-1"
              >
                <Dice5 className="w-3 h-3 text-accent-primary" />
                Random Graph
              </button>
              <button
                type="button"
                onClick={() => {
                  setNodes(DEFAULT_BF_NODES);
                  setEdges(DEFAULT_BF_EDGES);
                  setSourceId('A');
                  setDestinationId('F');
                  setValidationError(null);
                }}
                disabled={isPlaying}
                title="Reset to default graph"
                className="clay-button px-2 py-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                reset();
                play();
              }}
              className="clay-button clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Bellman-Ford</span>
            </button>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 p-2.5 rounded border border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Graph Editing Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Vertices Manager */}
            <div className="clay-card p-3.5 rounded-clay-sm">
              <div className="text-xs font-semibold text-txt-primary mb-2 flex items-center justify-between">
                <span>Vertices ({nodes.length})</span>
                <span className="text-[11px] text-txt-muted">Click × to delete</span>
              </div>

              {/* Add Node Form */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  maxLength={3}
                  placeholder="ID (e.g. G)"
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value.toUpperCase())}
                  disabled={isPlaying}
                  className="clay-inset px-2.5 py-1 text-xs font-mono text-txt-primary w-24 bg-[#161922] uppercase focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNode}
                  disabled={isPlaying || !newNodeId.trim()}
                  className="clay-button px-3 py-1 text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-accent-secondary" /> Add Vertex
                </button>
              </div>

              {/* Node Badges */}
              <div className="flex flex-wrap gap-2">
                {nodes.map((n) => {
                  const isSrc = n.id === sourceId;
                  const isDst = n.id === destinationId;
                  return (
                    <div
                      key={`bf-node-${n.id}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                        isSrc
                          ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
                          : isDst
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#181B22] border-white/10 text-txt-secondary'
                      }`}
                    >
                      <span>{n.id}</span>
                      {isSrc && <span className="text-[9px] text-purple-400 font-sans">SRC</span>}
                      {isDst && <span className="text-[9px] text-emerald-400 font-sans">DST</span>}
                      <button
                        type="button"
                        onClick={() => handleRemoveNode(n.id)}
                        disabled={isPlaying || nodes.length <= 2}
                        title={`Remove vertex ${n.id}`}
                        className="ml-1 text-txt-muted hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Directed Edge Creation & Inline Editor */}
            <div className="clay-card p-3.5 rounded-clay-sm">
              <div className="text-xs font-semibold text-txt-primary mb-2">
                Add Directed Edge (Negative Weights Allowed)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={effectiveNewEdgeFrom}
                  onChange={(e) => setNewEdgeFrom(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2 py-1 text-xs font-mono text-txt-primary bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`bf-from-${n.id}`} value={n.id}>
                      {n.id}
                    </option>
                  ))}
                </select>

                <ArrowRight className="w-3.5 h-3.5 text-txt-muted" />

                <select
                  value={effectiveNewEdgeTo}
                  onChange={(e) => setNewEdgeTo(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2 py-1 text-xs font-mono text-txt-primary bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`bf-to-${n.id}`} value={n.id}>
                      {n.id}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-txt-muted">Weight:</span>
                  <input
                    type="number"
                    min={-99}
                    max={99}
                    value={newEdgeWeight}
                    onChange={(e) => setNewEdgeWeight(parseInt(e.target.value) || 0)}
                    disabled={isPlaying}
                    className="clay-inset px-2 py-1 text-xs font-mono text-cyan-300 w-16 bg-[#161922] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddEdge}
                  disabled={isPlaying}
                  className="clay-button px-3 py-1 text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-accent-primary" /> Add Edge
                </button>
              </div>

              {/* Edge List Mini-Scroll */}
              <div className="mt-3">
                <div className="text-[11px] text-txt-muted mb-1 flex items-center justify-between">
                  <span>Configured Edges ({edges.length})</span>
                  <span>Inline Weight Editor</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {edges.map((e) => (
                    <div
                      key={`bf-edge-${e.from}-${e.to}`}
                      className="flex items-center justify-between px-2 py-0.5 bg-[#14161C] rounded border border-white/5 text-xs font-mono"
                    >
                      <span className="text-txt-primary">
                        {e.from} → {e.to}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-txt-muted">w:</span>
                        <input
                          type="number"
                          min={-99}
                          max={99}
                          value={e.weight}
                          onChange={(ev) =>
                            handleUpdateEdgeWeight(e.from, e.to, parseInt(ev.target.value) || 0)
                          }
                          disabled={isPlaying}
                          className={`w-14 clay-inset px-1.5 py-0.5 text-[11px] font-mono bg-[#161922] focus:outline-none text-right ${
                            e.weight < 0 ? 'text-red-400 font-bold' : 'text-cyan-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEdge(e.from, e.to)}
                          disabled={isPlaying}
                          title="Delete edge"
                          className="text-txt-muted hover:text-red-400 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer Panel */}
      {currentStep && <BellmanFordVisualizer step={currentStep} />}

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        speedIndex={speedIndex}
        currentPhase={currentStep?.phase}
        onPlay={play}
        onPause={pause}
        onTogglePlay={togglePlay}
        onNext={nextStep}
        onPrev={prevStep}
        onReset={reset}
        onJumpToStep={jumpToStep}
        onSpeedChange={setSpeedIndex}
      />

      {/* Live Explanation */}
      {currentStep && <StepExplanation step={currentStep} />}

      {/* Code & Complexity Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CodePanel
          activeLine={currentStep?.codeLine || 1}
          metadata={BELLMAN_FORD_METADATA}
          title="Bellman-Ford Pseudocode"
        />
        <ComplexityPanel
          metadata={BELLMAN_FORD_METADATA}
          customNote="Bellman-Ford iterates |V| - 1 times, relaxing all |E| edges per pass in O(V · E) time. A final pass verifies that no edge can still decrease distance, detecting negative cycles."
        />
      </div>
    </main>
  );
};
