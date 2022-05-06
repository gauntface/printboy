import path from 'path';
import os from 'os';
import fs from 'fs';

export const imageDir = path.join(os.homedir(), '.printboy', 'labels', 'images');

export function getLabelPresets() {
  let images = [];
  if (fs.existsSync(imageDir)) {
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
  }

  return {
    images,
  };
}