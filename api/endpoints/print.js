import {mkdtemp, writeFile} from 'node:fs/promises';
import * as path from 'path';
import * as os from 'os';
import {exec} from 'node:child_process';
import {promisify} from 'util';

// Exported so tests can mock the behavior
let execP = promisify(exec);

export function overrideExec(fn) {
  execP = fn
}

export async function printAPI(req, res) {
  const { copies, base64, widthInches, heightInches } = req.body;
  if (copies < 1) {
    res.status(500);
    res.json({
      error: {
        msg: `One or more copies must be specified. Received '${copies}' `,
      },
    });
    return;
  }

  const base64Data = base64.split(",")[1];

  const tmpdir = await mkdtemp(path.join(os.tmpdir(), `printboy-`));
  const tmpfile = path.join(tmpdir, `label.png`);
  await writeFile(tmpfile, base64Data, 'base64');

  // From https://www.cups.org/doc/options.html#OPTIONS
  // "-o media=Custom.<Width>x<Height>in"
  const args = [
    "lp",
    "-d", "DYMO_LabelWriter_450_Turbo",
    // The width and height is rotated on the printer.
    "-o", `media=Custom.${heightInches}x${widthInches}in`,
    tmpfile,
  ];

  for (let i = 0; i < copies; i++) {
    try {
      await execP(args.join(' '));
    } catch (err) {
      res.status(500);
      res.json({
        error: {
          msg: `Failed to run print command`,
          stderr: err.stderr,
        },
      });
      return;
    }
  }

  res.json({});
}
