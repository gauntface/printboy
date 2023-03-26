import * as os from 'os';
import * as fs from 'node:fs/promises';
import * as path from 'path';

export async function initTmpConfigDir() {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'printboy-tests-'));
  process.env['PRINTBOY_CONFIG_DIR'] = tmpDir;
}
