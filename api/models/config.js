import path from 'path';
import os from 'os';
import {mkdir} from 'node:fs/promises';

export const ENV_CONFIG_DIR = 'PRINTBOY_CONFIG_DIR';

function getRootConfigDir() {
  return process.env[ENV_CONFIG_DIR] || path.join(os.homedir(), '.printboy');
}

export async function getConfigDir(subdir) {
  const p = path.join(getRootConfigDir(), subdir);
  await mkdir(p, { recursive: true });
  return p;
}
