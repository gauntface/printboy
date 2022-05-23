import fs from 'fs';
import path from 'path';
import { imageDir } from '../../lib/constants.js';

export async function post({ request }) {
  const { filename } = await request.json();

  fs.rmSync(path.join(imageDir, filename))

  return {
    status: 200,
  };
}