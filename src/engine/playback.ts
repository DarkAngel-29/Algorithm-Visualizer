/**
 * Playback engine constants and speed definitions
 */

export interface PlaybackSpeed {
  label: string;
  multiplier: number;
  delayMs: number;
}

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [
  { label: '0.25x', multiplier: 0.25, delayMs: 1400 },
  { label: '0.5x', multiplier: 0.5, delayMs: 800 },
  { label: '1.0x', multiplier: 1.0, delayMs: 450 },
  { label: '2.0x', multiplier: 2.0, delayMs: 200 },
  { label: '4.0x', multiplier: 4.0, delayMs: 70 },
];

export const DEFAULT_SPEED_INDEX = 2; // 1.0x (450ms)
