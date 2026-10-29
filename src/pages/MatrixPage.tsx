import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Grid, Sparkles, Shuffle, Bookmark, Play } from 'lucide-react';
import {
  generateMatrixSteps,
  MATRIX_MULT_METADATA,
  DEFAULT_MATRIX_A,
  DEFAULT_MATRIX_B,
} from '../algorithms/matrix/matrixMultiplication';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { MatrixVisualizer } from '../components/visualizer/matrix/MatrixVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const MatrixPage: React.FC = () => {
  const [matrixA, setMatrixA] = useState<number[][]>(DEFAULT_MATRIX_A);
  const [matrixB, setMatrixB] = useState<number[][]>(DEFAULT_MATRIX_B);

  const executionResult = useMemo(() => {
    return generateMatrixSteps(matrixA, matrixB);
  }, [matrixA, matrixB]);

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

  const handleLoadPreset = (type: 'rect' | 'square' | 'small') => {
    if (type === 'rect') {
      setMatrixA([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      setMatrixB([
        [7, 8],
        [9, 1],
        [2, 3],
      ]);
    } else if (type === 'square') {
      setMatrixA([
        [2, 0, 1],
        [3, 0, 0],
        [5, 1, 1],
      ]);
      setMatrixB([
        [1, 0, 1],
        [1, 2, 1],
        [1, 1, 0],
      ]);
    } else {
      setMatrixA([
        [1, 4],
        [2, 3],
      ]);
      setMatrixB([
        [2, 1],
        [0, 5],
      ]);
    }
  };

  const handleRandomize = () => {
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    const newA = Array.from({ length: rowsA }, () =>
      Array.from({ length: colsA }, () => Math.floor(Math.random() * 9) + 1)
    );
    const newB = Array.from({ length: rowsB }, () =>
      Array.from({ length: colsB }, () => Math.floor(Math.random() * 9) + 1)
    );
    setMatrixA(newA);
    setMatrixB(newB);
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
                <Grid className="w-3.5 h-3.5 text-accent-primary" />
                Matrix Operations
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(rA · cA · cB)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(rA · cB)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              Matrix Multiplication Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Understand standard matrix multiplication through animated row-column vector dot products, step-by-step element pairings, and real-time expression building.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Interactive Dot Product Engine</span>
          </div>
        </div>
      </section>

      {/* Preset & Action Bar */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-txt-muted flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-accent-secondary" /> Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadPreset('rect')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Rectangular (2×3 × 3×2)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('square')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Square (3×3 × 3×3)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('small')}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs"
            >
              Compact (2×2 × 2×2)
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              disabled={isPlaying}
              className="clay-button px-3 py-1.5 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1"
            >
              <Shuffle className="w-3.5 h-3.5 text-accent-primary" />
              <span>Randomize Values</span>
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
            <span>Multiply Matrices</span>
          </button>
        </div>
      </div>

      {/* Main Visualization Panel */}
      {currentStep && <MatrixVisualizer step={currentStep} />}

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
          metadata={MATRIX_MULT_METADATA}
          title="Matrix Multiplication Pseudocode"
        />
        <ComplexityPanel
          metadata={MATRIX_MULT_METADATA}
          customNote="Standard matrix multiplication executes in O(r_A · c_A · c_B) arithmetic operations. For square n×n matrices, this evaluates to O(n³) multiplications and additions."
        />
      </div>
    </main>
  );
};
