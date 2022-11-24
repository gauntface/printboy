import path from 'path';
import os from 'os';
import {mkdir} from 'node:fs/promises';

export async function pathForLabelSettings(dir) {
    const p = path.join(os.homedir(), '.printboy', 'labels', dir);
    await mkdir(p, { recursive: true });
    return p;
}