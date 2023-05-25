import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {getLabels} from '../api/_labels';

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
  logger.warn(`TODO: Need to show labels`, labels);
}

OnLoad(labelsList);
