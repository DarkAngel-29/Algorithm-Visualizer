import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GitBranch,
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
  generateMaxFlowSteps,
  MAX_FLOW_METADATA,
  DEFAULT_FLOW_NODES,
  DEFAULT_FLOW_EDGES,
} from '../algorithms/flow/edmondsKarp';
import type { FlowNode, FlowEdge } from '../engine/types';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { NetworkFlowVisualizer } from '../components/visualizer/flow/NetworkFlowVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const MaxFlowPage: React.FC = () => {
  const [nodes, setNodes] = useState<FlowNode[]>(DEFAULT_FLOW_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(DEFAULT_FLOW_EDGES);
  const [sourceId, setSourceId] = useState<string>('s');
  const [sinkId, setSinkId] = useState<string>('t');

  // Input states for new node / new edge
  const [newNodeId, setNewNodeId] = useState<string>('');
  const [newEdgeFrom, setNewEdgeFrom] = useState<string>('s');
  const [newEdgeTo, setNewEdgeTo] = useState<string>('u');
  const [newEdgeCapacity, setNewEdgeCapacity] = useState<number>(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  const effectiveSourceId = nodes.some((n) => n.id === sourceId) ? sourceId : nodes[0]?.id || 's';
  const effectiveSinkId = nodes.some((n) => n.id === sinkId) ? sinkId : nodes[nodes.length - 1]?.id || 't';
  const effectiveNewEdgeFrom = nodes.some((n) => n.id === newEdgeFrom) ? newEdgeFrom : nodes[0]?.id || '';
  const effectiveNewEdgeTo = nodes.some((n) => n.id === newEdgeTo) ? newEdgeTo : nodes[nodes.length - 1]?.id || '';

  const executionResult = useMemo(() => {
    return generateMaxFlowSteps(nodes, edges, effectiveSourceId, effectiveSinkId);
  }, [nodes, edges, effectiveSourceId, effectiveSinkId]);

  const handleComplete = useCallback(() => {
    if (executionResult.maxFlow > 0) {
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#67E8F9', '#A78BFA', '#86EFAC', '#FBBF24'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback
      }
    }
  }, [executionResult.maxFlow]);

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

  // Load Presets
  const handleLoadPreset = (type: 'classic' | 'diamond' | 'bottleneck') => {
    setValidationError(null);
    if (type === 'classic') {
      setNodes(DEFAULT_FLOW_NODES);
      setEdges(DEFAULT_FLOW_EDGES);
      setSourceId('s');
      setSinkId('t');
    } else if (type === 'diamond') {
      setNodes([
        { id: 's', label: 'Source', x: 120, y: 170, isSource: true },
        { id: 'a', label: 'A', x: 350, y: 80 },
        { id: 'b', label: 'B', x: 350, y: 260 },
        { id: 't', label: 'Sink', x: 580, y: 170, isSink: true },
      ]);
      setEdges([
        { from: 's', to: 'a', capacity: 10, flow: 0 },
        { from: 's', to: 'b', capacity: 10, flow: 0 },
        { from: 'a', to: 'b', capacity: 2, flow: 0 },
        { from: 'a', to: 't', capacity: 10, flow: 0 },
        { from: 'b', to: 't', capacity: 10, flow: 0 },
      ]);
      setSourceId('s');
      setSinkId('t');
    } else {
      setNodes([
        { id: 's', label: 'Source', x: 100, y: 170, isSource: true },
        { id: 'u', label: 'U', x: 280, y: 120 },
        { id: 'v', label: 'V', x: 440, y: 120 },
        { id: 't', label: 'Sink', x: 600, y: 170, isSink: true },
      ]);
      setEdges([
        { from: 's', to: 'u', capacity: 15, flow: 0 },
        { from: 'u', to: 'v', capacity: 5, flow: 0 },
        { from: 'v', to: 't', capacity: 15, flow: 0 },
      ]);
      setSourceId('s');
      setSinkId('t');
    }
  };

  // Generate Random Graph
  const handleGenerateRandom = () => {
    setValidationError(null);
    const newN: FlowNode[] = [
      { id: 'S', label: 'S', x: 100, y: 170, isSource: true },
      { id: 'A', label: 'A', x: 280, y: 90 },
      { id: 'B', label: 'B', x: 280, y: 250 },
      { id: 'C', label: 'C', x: 460, y: 170 },
      { id: 'T', label: 'T', x: 620, y: 170, isSink: true },
    ];

    const randCap = () => Math.floor(Math.random() * 15) + 5; // 5 to 19

    const newE: FlowEdge[] = [
      { from: 'S', to: 'A', capacity: randCap(), flow: 0 },
      { from: 'S', to: 'B', capacity: randCap(), flow: 0 },
      { from: 'A', to: 'C', capacity: randCap(), flow: 0 },
      { from: 'B', to: 'C', capacity: randCap(), flow: 0 },
      { from: 'A', to: 'B', capacity: randCap(), flow: 0 },
      { from: 'C', to: 'T', capacity: randCap(), flow: 0 },
      { from: 'B', to: 'T', capacity: randCap(), flow: 0 },
    ];

    setNodes(newN);
    setEdges(newE);
    setSourceId('S');
    setSinkId('T');
  };

  // Node Management
  const handleAddNode = () => {
    const rawId = newNodeId.trim().toUpperCase();
    if (!rawId) {
      setValidationError('Please enter a node identifier (e.g. "X").');
      return;
    }
    if (nodes.some((n) => n.id.toUpperCase() === rawId)) {
      setValidationError(`A vertex with ID "${rawId}" already exists.`);
      return;
    }
    if (nodes.length >= 8) {
      setValidationError('Maximum 8 vertices supported for optimal diagram visibility.');
      return;
    }

    setValidationError(null);
    // Position newly added node automatically
    const count = nodes.length;
    const xPos = 200 + (count % 3) * 150;
    const yPos = 80 + Math.floor(count / 3) * 110;

    const newNode: FlowNode = {
      id: rawId,
      label: rawId,
      x: Math.min(xPos, 580),
      y: Math.min(yPos, 280),
    };

    setNodes([...nodes, newNode]);
    setNewNodeId('');
  };

  const handleRemoveNode = (idToRemove: string) => {
    if (nodes.length <= 2) {
      setValidationError('A flow network requires at least 2 vertices (Source and Sink).');
      return;
    }

    setValidationError(null);
    const remainingNodes = nodes.filter((n) => n.id !== idToRemove);
    const remainingEdges = edges.filter(
      (e) => e.from !== idToRemove && e.to !== idToRemove
    );

    // Reassign source/sink if removed node was currently selected
    if (sourceId === idToRemove) {
      const nextSource = remainingNodes.find((n) => n.id !== sinkId) || remainingNodes[0];
      setSourceId(nextSource.id);
    }
    if (sinkId === idToRemove) {
      const nextSink = remainingNodes.find((n) => n.id !== sourceId) || remainingNodes[remainingNodes.length - 1];
      setSinkId(nextSink.id);
    }

    setNodes(remainingNodes);
    setEdges(remainingEdges);
  };

  // Edge Management
  const handleAddEdge = () => {
    const fromNode = effectiveNewEdgeFrom;
    const toNode = effectiveNewEdgeTo;
    if (!fromNode || !toNode || fromNode === toNode) {
      setValidationError('Self-loops are not allowed in this network flow model.');
      return;
    }
    if (newEdgeCapacity <= 0 || !Number.isInteger(newEdgeCapacity)) {
      setValidationError('Edge capacity must be a positive integer.');
      return;
    }
    if (edges.some((e) => e.from === fromNode && e.to === toNode)) {
      setValidationError(`Directed edge ${fromNode} → ${toNode} already exists.`);
      return;
    }

    setValidationError(null);
    setEdges([
      ...edges,
      { from: fromNode, to: toNode, capacity: newEdgeCapacity, flow: 0 },
    ]);
  };

  const handleRemoveEdge = (from: string, to: string) => {
    setValidationError(null);
    setEdges(edges.filter((e) => !(e.from === from && e.to === to)));
  };

  const handleUpdateEdgeCapacity = (from: string, to: string, val: number) => {
    if (val <= 0 || !Number.isInteger(val)) return;
    setEdges(
      edges.map((e) => (e.from === from && e.to === to ? { ...e, capacity: val } : e))
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
                <GitBranch className="w-3.5 h-3.5 text-accent-primary" />
                Network Flow
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(V · E²)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(V + E)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              Maximum Flow Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Simulate the Edmonds-Karp algorithm. Configure custom vertices, directed edges, and capacities. Discover shortest augmenting paths using BFS in the residual network, push bottleneck flow, and identify the minimum cut.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Residual Network & BFS Engine</span>
          </div>
        </div>
      </section>

      {/* Graph Editor Controls */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-5">
          {/* Top Bar: Source / Sink / Presets / Run */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
            {/* Source & Sink Selectors */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-txt-secondary">Source (S):</label>
                <select
                  value={effectiveSourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2.5 py-1 text-xs font-mono text-purple-300 bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`src-${n.id}`} value={n.id}>
                      {n.id.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-txt-secondary">Sink (T):</label>
                <select
                  value={effectiveSinkId}
                  onChange={(e) => setSinkId(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2.5 py-1 text-xs font-mono text-cyan-300 bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`sink-${n.id}`} value={n.id}>
                      {n.id.toUpperCase()}
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
                onClick={() => handleLoadPreset('classic')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Classic 6-Node
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('diamond')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Diamond
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('bottleneck')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Bottleneck
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
                  setNodes(DEFAULT_FLOW_NODES);
                  setEdges(DEFAULT_FLOW_EDGES);
                  setSourceId('s');
                  setSinkId('t');
                  setValidationError(null);
                }}
                disabled={isPlaying}
                title="Reset to initial default graph"
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
              disabled={sourceId === sinkId}
              className="clay-button clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Edmonds-Karp</span>
            </button>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 p-2.5 rounded border border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {sourceId === sinkId && (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Source and Sink cannot be the same vertex. Please select distinct vertices.</span>
            </div>
          )}

          {/* Graph Editing Subsections */}
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
                  placeholder="ID (e.g. Y)"
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
                  const isSnk = n.id === sinkId;
                  return (
                    <div
                      key={`node-tag-${n.id}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                        isSrc
                          ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
                          : isSnk
                          ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                          : 'bg-[#181B22] border-white/10 text-txt-secondary'
                      }`}
                    >
                      <span>{n.id.toUpperCase()}</span>
                      {isSrc && <span className="text-[9px] text-purple-400 font-sans">SRC</span>}
                      {isSnk && <span className="text-[9px] text-cyan-400 font-sans">SNK</span>}
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

            {/* Edge Creation Form */}
            <div className="clay-card p-3.5 rounded-clay-sm">
              <div className="text-xs font-semibold text-txt-primary mb-2">
                Add Directed Edge
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={effectiveNewEdgeFrom}
                  onChange={(e) => setNewEdgeFrom(e.target.value)}
                  disabled={isPlaying}
                  className="clay-inset px-2 py-1 text-xs font-mono text-txt-primary bg-[#161922] focus:outline-none"
                >
                  {nodes.map((n) => (
                    <option key={`from-${n.id}`} value={n.id}>
                      {n.id.toUpperCase()}
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
                    <option key={`to-${n.id}`} value={n.id}>
                      {n.id.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-txt-muted">Cap:</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={newEdgeCapacity}
                    onChange={(e) => setNewEdgeCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={isPlaying}
                    className="clay-inset px-2 py-1 text-xs font-mono text-emerald-300 w-16 bg-[#161922] focus:outline-none"
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
                  <span>Inline Capacity Editor</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {edges.map((e) => (
                    <div
                      key={`edge-item-${e.from}-${e.to}`}
                      className="flex items-center justify-between px-2 py-0.5 bg-[#14161C] rounded border border-white/5 text-xs font-mono"
                    >
                      <span className="text-txt-primary">
                        {e.from.toUpperCase()} → {e.to.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-txt-muted">Cap:</span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={e.capacity}
                          onChange={(ev) =>
                            handleUpdateEdgeCapacity(
                              e.from,
                              e.to,
                              Math.max(1, parseInt(ev.target.value) || 1)
                            )
                          }
                          disabled={isPlaying}
                          className="w-12 clay-inset px-1.5 py-0.5 text-[11px] font-mono text-amber-300 bg-[#161922] focus:outline-none text-right"
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

      {/* Main Flow Network Visualization Panel */}
      {currentStep && <NetworkFlowVisualizer step={currentStep} />}

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
          metadata={MAX_FLOW_METADATA}
          title="Edmonds-Karp Pseudocode"
        />
        <ComplexityPanel
          metadata={MAX_FLOW_METADATA}
          customNote="By selecting shortest augmenting paths with BFS, Edmonds-Karp guarantees termination in at most O(V · E) augmentations. Each BFS runs in O(E), yielding a worst-case time complexity of O(V · E²)."
        />
      </div>
    </main>
  );
};
