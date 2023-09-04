import {fetch} from './_fetch';

export async function getLabels() {
  const data = await fetch('/api/labels', {
    method: 'GET',
  });
  return data;
}
