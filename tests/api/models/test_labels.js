import test from 'ava';

import * as fs from 'node:fs/promises';
import * as path from 'path';
import * as os from 'os';

import { pathForLabels } from '../../../api/models/constants.js';
import { saveLabel } from '../../../api/models/labels.js';

test('saveLabel: no input', async (t) => {
  await t.throwsAsync(async () => {
    await saveLabel();
  }, { message: 'No label input given' });
});

test('saveLabel: no expected fields', async (t) => {
  await t.throwsAsync(async () => {
    await saveLabel({});
  }, { message: 'At least one field required: title, body, image' });
});

test.serial('saveLabel: save file with one field', async (t) => {
  await initConfigDir();

  const input = { title: 'example-title' };
  await saveLabel(input);

  const labelsDir = await pathForLabels();
  const dirContents = await fs.readdir(labelsDir);
  t.assert(dirContents.length === 1);

  const labelConfig = await fs.readFile(path.join(labelsDir, dirContents[0]));
  t.deepEqual(labelConfig.toString(), JSON.stringify(input));
});

test.serial('saveLabel: save file with all fields', async (t) => {
  await initConfigDir();

  const input = { title: 'example-title', body: 'example-body', image: 'example-image' };
  await saveLabel(Object.assign({}, input, {extraField: 'example-extra'}));

  const labelsDir = await pathForLabels();
  const dirContents = await fs.readdir(labelsDir);
  t.assert(dirContents.length === 1);

  const labelConfig = await fs.readFile(path.join(labelsDir, dirContents[0]));
  t.deepEqual(labelConfig.toString(), JSON.stringify(input));
});

async function initConfigDir() {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'printboy-tests-'));
  process.env['PRINTBOY_CONFIG_DIR'] = tmpDir;
}
