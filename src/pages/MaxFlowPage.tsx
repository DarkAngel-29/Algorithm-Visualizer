import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GitBranch, Sparkles, Bookmark, Play } from 'lucide-react';
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

  const executionResult = useMemo(() => {
    return generateMaxFlowSteps(nodes, edges, 's', 't');
  }, [nodes, edges]);

  const handleComplete = useCallback(() => {
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
  }, []);

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

  const handleLoadPreset = (type: 'classic' | 'diamond' | 'bottleneck') => {
    if (type === 'classic') {
      setNodes(DEFAULT_FLOW_NODES);
      setEdges(DEFAULT_FLOW_EDGES);
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
              Simulate the Edmonds-Karp algorithm. Discover shortest augmenting paths using BFS in the residual network, push bottleneck flow, and identify the minimum cut.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Residual Network & BFS Engine</span>
          </div>
        </div>
      </section>

      {/* Preset Toolbar */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-txt-muted flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-accent-secondary" /> Network Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadPreset('classic')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Classic 6-Node Network
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('diamond')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Diamond Network
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('bottleneck')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Single Bottleneck
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
            <span>Run Edmonds-Karp</span>
          </button>
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
