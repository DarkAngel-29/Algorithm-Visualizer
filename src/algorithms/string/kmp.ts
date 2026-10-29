import type { AlgorithmMetadata, KMPStep } from '../../engine/types';

export const KMP_METADATA: AlgorithmMetadata = {
  id: 'kmp-string-matching',
  name: 'LPS + KMP String Matching',
  category: 'string',
  paradigm: 'String Matching / Prefix Automaton',
  timeComplexity: {
    best: 'O(m + n)',
    average: 'O(m + n)',
    worst: 'O(m + n)',
  },
  spaceComplexity: 'O(m)',
  description:
    'The Knuth-Morris-Pratt (KMP) algorithm preprocesses the pattern into a Longest Proper Prefix that is also a Suffix (LPS) table. During text searching, when a mismatch occurs, the LPS table determines how many characters can be safely skipped without ever moving the text pointer backward.',
  pseudocode: {
    language: 'pseudocode',
    lines: [
      { lineNumber: 1, code: 'algorithm computeLPS(pattern):', indent: 0 },
      { lineNumber: 2, code: 'lps[0] ← 0; len ← 0; i ← 1', indent: 1 },
      { lineNumber: 3, code: 'while i < length(pattern) do:', indent: 1 },
      { lineNumber: 4, code: '  if pattern[i] = pattern[len] then len ← len + 1; lps[i] ← len; i ← i + 1', indent: 2 },
      { lineNumber: 5, code: '  else if len ≠ 0 then len ← lps[len - 1]  // Prefix fallback', indent: 2 },
      { lineNumber: 6, code: '  else lps[i] ← 0; i ← i + 1', indent: 2 },
      { lineNumber: 7, code: '', indent: 0 },
      { lineNumber: 8, code: 'algorithm kmpSearch(text, pattern, lps):', indent: 0 },
      { lineNumber: 9, code: 'i ← 0; j ← 0', indent: 1 },
      { lineNumber: 10, code: 'while i < length(text) do:', indent: 1 },
      { lineNumber: 11, code: '  if text[i] = pattern[j] then i ← i + 1; j ← j + 1', indent: 2 },
      { lineNumber: 12, code: '  if j = length(pattern) then recordMatch(i - j); j ← lps[j - 1]', indent: 2 },
      { lineNumber: 13, code: '  else if i < length(text) and text[i] ≠ pattern[j] then', indent: 2 },
      { lineNumber: 14, code: '    if j ≠ 0 then j ← lps[j - 1]  // Skip without rewinding i', indent: 3 },
      { lineNumber: 15, code: '    else i ← i + 1', indent: 3 },
    ],
  },
};

export const DEFAULT_KMP_TEXT = 'ABABDABACDABABCABAB';
export const DEFAULT_KMP_PATTERN = 'ABABCABAB';

