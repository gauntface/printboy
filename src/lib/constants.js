import path from 'path';
import os from 'os';
import fs from 'fs';
import crypto from 'crypto';

export const imageDir = path.join(os.homedir(), '.printboy', 'labels', 'images');
export const titlesDir = path.join(os.homedir(), '.printboy', 'labels', 'titles');
export const addressDir = path.join(os.homedir(), '.printboy', 'labels', 'addresses');

function getPresetImages() {
  if (!fs.existsSync(imageDir)) {
    return [];
  }

  const images = [];
  const imgFiles = fs.readdirSync(imageDir);
  for (const filename of imgFiles) {
    const filepath = path.join(imageDir, filename);
    const base64 = fs.readFileSync(filepath, {
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

function readTextFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const values = [];
  const files = fs.readdirSync(dir);
  for (const filename of files) {
    const filepath = path.join(dir, filename);
    values.push({
      filename,
      text: fs.readFileSync(filepath).toString(),
    });
  }
  return values
}

export function getLabelPresets() {
  return {
    images: getPresetImages(),
    titles: readTextFiles(titlesDir),
    addresses: readTextFiles(addressDir),
  };
}

function hashForValue(v) {
  const shasum = crypto.createHash('sha1')
  shasum.update(v)
  return shasum.digest('hex');
}

export async function saveTextFile(dir, value) {
  const filename = `${hashForValue(value)}.txt`;
  fs.mkdirSync(dir, {
    recursive: true,
  });
  fs.writeFileSync(path.join(dir, filename), value);
}