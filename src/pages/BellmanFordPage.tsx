import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Network, Sparkles, Bookmark, Play } from 'lucide-react';
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

  const executionResult = useMemo(() => {
    return generateBellmanFordSteps(nodes, edges, sourceId);
  }, [nodes, edges, sourceId]);

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
    if (type === 'standard') {
      setNodes(DEFAULT_BF_NODES);
      setEdges(DEFAULT_BF_EDGES);
      setSourceId('A');
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
    }
  };

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
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
              Compute single-source shortest paths while relaxing edges across |V| - 1 iterations. Handles negative edge weights and flags reachable negative-weight cycles.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Edge Relaxation & Cycle Verifier</span>
          </div>
        </div>
      </section>

      {/* Preset Toolbar */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-txt-muted flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-accent-secondary" /> Graph Scenarios:
            </span>
            <button
              type="button"
              onClick={() => handleLoadPreset('standard')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Standard (Neg Weights)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('negative_cycle')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs text-red-300 hover:text-red-200"
            >
              Negative Cycle (Trapped)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('unreachable')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              With Unreachable Nodes (∞)
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
      </div>

      {/* Main Graph Visualization Panel */}
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
          customNote="Bellman-Ford guarantees finding the shortest paths in at most |V| - 1 passes over all E edges, taking O(V · E) time. If any edge can still be relaxed in pass |V|, a negative-weight cycle is reachable."
        />
      </div>
    </main>
  );
};
