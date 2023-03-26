import test from 'ava';

import { initTmpConfigDir } from '../../../test_utils/tmpdir.js';

import { createApp } from "../../../api/server.js";

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
