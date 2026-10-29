import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, AlertTriangle } from 'lucide-react';
import { generateNQueensSteps, N_QUEENS_METADATA } from '../algorithms/backtracking/nQueens';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { ChessBoard } from '../components/visualizer/nqueens/ChessBoard';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const NQueensPage: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(8);
  const [mode, setMode] = useState<'first' | 'all'>('first');
  const [strategy, setStrategy] = useState<'ltr' | 'middle_out' | 'rtl'>('ltr');

  // Generate deterministic steps
  const executionResult = useMemo(() => {
    return generateNQueensSteps(boardSize, mode, strategy);
  }, [boardSize, mode, strategy]);

  const handleComplete = useCallback(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FBBF24', '#A78BFA', '#86EFAC', '#67E8F9'],
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

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
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
                <Crown className="w-3.5 h-3.5 text-accent-primary" />
                Backtracking Paradigm
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(N!)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(N)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              N-Queens Backtracking Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Watch recursive backtracking position queens on an N×N board without any two queens sharing the same row, column, or diagonal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Interactive Chess Simulation</span>
          </div>
        </div>
      </section>

      {/* Configuration & Input Panel */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Board Size N Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-txt-secondary font-medium">Board Size (N):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value))}
                  disabled={isPlaying}
                  className="w-24 accent-purple-400 cursor-pointer"
                />
                <span className="font-mono text-txt-primary font-bold text-xs bg-[#161920] px-2 py-0.5 rounded border border-white/5">
                  {boardSize}×{boardSize}
                </span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-txt-secondary font-medium">Search Mode:</label>
              <div className="flex items-center bg-[#161920] p-1 rounded-clay-sm border border-white/5">
                <button
                  type="button"
                  onClick={() => setMode('first')}
                  disabled={isPlaying}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    mode === 'first'
                      ? 'bg-purple-600 text-white font-medium shadow-sm'
                      : 'text-txt-muted hover:text-txt-secondary'
                  }`}
                >
                  First Solution
                </button>
                <button
                  type="button"
                  onClick={() => setMode('all')}
                  disabled={isPlaying}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    mode === 'all'
                      ? 'bg-purple-600 text-white font-medium shadow-sm'
                      : 'text-txt-muted hover:text-txt-secondary'
                  }`}
                >
                  All Solutions
                </button>
              </div>
            </div>

            {/* Candidate Search Order */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-txt-secondary font-medium">Column Order:</label>
              <div className="flex items-center bg-[#161920] p-1 rounded-clay-sm border border-white/5">
                <button
                  type="button"
                  onClick={() => setStrategy('ltr')}
                  disabled={isPlaying}
                  className={`px-2.5 py-1 text-xs rounded transition-all ${
                    strategy === 'ltr'
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'text-txt-muted hover:text-txt-secondary'
                  }`}
                  title="Test columns from left to right"
                >
                  Left→Right
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('middle_out')}
                  disabled={isPlaying}
                  className={`px-2.5 py-1 text-xs rounded transition-all ${
                    strategy === 'middle_out'
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'text-txt-muted hover:text-txt-secondary'
                  }`}
                  title="Test center columns first (Heuristic)"
                >
                  Middle-Out
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('rtl')}
                  disabled={isPlaying}
                  className={`px-2.5 py-1 text-xs rounded transition-all ${
                    strategy === 'rtl'
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'text-txt-muted hover:text-txt-secondary'
                  }`}
                  title="Test columns from right to left"
                >
                  Right→Left
                </button>
              </div>
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
            <Crown className="w-4 h-4" />
            <span>Start Backtracking</span>
          </button>
        </div>

        {/* Large Board Warning */}
        {boardSize >= 10 && mode === 'all' && (
          <div className="mt-4 p-3 rounded-clay-sm bg-amber-950/40 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              For N={boardSize}, finding all solutions generates thousands of backtracking frames. The execution is capped at 3,000 steps to maintain optimal browser performance.
            </span>
          </div>
        )}

        {/* Live Search Metrics Ribbon */}
        {currentStep && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Queens Placed</div>
              <div className="text-sm font-mono font-bold text-accent-primary mt-0.5">
                {currentStep.queens.length} / {boardSize}
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Attempts</div>
              <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                {currentStep.attemptsCount}
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Backtracks</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                {currentStep.backtrackCount}
              </div>
            </div>
            <div className="clay-card p-2.5 rounded-clay-sm">
              <div className="text-[10px] text-txt-muted uppercase font-mono">Solutions Found</div>
              <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                {currentStep.solutionsCount}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chessboard Visualization Area */}
      {currentStep && <ChessBoard step={currentStep} />}

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

      {/* Side-by-Side: Pseudocode & Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CodePanel
          activeLine={currentStep?.codeLine || 1}
          metadata={N_QUEENS_METADATA}
          title="N-Queens Backtracking Pseudocode"
        />
        <ComplexityPanel
          metadata={N_QUEENS_METADATA}
          customNote="N-Queens has O(N!) factorial worst-case time complexity because there are N options for the first queen, at most N-1 for the second, N-2 for the third, and so forth. Backtracking prunes invalid permutations early."
        />
      </div>
    </main>
  );
};
