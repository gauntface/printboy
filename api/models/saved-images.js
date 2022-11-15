import path from 'path';
import os from 'os';
import {readdir, readFile, mkdir} from 'node:fs/promises';
import {exists} from '../utils/files.js';

export const imageDir = path.join(os.homedir(), '.printboy', 'labels', 'images');

export async function getPresetImages() {
  if (!await exists(imageDir)) {
    return [];
  }

  const images = [];
  const imgFiles = await readdir(imageDir);
  for (const filename of imgFiles) {
    const filepath = path.join(imageDir, filename);
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
	await mkdir(imageDir, { recursive: true });
	await img.mv(path.join(imageDir, img.name));
}
