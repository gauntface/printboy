import fs from 'fs';
import path from 'path';
import { addressDir } from '../../lib/constants.js';

export async function post({ request }) {
  const { filename } = await request.json();

  fs.rmSync(path.join(addressDir, filename))

  return {
    status: 200,
  };
}