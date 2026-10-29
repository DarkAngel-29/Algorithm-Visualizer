import { useState, useEffect, useRef, useCallback } from 'react';
import type { BaseAlgorithmStep } from '../engine/types';
import { PLAYBACK_SPEEDS, DEFAULT_SPEED_INDEX } from '../engine/playback';

interface UseAlgorithmPlaybackProps<T extends BaseAlgorithmStep = BaseAlgorithmStep> {
  steps: T[];
  onComplete?: () => void;
}

export function useAlgorithmPlayback<T extends BaseAlgorithmStep = BaseAlgorithmStep>({
  steps,
  onComplete,
}: UseAlgorithmPlaybackProps<T>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);

  // Synchronously reset step index during render when steps array changes
  const [prevSteps, setPrevSteps] = useState(steps);
  if (steps !== prevSteps) {
    setPrevSteps(steps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  // References to handle interval timing without stale closures
  const timerRef = useRef<number | null>(null);
  const stepsRef = useRef(steps);
  const currentStepRef = useRef(currentStepIndex);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(PLAYBACK_SPEEDS[speedIndex].delayMs);
  const scheduleNextTickRef = useRef<() => void>(() => {});

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    currentStepRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = PLAYBACK_SPEEDS[speedIndex].delayMs;
  }, [speedIndex]);

  // Clear timer safely
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const scheduleNextTick = useCallback(() => {
    clearTimer();

    timerRef.current = window.setTimeout(() => {
      const maxIndex = stepsRef.current.length - 1;
      const nextIndex = currentStepRef.current + 1;

      if (nextIndex <= maxIndex) {
        setCurrentStepIndex(nextIndex);
        if (nextIndex === maxIndex) {
          setIsPlaying(false);
          clearTimer();
          if (onComplete) onComplete();
        } else if (isPlayingRef.current) {
          scheduleNextTickRef.current();
        }
      } else {
        setIsPlaying(false);
        clearTimer();
      }
    }, speedRef.current);
  }, [clearTimer, onComplete]);

  useEffect(() => {
    scheduleNextTickRef.current = scheduleNextTick;
  }, [scheduleNextTick]);

  const play = useCallback(() => {
    const maxIndex = stepsRef.current.length - 1;
    // If at the end, restart from step 0
    if (currentStepRef.current >= maxIndex) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Whenever isPlaying changes to true, trigger tick loop
  useEffect(() => {
    if (isPlaying) {
      scheduleNextTick();
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isPlaying, speedIndex, scheduleNextTick, clearTimer]);

  const nextStep = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => {
      const next = Math.min(prev + 1, stepsRef.current.length - 1);
      return next;
    });
  }, [pause]);

  const prevStep = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, [pause]);

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  const jumpToStep = useCallback(
    (index: number) => {
      pause();
      const clamped = Math.max(0, Math.min(index, stepsRef.current.length - 1));
      setCurrentStepIndex(clamped);
    },
    [pause]
  );

  const currentStep: T | undefined = steps[currentStepIndex];
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = steps.length === 0 || currentStepIndex >= steps.length - 1;

  return {
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speedIndex,
    currentSpeed: PLAYBACK_SPEEDS[speedIndex],
    isAtStart,
    isAtEnd,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    jumpToStep,
    setSpeedIndex,
  };
}
