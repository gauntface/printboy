import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {getImages, LabelImage} from '../api/_images';
import { rmElementChildren } from '../utils/_dom';

const CLASSNAME_PREVIEW = 'c-imgs-list__preview';
const CLASSNAME_LABEL = 'c-imgs-list__label';


function setPreview(element, imgs: Array<LabelImage>) {
  rmElementChildren(element);

  for (const i of imgs) {
    const img = document.createElement('img');
    img.src = i.base64;
    img.title = i.filename;

    const c = document.createElement('figcaption');
    c.textContent = i.filename;

    const wrapper = document.createElement('figure');
    wrapper.classList.add(CLASSNAME_PREVIEW);
    wrapper.appendChild(img);
    wrapper.appendChild(c);

    const input = document.createElement('input');
    input.type = "radio";
    input.name = "imageFilename";
    input.value = i.filename;

    const label = document.createElement('label');
    label.classList.add(CLASSNAME_LABEL);
    label.appendChild(input);
    label.appendChild(wrapper);

    element.appendChild(label);
  }
}

function noImagesMessage() {
  const p = document.createElement(`p`);
  p.textContent = "No images added yet.";
  return p;
}

async function imgsList() {
  const element = document.querySelector('.js-imgs-list');
  if (!element) {
    logger.error('Failed to find js-imgs-list element');
    return;
  }

  const imgs = await getImages();
  if (!imgs.length) {
    element.appendChild(noImagesMessage());
    return
  }

  setPreview(element, imgs);
}

OnLoad(imgsList);
