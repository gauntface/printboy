import {OnLoad} from '../utils/_onload';
import { apiDomain } from '../config';
import {logger} from '@gauntface/logger';

async function imgDrop() {
  const element = document.querySelector('.js-paper-select-input');
  if (!element) {
    logger.error('Failed to find js-paper-select-input element');
    return;
  }

  const resp = await fetch(`${apiDomain}/api/labels/papers`);
  if (!resp.ok) {
    logger.error(`Failed to get paper sizes: ${resp.status}`);
    return;
  }
  const sizes = await resp.json();
  for (const s of sizes) {
    const select = document.createElement('option');
    select.value = s.id;
    select.textContent = s.name;
    element.appendChild(select);
    if (s.current) {
      element.value = s.id;
    }
  }
}

OnLoad(imgDrop);
