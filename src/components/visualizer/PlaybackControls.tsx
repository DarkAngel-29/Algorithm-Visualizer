import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Activity,
} from 'lucide-react';
import { PLAYBACK_SPEEDS } from '../../engine/playback';
import type { PlaybackSpeed } from '../../engine/playback';
import type { AlgorithmPhase } from '../../engine/types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speedIndex: number;
  currentPhase?: AlgorithmPhase;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onJumpToStep: (index: number) => void;
  onSpeedChange: (speedIndex: number) => void;
  disabled?: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentStepIndex,
  totalSteps,
  speedIndex,
  currentPhase = 'idle',
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  onJumpToStep,
  onSpeedChange,
  disabled = false,
}) => {
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = totalSteps === 0 || currentStepIndex >= totalSteps - 1;

  // Format phase badge
  const getPhaseDetails = (phase: AlgorithmPhase) => {
    switch (phase) {
      case 'divide':
        return { label: 'Dividing Subarray', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'base_case':
        return { label: 'Base Case (Single Element)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'compare':
        return { label: 'Comparing Elements', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'write':
        return { label: 'Merging into Array', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'merge_segment_complete':
        return { label: 'Subsegment Merged', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'complete':
        return { label: 'Sorting Complete', color: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40' };
      case 'initial':
      default:
        return { label: 'Ready', color: 'bg-white/10 text-txt-secondary border-white/10' };
    }
  };

  const phaseInfo = getPhaseDetails(currentPhase);
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="clay-surface p-4 sm:p-5 mb-6">
      {/* Timeline scrubber and Step counter */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-txt-secondary font-medium">
              Step <strong className="text-txt-primary">{currentStepIndex + 1}</strong> of{' '}
              <span className="text-txt-muted">{Math.max(1, totalSteps)}</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${phaseInfo.color} flex items-center gap-1`}
            >
              <Activity className="w-2.5 h-2.5 animate-pulse" />
              {phaseInfo.label}
            </span>
          </div>

          <span className="font-mono text-[11px] text-txt-muted">
            {Math.round(progressPercent)}%
          </span>
        </div>

        {/* Interactive Scrub Slider */}
        <div className="relative w-full flex items-center group">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onJumpToStep(Number(e.target.value))}
            disabled={disabled || totalSteps <= 1}
            className="w-full h-2.5 bg-[#161920] rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-none border border-white/5"
            style={{
              background: `linear-gradient(to right, #A78BFA 0%, #A78BFA ${progressPercent}%, #161920 ${progressPercent}%, #161920 100%)`,
            }}
          />
        </div>
      </div>

      {/* Control Buttons and Speed Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
        {/* Playback Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            disabled={disabled || isAtStart}
            title="Reset to Initial State (R)"
            className="clay-button p-2.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            type="button"
            onClick={onPrev}
            disabled={disabled || isAtStart}
            title="Previous Step (Left Arrow)"
            className="clay-button p-2.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary */}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={disabled}
            title={isPlaying ? 'Pause (Space)' : 'Play Animation (Space)'}
            className="clay-button clay-button-primary px-5 py-2.5 flex items-center gap-2 text-sm font-semibold tracking-wide"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isAtEnd ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={onNext}
            disabled={disabled || isAtEnd}
            title="Next Step (Right Arrow)"
            className="clay-button p-2.5 text-txt-secondary hover:text-txt-primary disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-[#181B22] p-1 rounded-clay-sm border border-white/5">
          <div className="flex items-center gap-1 px-2 text-txt-muted text-xs">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speed:</span>
          </div>
          {PLAYBACK_SPEEDS.map((sp: PlaybackSpeed, idx: number) => {
            const isSelected = speedIndex === idx;
            return (
              <button
                key={sp.label}
                type="button"
                onClick={() => onSpeedChange(idx)}
                className={`px-2 py-1 text-xs font-mono rounded transition-all ${
                  isSelected
                    ? 'bg-accent-primary text-slate-950 font-bold shadow-sm'
                    : 'text-txt-secondary hover:text-txt-primary hover:bg-white/5'
                }`}
              >
                {sp.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
