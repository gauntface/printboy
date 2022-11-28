import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {getPresetImages, uploadImage} from './models/saved-images.js';
import {getPresetTitles, addTitle} from './models/saved-titles.js';
import {getPresetAddresses, addAddress} from './models/saved-addresses.js';
import {exec} from 'node:child_process';
import util from 'util';
import os from 'os';
import {mkdtemp, writeFile} from 'node:fs/promises';
import path from 'path';

const execP = util.promisify(exec);

const app = express();
const port = 1314;

app.use(cors({
  origin: 'http://localhost:1313',
}))
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.get('/api/labels/images', async (req, res) => {
  res.json(await getPresetImages());
});

app.post('/api/labels/images', async (req, res) => {
  if (!req.body['form-url']) {
    res.redirect(`${req.headers.referer}/`);
    return;
  }

  const redirect = `${req.headers.referer}${req.body['form-url']}`;
  if (!req.files || !req.files['upload-image']) {
    res.redirect(redirect);
    return;
  }

  const imgFile = req.files['upload-image'];
  await uploadImage(imgFile);
  res.redirect(redirect);
});

app.get('/api/labels/titles', async (req, res) => {
  res.json(await getPresetTitles());
});

app.post('/api/labels/titles', async (req, res) => {
  if (!req.body['form-url']) {
    res.redirect(`${req.headers.referer}/`);
    return;
  }

  const redirect = `${req.headers.referer}${req.body['form-url']}`;
  if (!req.body || !req.body.title) {
    res.redirect(redirect);
    return;
  }

  const title = req.body.title;
  await addTitle(title);
  res.redirect(redirect);
});

app.get('/api/labels/addresses', async (req, res) => {
  res.json(await getPresetAddresses());
});

app.post('/api/labels/addresses', async (req, res) => {
  if (!req.body['form-url']) {
    res.redirect(`${req.headers.referer}/`);
    return;
  }

  const redirect = `${req.headers.referer}${req.body['form-url']}`;
  if (!req.body || !req.body.address) {
    res.redirect(redirect);
    return;
  }

  const address = req.body.address;
  await addAddress(address);
  res.redirect(redirect);
});

app.post('/api/print', async (req, res) => {
  if (!req.body) {
    res.status(500);
    res.json({
      error: {
        msg: 'Body required',
      },
    });
    return;
  }

  const { copies, base64, widthInches, heightInches } = req.body;
  if (copies < 1) {
    res.status(500);
    res.json({
      error: {
        msg: 'Invalid copies value',
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
