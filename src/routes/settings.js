import { getLabelPresets } from '../lib/constants.js';

export function get() {
  return {
    body: {
      labelPresets: getLabelPresets(),
    }
  };
}