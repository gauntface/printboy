import { getCurrentSize } from '../lib/constants.js';

export async function get() {
  return {
    body: {
      currentSize: await getCurrentSize(),
    }
  };
}