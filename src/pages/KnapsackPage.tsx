import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Package, Sparkles, Database, Bookmark, Plus, Trash2, Shuffle, AlertCircle } from 'lucide-react';
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
  const [inputError, setInputError] = useState<string | null>(null);

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

  // Item Modification Handlers
  const handleUpdateItem = (id: number, field: 'name' | 'weight' | 'value', val: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (field === 'name') return { ...it, name: val };
        const num = Number(val);
        if (field === 'weight') {
          if (num <= 0 || !Number.isInteger(num)) {
            setInputError('Weights must be positive whole numbers.');
          } else {
            setInputError(null);
          }
          return { ...it, weight: Math.max(1, num || 1) };
        } else {
          if (num < 0 || !Number.isInteger(num)) {
            setInputError('Values must be non-negative whole numbers.');
          } else {
            setInputError(null);
          }
          return { ...it, value: Math.max(0, num || 0) };
        }
      })
    );
  };

  const handleAddItem = () => {
    if (items.length >= 8) {
      setInputError('Maximum 8 items supported for clear visual display.');
      return;
    }
    const nextId = items.length > 0 ? Math.max(...items.map((it) => it.id)) + 1 : 1;
    const newItem: KnapsackItem = {
      id: nextId,
      name: `Item ${nextId}`,
      weight: Math.floor(Math.random() * 4) + 1,
      value: Math.floor(Math.random() * 8) + 2,
    };
    setInputError(null);
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length <= 1) {
      setInputError('At least 1 item is required.');
      return;
    }
    setInputError(null);
    setItems(items.filter((it) => it.id !== id));
  };

  // Preset Configurations
  const handleLoadPreset = (type: 'default' | 'dense' | 'lightweight' | 'tight' | 'zero') => {
    setInputError(null);
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
    } else if (type === 'tight') {
      setItems([
        { id: 1, name: 'Heavy Chest', weight: 6, value: 15 },
        { id: 2, name: 'Iron Ore', weight: 5, value: 11 },
        { id: 3, name: 'Ancient Book', weight: 3, value: 8 },
      ]);
      setCapacity(7);
    } else {
      // Capacity zero edge case
      setItems(DEFAULT_KNAPSACK_ITEMS);
      setCapacity(0);
    }
  };

  const handleRandomize = () => {
    setInputError(null);
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
    const randItems: KnapsackItem[] = [];
    const names = ['Gem', 'Relic', 'Crystal', 'Scroll', 'Amulet', 'Tome', 'Goblet'];
    for (let i = 1; i <= count; i++) {
      randItems.push({
        id: i,
        name: `${names[i - 1] || 'Item ' + i}`,
        weight: Math.floor(Math.random() * 5) + 1,
        value: Math.floor(Math.random() * 10) + 1,
      });
    }
    setItems(randItems);
    setCapacity(Math.floor(Math.random() * 7) + 5);
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
              Configure knapsack capacity, customize item weights and values, and observe the 2D DP table construction and solution reconstruction.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Interactive DP Table & Item Editor</span>
          </div>
        </div>
      </section>

      {/* Input Configuration & Item Editor */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Top Controls: Capacity & Item Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-txt-secondary font-medium">Knapsack Capacity (W):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  disabled={isPlaying}
                  className="w-28 accent-purple-400 cursor-pointer"
                />
                <span className="font-mono text-txt-primary font-bold text-xs bg-[#161920] px-2.5 py-0.5 rounded border border-white/5">
                  {capacity} kg
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddItem}
                disabled={isPlaying || items.length >= 8}
                className="clay-button px-3 py-1.5 text-xs text-emerald-300 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>

              <button
                type="button"
                onClick={handleRandomize}
                disabled={isPlaying}
                className="clay-button px-3 py-1.5 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5 text-accent-primary" />
                <span>Random Items</span>
              </button>
            </div>
          </div>

          {/* Editable Items Table */}
          <div className="clay-inset p-3 rounded-clay-sm overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-txt-muted text-[11px]">
                  <th className="pb-1.5 pl-1">Item Name</th>
                  <th className="pb-1.5">Weight (kg)</th>
                  <th className="pb-1.5">Value ($)</th>
                  <th className="pb-1.5 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-1.5 pl-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        disabled={isPlaying}
                        className="bg-transparent text-txt-primary border-b border-white/10 focus:border-accent-primary focus:outline-none w-36 py-0.5 text-xs font-sans font-medium"
                      />
                    </td>
                    <td className="py-1.5">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.weight}
                        onChange={(e) => handleUpdateItem(item.id, 'weight', e.target.value)}
                        disabled={isPlaying}
                        className="w-16 bg-[#161920] text-cyan-300 px-2 py-0.5 rounded border border-white/5 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                    </td>
                    <td className="py-1.5">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={item.value}
                        onChange={(e) => handleUpdateItem(item.id, 'value', e.target.value)}
                        disabled={isPlaying}
                        className="w-16 bg-[#161920] text-amber-300 px-2 py-0.5 rounded border border-white/5 focus:outline-none focus:border-amber-400 font-mono text-xs font-semibold"
                      />
                    </td>
                    <td className="py-1.5 text-right pr-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isPlaying || items.length <= 1}
                        className="text-txt-muted hover:text-red-400 p-1 transition-colors disabled:opacity-30"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {inputError && (
            <div className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Presets and Solve Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-txt-muted flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-accent-secondary" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => handleLoadPreset('default')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Default (4 items)
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
                Tight Capacity
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('zero')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs text-amber-300"
              >
                Capacity = 0
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
              <Package className="w-4 h-4" />
              <span>Solve Knapsack</span>
            </button>
          </div>
        </div>
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
