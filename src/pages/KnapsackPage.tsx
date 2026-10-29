import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Package, Sparkles, Database, Bookmark } from 'lucide-react';
import {
  generateKnapsackSteps,
  KNAPSACK_METADATA,
  DEFAULT_KNAPSACK_ITEMS,
  DEFAULT_KNAPSACK_CAPACITY,
} from '../algorithms/dp/knapsack';
import type { KnapsackItem } from '../engine/types';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { KnapsackVisualizer } from '../components/visualizer/knapsack/KnapsackVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const KnapsackPage: React.FC = () => {
  const [items, setItems] = useState<KnapsackItem[]>(DEFAULT_KNAPSACK_ITEMS);
  const [capacity, setCapacity] = useState<number>(DEFAULT_KNAPSACK_CAPACITY);

  const executionResult = useMemo(() => {
    return generateKnapsackSteps(items, capacity);
  }, [items, capacity]);

  const handleComplete = useCallback(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#A78BFA', '#86EFAC', '#67E8F9', '#FBBF24'],
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

  // Preset Configurations
  const handleLoadPreset = (type: 'default' | 'dense' | 'lightweight' | 'tight') => {
    if (type === 'default') {
      setItems(DEFAULT_KNAPSACK_ITEMS);
      setCapacity(8);
    } else if (type === 'dense') {
      setItems([
        { id: 1, name: 'Gold Bar', weight: 4, value: 10 },
        { id: 2, name: 'Silver Cup', weight: 3, value: 7 },
        { id: 3, name: 'Bronze Shield', weight: 5, value: 9 },
        { id: 4, name: 'Jeweled Dagger', weight: 2, value: 6 },
      ]);
      setCapacity(9);
    } else if (type === 'lightweight') {
      setItems([
        { id: 1, name: 'Ring of Power', weight: 1, value: 8 },
        { id: 2, name: 'Healing Potion', weight: 2, value: 5 },
        { id: 3, name: 'Spell Scroll', weight: 1, value: 4 },
        { id: 4, name: 'Magic Cloak', weight: 3, value: 10 },
      ]);
      setCapacity(5);
    } else {
      setItems([
        { id: 1, name: 'Heavy Chest', weight: 6, value: 15 },
        { id: 2, name: 'Iron Ore', weight: 5, value: 11 },
        { id: 3, name: 'Ancient Book', weight: 3, value: 8 },
      ]);
      setCapacity(7);
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
                <Database className="w-3.5 h-3.5 text-accent-primary" />
                Dynamic Programming
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(n · W)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(n · W)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              0/1 Knapsack Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Construct the 2D Dynamic Programming table cell-by-cell comparing exclusion vs inclusion, then backtrack to reconstruct the optimal item selection.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>DP Table & Traceback Engine</span>
          </div>
        </div>
      </section>

      {/* Input & Presets Toolbar */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Capacity Control */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-txt-secondary font-medium">Knapsack Capacity (W):</span>
              <input
                type="range"
                min="4"
                max="12"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isPlaying}
                className="w-28 accent-purple-400 cursor-pointer"
              />
              <span className="font-mono text-txt-primary font-bold w-6 text-center">
                {capacity}
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-txt-muted flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-accent-secondary" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => handleLoadPreset('default')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('dense')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Dense Values
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('lightweight')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Lightweight
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('tight')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Tight Cap
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              play();
            }}
            className="clay-button clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Solve Knapsack</span>
          </button>
        </div>

        {/* Live Search Metrics */}
        {currentStep && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Table Cells</div>
              <div className="text-sm font-mono font-bold text-accent-primary mt-0.5">
                {(items.length + 1) * (capacity + 1)} cells
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Current Cell</div>
              <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                DP[{currentStep.currentItemIndex}][{currentStep.currentWeight}]
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Optimal Value</div>
              <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                ${currentStep.optimalValue !== undefined ? currentStep.optimalValue : currentStep.chosenValue || 0}
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Selected Items</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                {currentStep.selectedItemIds?.length || 0} items
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Visualization Panel */}
      {currentStep && <KnapsackVisualizer step={currentStep} />}

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
          metadata={KNAPSACK_METADATA}
          title="0/1 Knapsack DP Pseudocode"
        />
        <ComplexityPanel
          metadata={KNAPSACK_METADATA}
          customNote="The DP approach solves the problem in pseudo-polynomial O(n · W) time by filling a table of size (n+1) × (W+1). Each entry is evaluated in O(1) time using previously solved subproblems."
        />
      </div>
    </main>
  );
};
