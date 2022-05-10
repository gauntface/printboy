import fs from 'fs';
import path from 'path';
import util from 'util';
import {exec} from 'node:child_process';
import os from 'os';

const execP = util.promisify(exec);

export async function post({ request }) {
  console.log(`Time to print something...........`);
  const { copies, base64 } = await request.json();

  if (copies < 1) {
    return {
      status: 500,
      body: JSON.stringify({
        error: {
          msg: 'Invalid copies value',
        },
      }),
    };
  }

  const base64Data = base64.split(",")[1];
  // const binaryData  = Buffer.from(base64, 'base64').toString('binary')

  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), `printboy-`));
  const tmpfile = path.join(tmpdir, `label.png`);
  fs.writeFileSync(tmpfile, base64Data, 'base64');

  // "-o", "PageSize=30252_Address",
	// "-o", "PrintDensity=Light",
	// "-o", "PrintQuality=Graphics",
	const args = [
    "lp",
    "-d", "DYMO_LabelWriter_450_Turbo",
		tmpfile,
  ];

  console.log(`Print ${copies} of `, tmpfile);

  for (let i = 0; i < copies; i++) {
    try {
      await execP(args.join(' '));
    } catch (err) {
      return {
        status: 500,
        body: JSON.stringify({
          error: {
            msg: `Failed to run print command`,
            stderr: err.stderr,
          }
        }),
      }
    }
	}

  return {
    status: 200,
  };
}