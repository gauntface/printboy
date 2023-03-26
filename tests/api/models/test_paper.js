import test from 'ava';

import { initTmpConfigDir } from '../../../test_utils/tmpdir.js';

import { getAllPaperSizes, saveCurrentPaperSize, getCurrentPaperSize } from '../../../api/models/paper.js';
import { ENV_CONFIG_DIR } from '../../../api/models/config.js';

test.beforeEach(() => {
  delete process.env[ENV_CONFIG_DIR];
});

test.serial('getAllPaperSizes: return labels with default current', async (t) => {
  const got = await getAllPaperSizes();
  t.deepEqual(got, [
    {
      id: 30252,
      name: '30252 Address: 1-1/8" x 3"',
      widthInInches: 3,
      heightInInches: 1.125,
      current: true,
    },
    {
      id: 30364,
      name: '30364 Name Badge: 2-1/4" x 4"',
      widthInInches: 4,
      heightInInches: 2.25,
    },
  ]);
});

test.serial('getAllPaperSizes: return labels with defined current', async (t) => {
  await initTmpConfigDir();

  await saveCurrentPaperSize('30364');

  const got = await getAllPaperSizes();
  t.deepEqual(got, [
    {
      id: 30252,
      name: '30252 Address: 1-1/8" x 3"',
      widthInInches: 3,
      heightInInches: 1.125,
    },
    {
      id: 30364,
      name: '30364 Name Badge: 2-1/4" x 4"',
      widthInInches: 4,
      heightInInches: 2.25,
      current: true,
    },
  ]);
});

test.serial('getCurrentPaperSize: return default size', async (t) => {
  const got = await getCurrentPaperSize();
  t.deepEqual(got,
    {
      id: 30252,
      name: '30252 Address: 1-1/8" x 3"',
      widthInInches: 3,
      heightInInches: 1.125,
    },
  );
});

test.serial('getCurrentPaperSize: return configured size', async (t) => {
  await initTmpConfigDir();

  await saveCurrentPaperSize('30364');

  const got = await getCurrentPaperSize();
  t.deepEqual(got,
    {
      id: 30364,
      name: '30364 Name Badge: 2-1/4" x 4"',
      widthInInches: 4,
      heightInInches: 2.25,
    },
  );
});

test.serial('saveCurrentPaperSize: fail if setting size to unknown value', async (t) => {
  await t.throwsAsync(async () => {
    await saveCurrentPaperSize('does-not-exist');
  }, { message: 'Invalid paper ID: \'does-not-exist\'' });
});
