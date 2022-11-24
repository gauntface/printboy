import path from 'path';
import os from 'os';
import {mkdir} from 'node:fs/promises';

export async function pathForLabelSettings(dir) {
    const p = path.join(os.homedir(), '.printboy', 'labels', dir);
    await mkdir(p, { recursive: true });
    return p;
}

export function getSupportedSizes() {
    return [
      {
        id: 30252,
        name: "30252 Address",
        widthInches: 3,
        heightInches: 1.125,
      },
      {
        id: 30364,
        name: "30364 Name Badge",
        widthInches: 4,
        heightInches: 2.25,
      },
    ];
  }