export function generateKMPSteps(
  text: string = DEFAULT_KMP_TEXT,
  pattern: string = DEFAULT_KMP_PATTERN
): { steps: KMPStep[]; lpsTable: number[]; matchedIndices: number[] } {
  const steps: KMPStep[] = [];
  const m = pattern.length;
  const n = text.length;

  const lps = Array.from({ length: m }, () => 0);
  let stepCounter = 0;
  let compCount = 0;

  // ================= STAGE A: LPS CONSTRUCTION =================
  steps.push({
    stepIndex: stepCounter++,
    phase: 'lps_init',
    operation: 'LPS_INITIALIZE',
    stage: 'lps',
    text,
    pattern,
    lpsTable: [...lps],
    currentPatternIndex: 0,
    currentPrefixLen: 0,
    currentTextIndex: 0,
    matchedIndices: [],
    comparisonCount: 0,
    explanation: `Stage A: Building LPS table for pattern "${pattern}". Base case: lps[0] = 0 (single character has no proper prefix).`,
    codeLine: 2,
  });

  let len = 0;
  let pIdx = 1;

  while (pIdx < m) {
    compCount++;
    const charCurrent = pattern[pIdx];
    const charPrefix = pattern[len];

    if (charCurrent === charPrefix) {
      len++;
      lps[pIdx] = len;

      steps.push({
        stepIndex: stepCounter++,
        phase: 'lps_match',
        operation: 'LPS_CHAR_MATCH',
        stage: 'lps',
        text,
        pattern,
        lpsTable: [...lps],
        currentPatternIndex: pIdx,
        currentPrefixLen: len,
        currentTextIndex: 0,
        comparisonIndices: {
          patternCharIdx: pIdx,
          isMatch: true,
        },
        matchedIndices: [],
        comparisonCount: compCount,
        explanation: `LPS[${pIdx}]: Pattern[${pIdx}] ('${charCurrent}') matches Pattern[${len - 1}] ('${charPrefix}'). Prefix extended to len=${len}. Wrote lps[${pIdx}] = ${len}.`,
        codeLine: 4,
      });

      pIdx++;
    } else {
      if (len !== 0) {
        const prevLen = len;
        len = lps[len - 1];

        steps.push({
          stepIndex: stepCounter++,
          phase: 'lps_fallback',
          operation: 'LPS_FALLBACK',
          stage: 'lps',
          text,
          pattern,
          lpsTable: [...lps],
          currentPatternIndex: pIdx,
          currentPrefixLen: len,
          currentTextIndex: 0,
          comparisonIndices: {
            patternCharIdx: pIdx,
            isMatch: false,
          },
          matchedIndices: [],
          comparisonCount: compCount,
          fallbackReason: `Mismatch between '${charCurrent}' and '${charPrefix}'. Falling back len from ${prevLen} to lps[${prevLen - 1}] = ${len}.`,
          explanation: `LPS Fallback: '${charCurrent}' ≠ '${charPrefix}'. Reusing previously known prefix; falling back to len = lps[${prevLen - 1}] = ${len}.`,
          codeLine: 5,
        });
      } else {
        lps[pIdx] = 0;

        steps.push({
          stepIndex: stepCounter++,
          phase: 'lps_zero',
          operation: 'LPS_NO_PREFIX',
          stage: 'lps',
          text,
          pattern,
          lpsTable: [...lps],
          currentPatternIndex: pIdx,
          currentPrefixLen: 0,
          currentTextIndex: 0,
          comparisonIndices: {
            patternCharIdx: pIdx,
            isMatch: false,
          },
          matchedIndices: [],
          comparisonCount: compCount,
          explanation: `LPS[${pIdx}]: '${charCurrent}' ≠ '${charPrefix}' with len=0. No common proper prefix-suffix exists here. Wrote lps[${pIdx}] = 0.`,
          codeLine: 6,
        });

        pIdx++;
      }
    }
  }

  // LPS Complete Step
  steps.push({
    stepIndex: stepCounter++,
    phase: 'lps_complete',
    operation: 'LPS_COMPLETED',
    stage: 'lps',
    text,
    pattern,
    lpsTable: [...lps],
    currentPatternIndex: m - 1,
    currentPrefixLen: len,
    currentTextIndex: 0,
    matchedIndices: [],
    comparisonCount: compCount,
    isLPSComplete: true,
    explanation: `Stage A complete! Final LPS Table = [${lps.join(
      ', '
    )}]. Transitioning to Stage B: Knuth-Morris-Pratt text search.`,
    codeLine: 8,
  });

  // ================= STAGE B: KMP TEXT SEARCH =================
  let tIdx = 0;
  let patIdx = 0;
  const matchedIndices: number[] = [];

  while (tIdx < n) {
    compCount++;
    const textChar = text[tIdx];
    const patChar = pattern[patIdx];
    const isCharMatch = textChar === patChar;

    if (isCharMatch) {
      steps.push({
        stepIndex: stepCounter++,
        phase: 'search_match',
        operation: 'CHAR_MATCH',
        stage: 'search',
        text,
        pattern,
        lpsTable: [...lps],
        currentPatternIndex: patIdx,
        currentPrefixLen: 0,
        currentTextIndex: tIdx,
        comparisonIndices: {
          textCharIdx: tIdx,
          patternCharIdx: patIdx,
          isMatch: true,
        },
        matchedIndices: [...matchedIndices],
        comparisonCount: compCount,
        explanation: `Match! Text[${tIdx}] ('${textChar}') = Pattern[${patIdx}] ('${patChar}'). Advancing both pointers (i→${
          tIdx + 1
        }, j→${patIdx + 1}).`,
        codeLine: 11,
      });

      tIdx++;
      patIdx++;

      if (patIdx === m) {
        const matchStart = tIdx - m;
        matchedIndices.push(matchStart);

        steps.push({
          stepIndex: stepCounter++,
          phase: 'full_match',
          operation: 'PATTERN_OCCURRENCE_FOUND',
          stage: 'search',
          text,
          pattern,
          lpsTable: [...lps],
          currentPatternIndex: patIdx - 1,
          currentPrefixLen: 0,
          currentTextIndex: tIdx - 1,
          matchedIndices: [...matchedIndices],
          comparisonCount: compCount,
          explanation: `FULL MATCH FOUND! Pattern "${pattern}" matches text at index ${matchStart} (indices ${matchStart}..${
            tIdx - 1
          }). Jumping j = lps[${m - 1}] = ${lps[m - 1]} to check overlapping matches.`,
          codeLine: 12,
        });

        patIdx = lps[patIdx - 1];
      }
    } else {
      // Mismatch
      if (patIdx !== 0) {
        const prevPatIdx = patIdx;
        const newPatIdx = lps[patIdx - 1];

        steps.push({
          stepIndex: stepCounter++,
          phase: 'search_fallback',
          operation: 'KMP_FALLBACK',
          stage: 'search',
          text,
          pattern,
          lpsTable: [...lps],
          currentPatternIndex: patIdx,
          currentPrefixLen: 0,
          currentTextIndex: tIdx,
          comparisonIndices: {
            textCharIdx: tIdx,
            patternCharIdx: patIdx,
            isMatch: false,
          },
          matchedIndices: [...matchedIndices],
          comparisonCount: compCount,
          fallbackReason: `Mismatch: Text[${tIdx}] ('${textChar}') ≠ Pattern[${patIdx}] ('${patChar}'). LPS Jump: j = lps[${
            prevPatIdx - 1
          }] = ${newPatIdx}. Text pointer i (${tIdx}) NEVER rewinds!`,
          explanation: `Mismatch! Text[${tIdx}] ('${textChar}') ≠ Pattern[${patIdx}] ('${patChar}'). KMP Advantage: shifting pattern by jumping j to lps[${
            prevPatIdx - 1
          }] = ${newPatIdx} without rewinding text index ${tIdx}!`,
          codeLine: 14,
        });

        patIdx = newPatIdx;
      } else {
        steps.push({
          stepIndex: stepCounter++,
          phase: 'search_advance_text',
          operation: 'ADVANCE_TEXT',
          stage: 'search',
          text,
          pattern,
          lpsTable: [...lps],
          currentPatternIndex: 0,
          currentPrefixLen: 0,
          currentTextIndex: tIdx,
          comparisonIndices: {
            textCharIdx: tIdx,
            patternCharIdx: 0,
            isMatch: false,
          },
          matchedIndices: [...matchedIndices],
          comparisonCount: compCount,
          explanation: `Mismatch with j=0: Text[${tIdx}] ('${textChar}') ≠ Pattern[0] ('${pattern[0]}'). Advancing text pointer i to ${
            tIdx + 1
          }.`,
          codeLine: 15,
        });

        tIdx++;
      }
    }
  }

  // Search Complete
  steps.push({
    stepIndex: stepCounter++,
    phase: 'complete',
    operation: 'SEARCH_COMPLETE',
    stage: 'search',
    text,
    pattern,
    lpsTable: [...lps],
    currentPatternIndex: patIdx,
    currentPrefixLen: 0,
    currentTextIndex: n - 1,
    matchedIndices: [...matchedIndices],
    comparisonCount: compCount,
    isSearchComplete: true,
    explanation: `KMP Search Complete! Found ${matchedIndices.length} occurrence(s) of pattern "${pattern}" in text using ${compCount} total character comparisons.`,
    codeLine: 10,
  });

  return {
    steps,
    lpsTable: lps,
    matchedIndices,
  };
}
