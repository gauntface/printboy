import path from 'path';
import {readdir, readFile} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';

const IMAGES_DIR = 'images';

export async function getPresetImages() {
  const imgPath = await pathForLabelSettings(IMAGES_DIR);
  const images = [];
  const imgFiles = await readdir(imgPath);
  for (const filename of imgFiles) {
    const filepath = path.join(imgPath, filename);
    const base64 = await readFile(filepath, {
      encoding: "base64",
    });
    let prefix = '';
    switch (path.extname(filename)) {
      case '.svg':
        prefix = 'data:image/svg+xml;base64,';
        break;
      default:
        console.warn(`Unknown image file extension: ${path.extname(filename)}`);
    }
    images.push({
      filename,
      filepath,
      base64: `${prefix}${base64}`,
    });
  }
  return images;
}

export async function uploadImage(img) {
  const p = await pathForLabelSettings(IMAGES_DIR);
	await img.mv(path.join(p, img.name));
}
