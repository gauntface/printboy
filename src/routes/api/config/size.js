import { getCurrentSize, saveCurrentSize } from '../../../lib/constants.js';

export async function get({ request }) {
  return {
    status: 200,
    body: JSON.stringify(await getCurrentSize()),
  };
}

export async function post({ request }) {
  const { id } = await request.json();

  try {
    await saveCurrentSize(id);
  } catch (err) {
    return {
      status: 400,
      body: JSON.stringify({
        error: {
          msg: 'You must provide a valid id',
        }
      }),
    }
  }

  return {
    status: 200,
  };
}