import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Layers, Sparkles, Bookmark, Play, Plus, Trash2, Shuffle, AlertCircle } from 'lucide-react';
import {
  generateMatrixChainSteps,
  MATRIX_CHAIN_METADATA,
  DEFAULT_MCM_DIMENSIONS,
} from '../algorithms/matrix/matrixChain';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { MatrixChainVisualizer } from '../components/visualizer/matrix/MatrixChainVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const MatrixChainPage: React.FC = () => {
  const [dimensions, setDimensions] = useState<number[]>(DEFAULT_MCM_DIMENSIONS);
  const [dimInputString, setDimInputString] = useState<string>(DEFAULT_MCM_DIMENSIONS.join(', '));
  const [inputError, setInputError] = useState<string | null>(null);

  const executionResult = useMemo(() => {
    return generateMatrixChainSteps(dimensions);
  }, [dimensions]);

  const handleComplete = useCallback(() => {
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

  const handleParseDimensionString = (str: string) => {
    setDimInputString(str);
    const parts = str.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length < 3) {
      setInputError('Matrix Chain Multiplication requires at least 3 dimensions (2 matrices).');
      return;
    }
    if (parts.length > 11) {
      setInputError('Maximum 10 matrices (11 dimensions) supported for clear visualization.');
      return;
    }

    const nums: number[] = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isInteger(n) || n <= 0) {
        setInputError(`"${p}" is not a valid positive dimension integer.`);
        return;
      }
      nums.push(n);
    }

    setInputError(null);
    setDimensions(nums);
  };

  const handleLoadPreset = (preset: number[]) => {
    setInputError(null);
    setDimensions(preset);
    setDimInputString(preset.join(', '));
  };

  const handleRandomize = () => {
    const matrixCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 matrices
    const randDims: number[] = [];
    for (let i = 0; i <= matrixCount; i++) {
      randDims.push(Math.floor(Math.random() * 8 + 1) * 5); // multiples of 5: 5, 10, 15...40
    }
    setInputError(null);
    setDimensions(randDims);
    setDimInputString(randDims.join(', '));
  };

  const handleAddMatrix = () => {
    if (dimensions.length >= 11) {
      setInputError('Maximum 10 matrices supported.');
      return;
    }
    const newDim = Math.floor(Math.random() * 6 + 1) * 10;
    const newDims = [...dimensions, newDim];
    setInputError(null);
    setDimensions(newDims);
    setDimInputString(newDims.join(', '));
  };

  const handleRemoveMatrix = () => {
    if (dimensions.length <= 3) {
      setInputError('At least 2 matrices are required.');
      return;
    }
    const newDims = dimensions.slice(0, -1);
    setInputError(null);
    setDimensions(newDims);
    setDimInputString(newDims.join(', '));
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
                <Layers className="w-3.5 h-3.5 text-accent-primary" />
                Dynamic Programming
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(n³)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(n²)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              Matrix Chain Multiplication Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Determine the optimal parenthesization of a chain of matrices to minimize total scalar multiplications using bottom-up dynamic programming.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Optimal Parenthesization DP</span>
          </div>
        </div>
      </section>

      {/* Matrix Dimensions Configuration Toolbar */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-txt-secondary font-medium mb-1 block">
              Dimension Sequence (Length n+1 for n matrices, e.g. 10, 30, 5, 60):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={dimInputString}
                onChange={(e) => handleParseDimensionString(e.target.value)}
                disabled={isPlaying}
                placeholder="e.g. 10, 30, 5, 60"
                className="flex-1 clay-inset px-3.5 py-2 text-xs font-mono text-txt-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/60"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddMatrix}
                  disabled={isPlaying || dimensions.length >= 11}
                  className="clay-button px-3 py-2 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1"
                  title="Add matrix to chain"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveMatrix}
                  disabled={isPlaying || dimensions.length <= 3}
                  className="clay-button px-3 py-2 text-xs text-txt-secondary hover:text-red-300 flex items-center gap-1"
                  title="Remove last matrix"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {inputError && (
            <div className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Presets and Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-txt-muted flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-accent-secondary" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => handleLoadPreset([10, 30, 5, 60])}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Classic 3 Matrices [10, 30, 5, 60]
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset([40, 20, 30, 10, 30])}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                4 Matrices [40, 20, 30, 10, 30]
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset([30, 35, 15, 5, 10, 20, 25])}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                CLRS 6 Matrices
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1"
              >
                <Shuffle className="w-3 h-3 text-accent-primary" />
                <span>Random</span>
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
              <span>Compute Optimal Chain</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main MCM Visualizer */}
      {currentStep && <MatrixChainVisualizer step={currentStep} />}

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
          metadata={MATRIX_CHAIN_METADATA}
          title="Matrix Chain Multiplication Pseudocode"
        />
        <ComplexityPanel
          metadata={MATRIX_CHAIN_METADATA}
          customNote="For n matrices, there are O(n²) subproblems corresponding to all pairs (i, j) with 1 ≤ i ≤ j ≤ n. For each subproblem of length L, testing all split points k takes O(L) time, yielding total time O(n³) and table space O(n²)."
        />
      </div>
    </main>
  );
};
