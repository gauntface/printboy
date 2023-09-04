import {fetch} from './_fetch';

export async function getImages(): Promise<ImageData> {
  const data = await fetch('/api/label/images', {
    method: 'GET',
  });
  return data;
}

export interface LabelImage {
  base64: string;
  filename: string;
  filepath: string;
}
