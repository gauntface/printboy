import path from 'path';
import os from 'os';
import fs from 'fs';
import crypto from 'crypto';

export const imageDir = path.join(os.homedir(), '.printboy', 'labels', 'images');
export const titlesDir = path.join(os.homedir(), '.printboy', 'labels', 'titles');
export const addressDir = path.join(os.homedir(), '.printboy', 'labels', 'addresses');
export const configDir = path.join(os.homedir(), '.printboy', 'config');

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

export function getSupportedSizes() {
  return [
    {
      id: 30252,
      name: "30252 Address",
      widthInches: 3,
      heightInches: 1.125,
    },
    {
      id: 30364,
      name: "30364 Name Badge",
      widthInches: 4,
      heightInches: 2.25,
    },
  ];
}

const labelSizeFile = 'labelsize.json';
export function getCurrentSize() {
  const filePath = path.join(configDir, labelSizeFile);
  try {
    const contents = fs.readFileSync(filePath);
    const config = JSON.parse(contents.toString());
    if (!config || !config.id) {
      throw new Error(`Failed to find config ID`);
    }
    for (const s of getSupportedSizes()) {
      if (s.id == config.id) {
        return s;
      }
    }
  } catch (err) {}
  return getSupportedSizes()[0];
}

export function saveCurrentSize(id) {
  const filePath = path.join(configDir, labelSizeFile);
  fs.mkdirSync(configDir, {
    recursive: true,
  });
  let size = null;
  for (const s of getSupportedSizes()) {
    if (s.id == id) {
      size = s;
      break;
    }
  }
  if (size != null) {
    fs.writeFileSync(filePath, JSON.stringify(size));
  } else {
    throw new Error(`Failed to find size details for ${id}`);
  }
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