import test from 'ava';

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

test('saveLabel: error on write file', async (t) => {
  await t.throwsAsync(async () => {
    await saveLabel({ title: 'example-title' }, async () => {
      throw new Error('Injected error');
    });
  }, { message: 'Injected error' });
});

test('saveLabel: save file with one field', async (t) => {
  const input = { title: 'example-title' };
  await saveLabel(
    input,
    async (path, data) => {
      t.assert(path.includes('/.printboy/labels/preset-labels/example-hash.json'));
      t.deepEqual(data, JSON.stringify(input));
    },
    (value) => {
      t.deepEqual(value, JSON.stringify(input));
      return 'example-hash';
    }
  );
});

test('saveLabel: save file with all fields', async (t) => {
  const input = { title: 'example-title', body: 'example-body', image: 'example-image' };
  await saveLabel(
    Object.assign({}, input, {extraField: 'example-extra'}),
    async (path, data) => {
      t.assert(path.includes('/.printboy/labels/preset-labels/example-hash.json'));
      t.deepEqual(data, JSON.stringify(input));
    },
    (value) => {
      t.deepEqual(value, JSON.stringify(input));
      return 'example-hash';
    }
  );
});
