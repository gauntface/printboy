import test from 'ava';

import { initTmpConfigDir } from '../../../test_utils/tmpdir.js';

import { createApp } from "../../../api/server.js";
import * as printAPI from "../../../api/endpoints/print.js";
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

test.serial('printAPI: return error status for no body', async (t) => {
  const res = await fetch(`${serverAddr}/api/print`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 500);
});

test.serial('printAPI: return error status for bad copies value', async (t) => {
  const res = await fetch(`${serverAddr}/api/print`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ copies: 0 }),
  })
  t.deepEqual(res.status, 500);
});

test.serial('printAPI: return error if print fails', async (t) => {
  printAPI.overrideExec(() => {
    throw new Error('Injected error');
  });
  const res = await fetch(`${serverAddr}/api/print`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({
      copies: 1,
      base64: 'base64,4pyTIMOgIGxhIG1vZGU=',
    }),
  })
  t.deepEqual(res.status, 500);

  const body = await res.json();
  t.truthy(body.error);
  t.assert(body.error.msg.includes('Failed to run print command'));
});

test.serial('printAPI: return success on print', async (t) => {
  printAPI.overrideExec(() => {});
  const res = await fetch(`${serverAddr}/api/print`, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({
      copies: 1,
      base64: 'base64,4pyTIMOgIGxhIG1vZGU=',
    }),
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, {});
});
