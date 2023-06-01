import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {getLabels} from '../api/_labels';
import { LabelComponent } from './label-component';

const CLASSNAME_LABEL = 'c-labels-list__label';
const CLASSNAME_LABEL_CANVAS = 'c-labels-list__label-canvas';

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
