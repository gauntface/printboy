import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {getPresetImages, uploadImage} from './models/saved-images.js';

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
