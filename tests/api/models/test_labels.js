import test from 'ava';

import * as fs from 'node:fs/promises';
import * as path from 'path';
import * as os from 'os';

import { pathForLabels } from '../../../api/models/constants.js';
import { saveLabel, getSavedLabels } from '../../../api/models/labels.js';
import { hashForValue } from '../../../api/utils/files.js';

async function initTmpDir() {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'printboy-tests-'));
  process.env['PRINTBOY_CONFIG_DIR'] = tmpDir;
}

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
  await initTmpDir();

  const input = { title: 'example-title' };
  await saveLabel(input);

  const labelsDir = await pathForLabels();
  const dirContents = await fs.readdir(labelsDir);
  t.assert(dirContents.length === 1);

  const labelConfig = await fs.readFile(path.join(labelsDir, dirContents[0]));
  t.deepEqual(labelConfig.toString(), JSON.stringify(input));
});

test.serial('saveLabel: save file with all fields', async (t) => {
  await initTmpDir();

  const input = { title: 'example-title', body: 'example-body', image: 'example-image' };
  await saveLabel(Object.assign({}, input, {extraField: 'example-extra'}));

  const labelsDir = await pathForLabels();
  const dirContents = await fs.readdir(labelsDir);
  t.assert(dirContents.length === 1);

  const labelConfig = await fs.readFile(path.join(labelsDir, dirContents[0]));
  t.deepEqual(labelConfig.toString(), JSON.stringify(input));
});

test.serial('getSavedLabels: return no labels', async (t) => {
  await initTmpDir();

  const got = await getSavedLabels();
  t.deepEqual(got, []);
});

test.serial('getSavedLabels: return example labels', async (t) => {
  await initTmpDir();

  const want = [
    {
      title: '1',
    },
    {
      title: '2',
      body: '2',
    },
    {
      title: '3',
      body: '3',
      image: '3',
    },
  ];
  for (let i = 0; i < want.length; i++) {
    want[i].filename = `${hashForValue(JSON.stringify(want[i]))}.json`;
    await saveLabel(want[i]);
  }

  const got = await getSavedLabels();

  got.sort((a, b) => a.title.localeCompare(b.title));
  want.sort((a, b) => a.title.localeCompare(b.title));

  t.deepEqual(got, want);
});
