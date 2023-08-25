import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {fetch} from '../api/_fetch';
import { LabelComponent } from './label-component';

const CLASSNAME_LABEL = 'l-labels-list__label';
const CLASSNAME_LABEL_CANVAS = 'l-labels-list__label-canvas';

async function printLabel() {
  const element = document.querySelector('.js-print-label');
  if (!element) {
    logger.error('Failed to find js-print-label element');
    return;
  }
  const preview = document.querySelector('.js-print-preview');
  if (!preview) {
    logger.error('Failed to find js-print-preview element');
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const filename = searchParams.get('label');
  if (!filename) {
    // TODO: show error message;
    throw new Error(`Failed to get "label" from the search parameters`);
  }

  const labelData = await fetch(`/api/label/${filename}`, {
    method: 'GET',
  });

  const labelWrapper = document.createElement('div');
  labelWrapper.classList.add(CLASSNAME_LABEL);

  const canvas = document.createElement('canvas');
  canvas.classList.add(CLASSNAME_LABEL_CANVAS);
  canvas.attributes["title"] = labelData.title;
  canvas.attributes["content"] = labelData.content;
  canvas.attributes["image"] = labelData.image.base64;

  labelWrapper.appendChild(canvas);
  preview.appendChild(labelWrapper);

  const label = new LabelComponent(canvas);

  element.disabled = false;
  element.addEventListener('click', async (e) => {
    e.preventDefault();
    element.disabled = true;
    try {
      await fetch('/api/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          base64: label.asBase64(),
          widthInches: label.widthInInches(),
          heightInches: label.heightInInches(),
        }),
      });
    } catch (err) {
      console.warn('Print request returned an error: ', err);
    } finally {
      element.disabled = false;
    }
  });
}

OnLoad(printLabel);
