import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {getLabels} from '../api/_labels';
import { LabelComponent } from './label-component';

const CLASSNAME_LABEL = 'l-labels-list__label';
const CLASSNAME_IS_CLICKABLE = 'l-labels-list--clickable';
const CLASSNAME_LABEL_CANVAS = 'l-labels-list__label-canvas';

function noLabelsMessage() {
  const p = document.createElement(`p`);
  p.textContent = "No labels created yet.";
  return p;
}

async function labelsList() {
  const element = document.querySelector('.js-labels-list');
  if (!element) {
    logger.error('Failed to find js-labels-list element');
    return;
  }

  const labels = await getLabels();
  if (!labels.length) {
    element.appendChild(noLabelsMessage());
    return
  }

  for(const label of labels) {
    const labelWrapper = document.createElement('div');
    labelWrapper.classList.add(CLASSNAME_LABEL);
    labelWrapper.classList.add(CLASSNAME_IS_CLICKABLE);
    labelWrapper.addEventListener('click', () => {
      window.location.href = `/print-label/?label=${label.filename}`;
    });

    const canvas = document.createElement('canvas');
		canvas.classList.add(CLASSNAME_LABEL_CANVAS);
    canvas.attributes["title"] = label.title;
    canvas.attributes["content"] = label.content;
    canvas.attributes["image"] = label.image.base64;

		labelWrapper.appendChild(canvas);
    element.appendChild(labelWrapper);

    new LabelComponent(canvas);
  }
}

OnLoad(labelsList);
