import { getLabelPresets, getCurrentSize } from '../lib/constants.js';

export async function get() {
  return {
    body: {
      labelPresets: getLabelPresets(),
      currentSize: await getCurrentSize(),
    }
  };
}