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
