import fs from 'fs';
import path from 'path';
import { imageDir } from '../../lib/constants.js';

export async function post({ request }) {
  const { filename, base64 } = await request.json();

  const base64Data = base64.split(",")[1];
  const binaryData  = Buffer.from(base64Data, 'base64').toString('binary')

  fs.mkdirSync(imageDir, {
    recursive: true,
  });
  fs.writeFileSync(path.join(imageDir, filename), binaryData);

  return {
    status: 200,
  };
}