import test from 'ava';

import { express } from "../../../api/utils/express.js";

test.serial('getAsync: returns error ', async (t) => {
  const app = express();
  app.getAsync('/', async () => {
    throw new Error('Injected error');
  });

  const {server, addr} = await startServer(app);

  const res = await fetch(`${addr}`, {
    headers: {
			'Content-Type': 'application/json',
		},
  });

  t.deepEqual(res.status, 500);
  t.assert((await res.text()).includes('Injected error'));

  server.close();
});

async function startServer(app) {
  const server = await new Promise((resolve, reject) => {
    const server = app.listen(function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(server);
    });
  });

  const port = server.address().port;
  return {server, addr: `http://127.0.0.1:${port}`};
}
