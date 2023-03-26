import test from 'ava';

import { initTmpConfigDir } from '../../../test_utils/tmpdir.js';

import { createApp } from "../../../api/server.js";
import { hashForValue } from '../../../api/utils/files.js';

let server;
let serverAddr;

// Called once before any of the tests in this block begin.
test.before(async () => {
  const app = createApp();
  server = await new Promise((resolve, reject) => {
    const server = app.listen(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(server);
    });
  });

  const port = server.address().port;
  serverAddr = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  server.close();
});

test.serial('saveLabelAPI: return error status for no body', async (t) => {
  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 500);
});

test.serial('saveLabelAPI: return error status for body with no required fields', async (t) => {
  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify([]),
  })
  t.deepEqual(res.status, 500);

  const body = await res.json();
  t.truthy(body.error);
  t.assert(body.error.msg.includes('At least one field required'));
});

test.serial('saveLabelAPI: save label with valid body', async (t) => {
  await initTmpConfigDir();

  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ title: 'example title'}),
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, {});
});

test.serial('getLabelsAPI: get no labels', async (t) => {
  await initTmpConfigDir();

  const res = await fetch(`${serverAddr}/api/labels`, {
    method: 'get',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, []);
});

test.serial('getLabelsAPI: get saved labels', async (t) => {
  await initTmpConfigDir();

  const label = { title: 'example label' };

  const saveRes = await fetch(`${serverAddr}/api/label`, {
    method: 'post',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify(label),
  })
  t.deepEqual(saveRes.status, 200);

  const res = await fetch(`${serverAddr}/api/labels`, {
    method: 'get',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, [
    {
      title: 'example label',
      filename: `${hashForValue(JSON.stringify(label))}.json`
    },
  ]);
});

test.serial('deleteLabelAPI: return error when no filename', async (t) => {
  await initTmpConfigDir();

  const label = { title: 'example label' };

  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'delete',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 400);

  const body = await res.json();
  t.truthy(body.error);
  t.assert(body.error.msg.includes(`Post body with 'filename' is required.`));
});

test.serial('deleteLabelAPI: return error when deleting non-existant label', async (t) => {
  await initTmpConfigDir();

  const label = { title: 'example label' };

  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'delete',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ filename: `${hashForValue(JSON.stringify(label))}.json` }),
  })
  t.deepEqual(res.status, 500);

  const body = await res.json();
  t.truthy(body.error);
  t.assert(body.error.msg.includes(`Label file \'${hashForValue(JSON.stringify(label))}.json\' does not exist`));
});

test.serial('deleteLabelAPI: delete saved labels', async (t) => {
  await initTmpConfigDir();

  const label = { title: 'example label' };

  const saveRes = await fetch(`${serverAddr}/api/label`, {
    method: 'post',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify(label),
  })
  t.deepEqual(saveRes.status, 200);

  const res = await fetch(`${serverAddr}/api/label`, {
    method: 'delete',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ filename: `${hashForValue(JSON.stringify(label))}.json` }),
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, {});
});
