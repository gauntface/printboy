import fs from 'fs';
import path from 'path';
import { nameDir } from '../../lib/constants.js';

export async function post({ request }) {
  const { name } = await request.json();
  const filename = `${name}.txt`;
  fs.mkdirSync(nameDir, {
    recursive: true,
  });
  fs.writeFileSync(path.join(nameDir, filename), name);

  return {
    status: 200,
  };
}