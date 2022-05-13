import { addressDir, saveTextFile } from '../../lib/constants.js';

export async function post({ request }) {
  const { address } = await request.json();
  await saveTextFile(addressDir, address);
  return {
    status: 200,
  };
}