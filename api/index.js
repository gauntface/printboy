import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {getPresetImages, uploadImage, deletePresetImage} from './models/saved-images.js';
import {getPresetTitles, addTitle, deletePresetTitle} from './models/saved-titles.js';
import {getPresetAddresses, addAddress, deletePresetAddress} from './models/saved-addresses.js';
import {getPresetLabels, addLabel, deletePresetLabel, getSavedLabel} from './models/saved-labels.js';
import {setCurrentPaperSize, getCurrentPaperSize, getAllPaperSizes} from './models/paper.js';
import {exec} from 'node:child_process';
import util from 'util';
import os from 'os';
import {mkdtemp, writeFile} from 'node:fs/promises';
import path from 'path';
import { URL } from 'url';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv

const execP = util.promisify(exec);

const app = express();
const port = 1314;

if (argv.cors) {
  console.warn(`⚠️ Enabling cors for ${argv.cors}`);
  app.use(cors({
    origin: argv.cors,
  }))
}
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.static(path.join(new URL('.', import.meta.url).pathname, 'static')));

app.get('/api/label/images', async (req, res) => {
  res.json(await getPresetImages());
});

app.delete('/api/label/image', async (req, res) => {
  if (!req.body || !req.body.filename) {
    res.status(400);
    res.json({
      error: {
        msg: 'Filename must be provided.',
      }
    });
    return;
  }
  await deletePresetImage(req.body.filename);
  res.json({});
});

app.post('/api/label/images', async (req, res) => {
  const redirect = req.headers.referer || '/';
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

app.delete('/api/labels/titles', async (req, res) => {
  if (!req.body || !req.body.filename) {
    res.status(400);
    res.json({
      error: {
        msg: 'Filename must be provided.',
      }
    });
    return;
  }
  await deletePresetTitle(req.body.filename);
  res.json({});
});

app.post('/api/labels/titles', async (req, res) => {
  const redirect = req.headers.referer || '/';
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

app.delete('/api/labels/addresses', async (req, res) => {
  if (!req.body || !req.body.filename) {
    res.status(400);
    res.json({
      error: {
        msg: 'Filename must be provided.',
      }
    });
    return;
  }
  await deletePresetAddress(req.body.filename);
  res.json({});
});

app.post('/api/labels/addresses', async (req, res) => {
  const redirect = req.headers.referer || '/';
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

  const { quantity, base64, widthInches, heightInches } = req.body;
  if (quantity < 1) {
    res.status(500);
    res.json({
      error: {
        msg: 'Invalid quantity value',
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

app.get('/api/labels', async (req, res) => {
  res.json(await getPresetLabels());
});


app.get('/api/label/:filename', async (req, res) => {
  res.json(await getSavedLabel(req.params.filename));
});

app.post('/api/label', async (req, res) => {
  if (!req.body) {
    res.status(400);
    res.json({
      error: {
        msg: 'Request must contain a body.',
      }
    });
    return;
  }

  try {
    const filename = await addLabel(req.body);
    if (req.body.redirect) {
      const url = new URL(req.body.redirect, req.headers.referer || '/');
      url.searchParams.set('label', filename);
      res.redirect(url.href);
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(400);
    res.json({
      error: {
        msg: `Failed to save label: ${err}`,
      },
    });
  }
});

app.delete('/api/label', async (req, res) => {
  if (!req.body || !req.body.filename) {
    res.status(400);
    res.json({
      error: {
        msg: 'Filename must be provided.',
      }
    });
    return;
  }
  await deletePresetLabel(req.body.filename);
  res.json({});
});

app.get('/api/labels/papers', async (req, res) => {
  res.json(await getAllPaperSizes());
});

app.get('/api/labels/current-paper', async (req, res) => {
  res.json(await getCurrentPaperSize());
});

app.post('/api/labels/current-paper', async (req, res) => {
  if (!req.body) {
    res.status(500);
    res.json({
      error: {
        msg: 'Body required',
      },
    });
    return;
  }

  try {
    const { paperID } = req.body;
    await setCurrentPaperSize(paperID);
    res.json({});
  } catch (err) {
    res.status(400);
    res.json({
      error: {
        msg: `Failed to save label: ${err}`,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
