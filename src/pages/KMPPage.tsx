import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Sparkles,
  Bookmark,
  Play,
  RotateCcw,
  Dice5,
  AlertTriangle,
} from 'lucide-react';
import {
  generateKMPSteps,
  KMP_METADATA,
  DEFAULT_KMP_TEXT,
  DEFAULT_KMP_PATTERN,
} from '../algorithms/string/kmp';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { KMPVisualizer } from '../components/visualizer/string/KMPVisualizer';
import { PlaybackControls } from '../components/visualizer/PlaybackControls';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { CodePanel } from '../components/visualizer/CodePanel';
import { ComplexityPanel } from '../components/visualizer/ComplexityPanel';

export const KMPPage: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_KMP_TEXT);
  const [pattern, setPattern] = useState<string>(DEFAULT_KMP_PATTERN);

  const validationError = useMemo(() => {
    if (!text.trim() || !pattern.trim()) {
      return 'Both text and pattern must not be empty.';
    }
    if (pattern.trim().length > text.trim().length) {
      return 'Pattern length cannot exceed target text length to search for matches.';
    }
    return null;
  }, [text, pattern]);

  const executionResult = useMemo(() => {
    const cleanText = text.trim().toUpperCase();
    const cleanPattern = pattern.trim().toUpperCase();
    return generateKMPSteps(cleanText, cleanPattern);
  }, [text, pattern]);

  const handleComplete = useCallback(() => {
    if (executionResult.matchedIndices.length > 0) {
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
  }, [executionResult.matchedIndices]);

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

  const handleLoadPreset = (type: 'classic' | 'multiple' | 'overlap' | 'repeated' | 'absent') => {
    if (type === 'classic') {
      setText(DEFAULT_KMP_TEXT);
      setPattern(DEFAULT_KMP_PATTERN);
    } else if (type === 'multiple') {
      setText('AABAACAADAABAABA');
      setPattern('AABA');
    } else if (type === 'overlap') {
      setText('ONIONIONS');
      setPattern('ONIONS');
    } else if (type === 'repeated') {
      setText('AAAAABAAAAAB');
      setPattern('AAAA');
    } else {
      setText('ABCDEFGH');
      setPattern('XYZ');
    }
  };

  const handleGenerateRandom = () => {
    const alphabet = ['A', 'B', 'C'];
    const textLen = Math.floor(Math.random() * 6) + 14; // 14 to 19
    const patLen = Math.floor(Math.random() * 3) + 4; // 4 to 6

    let randText = '';
    for (let i = 0; i < textLen; i++) {
      randText += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // Pick a random substring or generate random pattern to ensure frequent matches
    let randPattern = '';
    if (Math.random() > 0.3) {
      const start = Math.floor(Math.random() * (textLen - patLen));
      randPattern = randText.substring(start, start + patLen);
    } else {
      for (let i = 0; i < patLen; i++) {
        randPattern += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }

    setText(randText);
    setPattern(randPattern);
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
                <Search className="w-3.5 h-3.5 text-accent-primary" />
                String Matching
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                Time: O(m + n)
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-emerald-300">
                Space: O(m)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              LPS + KMP String Visualizer
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Observe Knuth-Morris-Pratt preprocess the pattern into the Longest Proper Prefix-Suffix (LPS) table, then search text without ever shifting the text pointer backward on mismatches.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-txt-muted bg-[#181B22] px-3.5 py-2 rounded-clay-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-accent-secondary" />
            <span>Linear Time String Automaton</span>
          </div>
        </div>
      </section>

      {/* String Configuration Panel */}
      <div className="clay-surface p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-txt-secondary font-medium block">
                  Target Text (T):
                </label>
                <span className="text-[11px] font-mono text-txt-muted">
                  Length: {text.trim().length}
                </span>
              </div>
              <input
                type="text"
                value={text}
                maxLength={40}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                disabled={isPlaying}
                placeholder="Enter target text string..."
                className="w-full clay-inset px-3.5 py-2 text-xs font-mono text-txt-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/60 tracking-wider"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-txt-secondary font-medium block">
                  Search Pattern (P):
                </label>
                <span className="text-[11px] font-mono text-txt-muted">
                  Length: {pattern.trim().length}
                </span>
              </div>
              <input
                type="text"
                value={pattern}
                maxLength={20}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
                disabled={isPlaying}
                placeholder="Enter pattern to find..."
                className="w-full clay-inset px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-accent-primary/60 tracking-wider"
              />
            </div>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Presets and Run Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
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
                Classic Example
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('multiple')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Multiple Matches
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('overlap')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Overlapping
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('repeated')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Repeated Prefix
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('absent')}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs"
              >
                Absent Pattern
              </button>
              <button
                type="button"
                onClick={handleGenerateRandom}
                disabled={isPlaying}
                className="clay-button px-2.5 py-1 text-xs flex items-center gap-1"
              >
                <Dice5 className="w-3 h-3 text-accent-primary" />
                Random Strings
              </button>
              <button
                type="button"
                onClick={() => {
                  setText(DEFAULT_KMP_TEXT);
                  setPattern(DEFAULT_KMP_PATTERN);
                }}
                disabled={isPlaying}
                title="Reset to default text and pattern"
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
              disabled={Boolean(validationError)}
              className="clay-button clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run LPS + KMP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KMP Visualizer */}
      {currentStep && <KMPVisualizer step={currentStep} />}

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
          metadata={KMP_METADATA}
          title="LPS + KMP Pseudocode"
        />
        <ComplexityPanel
          metadata={KMP_METADATA}
          customNote="KMP guarantees O(m + n) linear time complexity. Preprocessing the pattern takes O(m) time and space, while searching the text takes O(n) because the text pointer i never moves backwards."
        />
      </div>
    </main>
  );
};
