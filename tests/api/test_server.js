import test from 'ava';

import { createApp } from "../../api/server.js";

test.serial('start server with cors', async (t) => {
  const app = createApp({ cors: 'http://localhost:1234'});
  t.truthy(app);
})
