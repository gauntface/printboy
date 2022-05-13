import { titlesDir, saveTextFile } from '../../lib/constants.js';

export async function post({ request }) {
  const { name } = await request.json();
  await saveTextFile(titlesDir, name);
  return {
    status: 200,
  };
}