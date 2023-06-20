import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {apiDomain} from '../config';
import {getLabels} from '../api/_labels';
import { LabelComponent } from './label-component';

const CLASSNAME_LABEL = 'l-labels-list__label';
const CLASSNAME_LABEL_CANVAS = 'l-labels-list__label-canvas';

function noLabelsMessage() {
  const p = document.createElement(`p`);
  p.textContent = "No labels created yet.";
  return p;
}

async function printLabel() {
  const element = document.querySelector('.js-print-label');
  if (!element) {
    logger.error('Failed to find js-print-label element');
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const filename = searchParams.get('label');
  if (!filename) {
    // TODO: show error message;
    throw new Error(`Failed to get "label" from the search parameters`);
  }

  const response = await fetch(`${apiDomain}/api/label/${filename}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Failed to get label: ${response.status}`);
  }
  const label = await response.json();

  const labelWrapper = document.createElement('div');
  labelWrapper.classList.add(CLASSNAME_LABEL);

  const canvas = document.createElement('canvas');
  canvas.classList.add(CLASSNAME_LABEL_CANVAS);
  canvas.attributes["title"] = label.title;
  canvas.attributes["content"] = label.content;
  canvas.attributes["image"] = label.image.base64;

  labelWrapper.appendChild(canvas);
  element.appendChild(labelWrapper);

  new LabelComponent(canvas);
}

OnLoad(printLabel);
