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

test.serial('printerAPI: get all paper sizes', async (t) => {
  await initTmpConfigDir();

  const res = await fetch(`${serverAddr}/api/printer/sizes`, {
    method: 'get',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, [
    {
      current: true,
      heightInInches: 1.125,
      id: 30252,
      name: '30252 Address: 1-1/8" x 3"',
      widthInInches: 3,
    },
    {
      heightInInches: 2.25,
      id: 30364,
      name: '30364 Name Badge: 2-1/4" x 4"',
      widthInInches: 4,
    },
  ]);
});

test.serial('printerAPI: get current paper size', async (t) => {
  await initTmpConfigDir();

  const res = await fetch(`${serverAddr}/api/printer/size`, {
    method: 'get',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, {
    heightInInches: 1.125,
    id: 30252,
    name: '30252 Address: 1-1/8" x 3"',
    widthInInches: 3,
  });
});

test.serial('printerAPI: set current paper size', async (t) => {
  await initTmpConfigDir();

  let res = await fetch(`${serverAddr}/api/printer/size`, {
    method: 'post',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ 'paper_id': 30364 }),
  })
  t.deepEqual(res.status, 200);

  res = await fetch(`${serverAddr}/api/printer/size`, {
    method: 'get',
    headers: {
			'Content-Type': 'application/json',
		},
  })
  t.deepEqual(res.status, 200);

  const body = await res.json();
  t.deepEqual(body, {
		id: 30364,
		name: '30364 Name Badge: 2-1/4" x 4"',
		widthInInches: 4,
		heightInInches: 2.25,
	});
});

test.serial('printerAPI: return error if no paper ID', async (t) => {
  await initTmpConfigDir();

  let res = await fetch(`${serverAddr}/api/printer/size`, {
    method: 'post',
    headers: {
			'Content-Type': 'application/json',
		},
    body: JSON.stringify({ }),
  })
  t.deepEqual(res.status, 400);

  const body = await res.json();
  t.truthy(body.error);
  t.assert(body.error.msg.includes('Post body with \'paper_id\' is required.'));
});
