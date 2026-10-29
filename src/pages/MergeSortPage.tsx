import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Layers } from 'lucide-react';
import { generateMergeSortSteps } from '../algorithms/sorting/mergeSort';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { ArrayInput } from '../components/visualizer/ArrayInput';
import { ArrayVisualizer } from '../components/visualizer/ArrayVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

const INITIAL_EXAMPLE = [38, 12, 27, 43, 9, 31, 18];

export const MergeSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>(INITIAL_EXAMPLE);

  // Generate deterministic steps whenever the array updates
  const executionResult = useMemo(() => {
    return generateMergeSortSteps(array);
  }, [array]);

  const handleSortingComplete = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#A78BFA', '#67E8F9', '#86EFAC', '#FBBF24'],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback if confetti canvas cannot initialize
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
    onComplete: handleSortingComplete,
  });

  // Handle new array input applied
  const handleApplyArray = (newArray: number[]) => {
    setArray(newArray);
  };

  // Handle "Sort Array" button: apply and immediately start playing
  const handleSortAndPlay = (newArray: number[]) => {
    setArray(newArray);
    setTimeout(() => {
      play();
    }, 50);
  };

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

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
                Divide and Conquer
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(n log n)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(n)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              Merge Sort Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Explore Divide and Conquer through interactive sorting. Merge Sort recursively divides an array into smaller subarrays, sorts them, and merges the sorted segments back together.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Interactive Educational Sandbox</span>
          </div>
        </div>
      </section>

      {/* Array Input & Configuration Panel */}
      <ArrayInput
        currentArray={array}
        onApplyArray={handleApplyArray}
        onSortAndPlay={handleSortAndPlay}
        isSorting={isPlaying}
      />

      {/* Main Bar Visualization Panel */}
      {currentStep && <ArrayVisualizer step={currentStep} />}

      {/* Playback Controls Panel */}
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

      {/* Live Explanation Panel */}
      {currentStep && <StepExplanation step={currentStep} />}

      {/* Side-by-Side or Stacked Panels: Code & Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CodePanel activeLine={currentStep?.codeLine || 1} />
        <ComplexityPanel />
      </div>
    </main>
  );
};
