import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {getPresetImages, uploadImage} from './models/saved-images.js';
import {getPresetTitles, addTitle} from './models/saved-titles.js';
import {getPresetAddresses, addAddress} from './models/saved-addresses.js';

const app = express();
const port = 1314;

app.use(cors({
  origin: 'http://localhost:1313',
}))
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
