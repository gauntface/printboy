import { getLabelPresets, getSupportedSizes, getCurrentSize } from '../lib/constants.js';

export async function get() {
  const cs = await getCurrentSize();
  return {
    body: {
      labelPresets: getLabelPresets(),
      supportedSizes: await getSupportedSizes(),
      currentSize: cs,
    }
  };
}