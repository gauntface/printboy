import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import { createApp } from './server.js';

const argv = yargs(hideBin(process.argv)).argv

const port = 1314;

const app = createApp({ cors: argv['cors'] });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
