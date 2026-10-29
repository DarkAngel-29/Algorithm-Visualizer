import React, { useState } from 'react';
import { Dna, Shuffle, Play, AlertCircle, Bookmark } from 'lucide-react';
import {
  parseArrayInput,
  generateRandomArray,
  PRESET_ARRAYS,
  MAX_ARRAY_SIZE,
} from '../../utils/arrayUtils';

interface ArrayInputProps {
  currentArray: number[];
  onApplyArray: (newArray: number[]) => void;
  onSortAndPlay: (newArray: number[]) => void;
  isSorting: boolean;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  currentArray,
  onApplyArray,
  onSortAndPlay,
  isSorting,
}) => {
  const [inputText, setInputText] = useState(currentArray.join(', '));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [randomSize, setRandomSize] = useState<number>(10);
  const [allowNegatives, setAllowNegatives] = useState<boolean>(false);
  const [showPresets, setShowPresets] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleValidateAndApply = (startPlaying = false) => {
    const result = parseArrayInput(inputText);
    if (!result.isValid) {
      setErrorMessage(result.error || 'Invalid array values.');
      return;
    }

    setErrorMessage(null);
    if (startPlaying) {
      onSortAndPlay(result.array);
    } else {
      onApplyArray(result.array);
    }
  };

  const handleGenerateRandom = () => {
    const randomArray = generateRandomArray(randomSize, 5, 95, allowNegatives);
    const text = randomArray.join(', ');
    setInputText(text);
    setErrorMessage(null);
    onApplyArray(randomArray);
  };

  const handleSelectPreset = (preset: (typeof PRESET_ARRAYS)[0]) => {
    const text = preset.array.join(', ');
    setInputText(text);
    setErrorMessage(null);
    setShowPresets(false);
    onApplyArray(preset.array);
  };

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-txt-primary flex items-center gap-2">
            <Dna className="w-5 h-5 text-accent-primary" />
            Array Configuration
          </h2>
          <p className="text-xs text-txt-secondary mt-0.5">
            Enter up to {MAX_ARRAY_SIZE} comma-separated integers or generate random sets.
          </p>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="clay-button px-3.5 py-1.5 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-accent-secondary" />
            <span>Load Preset Example</span>
            <span className="text-[10px] text-txt-muted ml-0.5">▼</span>
          </button>

          {showPresets && (
            <div className="absolute right-0 mt-2 w-72 clay-surface-elevated p-2 rounded-clay-sm shadow-clay-elevated z-30 border border-white/10 animate-in fade-in">
              <div className="text-[11px] font-mono text-txt-muted px-2 py-1 uppercase tracking-wider border-b border-white/5 mb-1">
                Educational Presets
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {PRESET_ARRAYS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="text-xs font-medium text-txt-primary group-hover:text-accent-secondary">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-txt-muted truncate">
                      {preset.description}
                    </div>
                    <div className="text-[10px] font-mono text-purple-300/80 truncate mt-0.5">
                      [{preset.array.join(', ')}]
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Input Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleValidateAndApply(false);
              }
            }}
            placeholder="e.g. 38, 12, 27, 43, 9, 31, 18"
            className="w-full clay-inset px-4 py-2.5 text-sm font-mono text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-1 focus:ring-accent-primary/60 transition-all"
            disabled={isSorting}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleValidateAndApply(false)}
            disabled={isSorting}
            className="clay-button px-4 py-2.5 text-xs text-txt-primary hover:text-white disabled:opacity-50"
          >
            Apply Array
          </button>

          <button
            type="button"
            onClick={() => handleValidateAndApply(true)}
            className="clay-button clay-button-primary px-5 py-2.5 text-xs flex items-center gap-1.5 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Sort Array</span>
          </button>
        </div>
      </div>

      {/* Inline Validation Error */}
      {errorMessage && (
        <div className="mt-3 p-2.5 rounded-clay-sm bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Generator Controls Toolbar */}
      <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-txt-secondary">
            <span>Size:</span>
            <input
              type="range"
              min="3"
              max={MAX_ARRAY_SIZE}
              value={randomSize}
              onChange={(e) => setRandomSize(Number(e.target.value))}
              className="w-24 accent-purple-400 cursor-pointer"
            />
            <span className="font-mono text-txt-primary font-semibold w-5 text-center">
              {randomSize}
            </span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-txt-secondary hover:text-txt-primary select-none">
            <input
              type="checkbox"
              checked={allowNegatives}
              onChange={(e) => setAllowNegatives(e.target.checked)}
              className="rounded bg-[#161920] border-white/10 text-accent-primary focus:ring-0 cursor-pointer"
            />
            <span>Include negative numbers</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleGenerateRandom}
          disabled={isSorting}
          className="clay-button px-3.5 py-1.5 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1.5"
        >
          <Shuffle className="w-3.5 h-3.5 text-accent-primary" />
          <span>Generate Random Array</span>
        </button>
      </div>
    </div>
  );
};
