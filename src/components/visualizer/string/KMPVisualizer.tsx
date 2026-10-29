import React from 'react';
import { motion } from 'framer-motion';
import { Search, FastForward, CheckCircle2 } from 'lucide-react';
import type { KMPStep } from '../../../engine/types';

interface KMPVisualizerProps {
  step: KMPStep;
}

export const KMPVisualizer: React.FC<KMPVisualizerProps> = ({ step }) => {
  const {
    stage,
    text,
    pattern,
    lpsTable,
    currentPatternIndex,
    currentPrefixLen,
    currentTextIndex,
    comparisonIndices,
    matchedIndices,
    comparisonCount,
    isLPSComplete,
    fallbackReason,
  } = step;

  // Pattern alignment offset: pattern starts at text index (currentTextIndex - currentPatternIndex)
  const patternOffset = Math.max(0, currentTextIndex - currentPatternIndex);

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Stage Badge & Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
              stage === 'lps'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {stage === 'lps' ? 'Stage A: LPS Table Preprocessing' : 'Stage B: KMP Search'}
          </span>

          <span className="font-mono text-txt-muted text-xs">
            Comparisons: <strong className="text-txt-primary">{comparisonCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            Matches Found: {matchedIndices.length}
          </span>
          {stage === 'search' && (
            <span className="text-txt-muted">
              Shift Offset: <strong className="text-cyan-300">{patternOffset}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Stage A: LPS Table Display */}
      <div className="mb-6 p-4 rounded-clay-sm bg-[#161920] border border-white/5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-txt-muted mb-2 flex items-center justify-between">
          <span>Pattern LPS (Longest Proper Prefix which is also a Suffix) Table:</span>
          {isLPSComplete && (
            <span className="text-emerald-400 font-sans flex items-center gap-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> LPS Built
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            {/* Pattern Character Row */}
            <div className="flex items-center gap-1">
              <span className="w-16 text-right pr-2 text-[11px] text-txt-muted font-mono select-none">
                Pattern:
              </span>
              {pattern.split('').map((char, idx) => {
                const isActive = stage === 'lps' && currentPatternIndex === idx;
                const isPrefixChar = stage === 'lps' && idx < currentPrefixLen;

                let charStyle = 'bg-[#20242D] text-txt-secondary border-white/5';
                if (isActive) {
                  charStyle = 'bg-purple-600/30 text-purple-200 border-accent-primary font-bold shadow-md';
                } else if (isPrefixChar) {
                  charStyle = 'bg-cyan-600/20 text-cyan-200 border-cyan-400/50';
                }

                return (
                  <div
                    key={`lps-char-${idx}`}
                    className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center font-mono text-xs ${charStyle}`}
                  >
                    <span>{char}</span>
                    <span className="text-[8px] text-txt-muted opacity-70 leading-none">{idx}</span>
                  </div>
                );
              })}
            </div>

            {/* LPS Value Row */}
            <div className="flex items-center gap-1">
              <span className="w-16 text-right pr-2 text-[11px] text-purple-300 font-mono font-semibold select-none">
                LPS[i]:
              </span>
              {lpsTable.map((val, idx) => {
                const isActive = stage === 'lps' && currentPatternIndex === idx;
                return (
                  <div
                    key={`lps-val-${idx}`}
                    className={`w-9 h-8 rounded-lg border flex items-center justify-center font-mono text-xs ${
                      isActive
                        ? 'bg-purple-500/30 text-accent-primary border-accent-primary font-bold animate-pulse'
                        : val > 0
                        ? 'bg-[#282D38] text-emerald-300 border-emerald-500/20 font-semibold'
                        : 'bg-[#1C2028] text-txt-muted border-white/5'
                    }`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stage B: Text & Pattern Alignment Search View */}
      {stage === 'search' && (
        <div className="p-4 rounded-clay-sm bg-[#161920] border border-white/5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-txt-muted mb-3 flex items-center justify-between">
            <span>KMP Text vs Pattern Dynamic Alignment:</span>
            <span className="text-cyan-300 font-mono text-xs">
              Pointer: text[i={currentTextIndex}] vs pat[j={currentPatternIndex}]
            </span>
          </div>

          <div className="overflow-x-auto py-2">
            <div className="inline-flex flex-col gap-2 min-w-full">
              {/* Text Character Tiles */}
              <div className="flex items-center gap-1">
                <span className="w-14 text-right pr-2 text-[11px] text-txt-muted font-mono select-none">
                  Text:
                </span>
                {text.split('').map((char, idx) => {
                  const isCurrentText = currentTextIndex === idx;
                  const isMatchedStart = matchedIndices.some((mIdx) => idx >= mIdx && idx < mIdx + pattern.length);

                  let tileStyle = 'bg-[#20242D] text-txt-secondary border-white/5';
                  if (isCurrentText) {
                    tileStyle = comparisonIndices?.isMatch
                      ? 'bg-emerald-600/30 text-emerald-200 border-emerald-400 font-bold shadow-md'
                      : 'bg-red-600/30 text-red-200 border-red-400 font-bold shadow-md';
                  } else if (isMatchedStart) {
                    tileStyle = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 font-semibold';
                  }

                  return (
                    <div
                      key={`text-ch-${idx}`}
                      className={`w-9 h-10 rounded-lg border flex flex-col items-center justify-center font-mono text-xs ${tileStyle}`}
                    >
                      <span className="font-bold">{char}</span>
                      <span className="text-[8px] text-txt-muted opacity-70 leading-none">{idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pattern Aligned Underneath */}
              <div className="flex items-center gap-1">
                <span className="w-14 text-right pr-2 text-[11px] text-accent-secondary font-mono select-none">
                  Pattern:
                </span>
                {/* Leading Spacers to align pattern at patternOffset */}
                {Array.from({ length: patternOffset }, (_, sIdx) => (
                  <div key={`spacer-${sIdx}`} className="w-9 h-10 invisible" />
                ))}

                {pattern.split('').map((char, idx) => {
                  const isCurrentPat = currentPatternIndex === idx;

                  let tileStyle = 'bg-[#282D38] text-txt-primary border-white/10';
                  if (isCurrentPat) {
                    tileStyle = comparisonIndices?.isMatch
                      ? 'bg-emerald-600/40 text-emerald-200 border-emerald-400 font-bold shadow-md animate-pulse'
                      : 'bg-amber-600/40 text-amber-200 border-amber-400 font-bold shadow-md animate-pulse';
                  }

                  return (
                    <motion.div
                      key={`pat-ch-${idx}`}
                      layout
                      className={`w-9 h-10 rounded-lg border flex flex-col items-center justify-center font-mono text-xs ${tileStyle}`}
                    >
                      <span className="font-bold">{char}</span>
                      <span className="text-[8px] text-txt-muted opacity-70 leading-none">{idx}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fallback Explanatory Notification Banner */}
          {fallbackReason && (
            <div className="mt-3 p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 font-mono flex items-center gap-2">
              <FastForward className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fallbackReason}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
