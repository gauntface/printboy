import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { addressDir } from '../../lib/constants.js';

function hashForValue(v) {
  const shasum = crypto.createHash('sha1')
  shasum.update(v)
  return shasum.digest('hex');
}

export async function post({ request }) {
  const { address } = await request.json();
  const filename = `${hashForValue(address)}.txt`;
  fs.mkdirSync(addressDir, {
    recursive: true,
  });
  fs.writeFileSync(path.join(addressDir, filename), address);

  return {
    status: 200,
  };
}