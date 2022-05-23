import fs from 'fs';
import path from 'path';
import { titlesDir } from '../../lib/constants.js';

export async function post({ request }) {
  const { filename } = await request.json();

  fs.rmSync(path.join(titlesDir, filename))

  return {
    status: 200,
  };
}