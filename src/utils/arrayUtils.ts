/**
 * Array manipulation and validation utilities for AlgoLab
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  array: number[];
}

export const MAX_ARRAY_SIZE = 30;
export const MIN_ARRAY_SIZE = 1;

/**
 * Validates and parses user comma-separated array input.
 * Supports negative numbers, duplicates, and trims whitespace.
 * Rejects empty arrays, non-integers, and arrays > 30 elements.
 */
export function parseArrayInput(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter at least one integer.',
      array: [],
    };
  }

  // Split by comma
  const rawParts = trimmed.split(',');
  const parsedNumbers: number[] = [];

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i].trim();
    if (part === '') {
      return {
        isValid: false,
        error: `Empty entry found around position ${i + 1}. Check for consecutive commas.`,
        array: [],
      };
    }

    // Strict integer regex: optional minus sign followed by digits
    if (!/^-?\d+$/.test(part)) {
      return {
        isValid: false,
        error: `"${part}" is not a valid integer. Only whole numbers (positive or negative) are allowed.`,
        array: [],
      };
    }

    const num = Number(part);
    if (!Number.isSafeInteger(num)) {
      return {
        isValid: false,
        error: `Value "${part}" is out of safe integer range.`,
        array: [],
      };
    }

    // Enforce reasonable display bounds (-999 to 999) so visual bars remain readable
    if (num < -999 || num > 999) {
      return {
        isValid: false,
        error: `Value "${num}" is too large. Please use values between -999 and 999.`,
        array: [],
      };
    }

    parsedNumbers.push(num);
  }

  if (parsedNumbers.length === 0) {
    return {
      isValid: false,
      error: 'Array cannot be empty.',
      array: [],
    };
  }

  if (parsedNumbers.length > MAX_ARRAY_SIZE) {
    return {
      isValid: false,
      error: `Array size (${parsedNumbers.length}) exceeds the maximum limit of ${MAX_ARRAY_SIZE} elements for clear visualization.`,
      array: [],
    };
  }

  return {
    isValid: true,
    array: parsedNumbers,
  };
}

/**
 * Generates a clean, readable random array with integers between min and max.
 */
export function generateRandomArray(
  size = 10,
  min = 5,
  max = 95,
  allowNegatives = false
): number[] {
  const effectiveMin = allowNegatives ? -50 : min;
  const result: number[] = [];
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * (max - effectiveMin + 1)) + effectiveMin;
    result.push(val);
  }
  return result;
}

/**
 * Predefined educational presets for fast testing and demonstration
 */
export const PRESET_ARRAYS: { name: string; description: string; array: number[] }[] = [
  {
    name: 'Classic Example',
    description: 'The standard 7-element demonstration from algorithm textbooks',
    array: [38, 27, 43, 3, 9, 82, 10],
  },
  {
    name: 'Mixed with Negatives',
    description: 'A mix of positive numbers, negative numbers, and zero',
    array: [24, -15, 38, 0, -8, 42, 16, -23],
  },
  {
    name: 'Reverse Sorted',
    description: 'Worst-case order for comparison demonstrating full recursive inversion',
    array: [90, 75, 60, 48, 35, 20, 12, 5],
  },
  {
    name: 'Already Sorted',
    description: 'Best-case verification showing merge sort still divides and recombines in O(n log n)',
    array: [10, 18, 25, 34, 42, 59, 71, 88],
  },
  {
    name: 'With Duplicates',
    description: 'Verifies stability when identical values are merged in order',
    array: [35, 12, 45, 12, 60, 35, 18, 12],
  },
  {
    name: 'Two Elements',
    description: 'Minimal division and single comparison step',
    array: [42, 17],
  },
  {
    name: 'Single Element',
    description: 'Immediate base case return',
    array: [42],
  },
  {
    name: 'Larger Array (16 elements)',
    description: 'Shows deeper 4-level recursion tree in full action',
    array: [52, 14, 88, 3, 41, 79, 26, 65, 12, 94, 33, 47, 8, 70, 22, 58],
  },
];
