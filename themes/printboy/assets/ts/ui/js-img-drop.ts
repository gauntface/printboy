import {OnLoad} from '../utils/_onload';
import {rmElementChildren} from '../utils/_dom';
import {logger} from '@gauntface/logger';

const CLASSNAME_ACTIVE = 'c-img-drop--active';
const CLASSNAME_PREVIEW = 'c-img-drop__preview';

function setPreview(input) {
  const element = document.querySelector('.js-img-drop-preview');
  if (!element) {
    logger.error('Failed to find js-img-drop-preview element');
    return;
  }

  rmElementChildren(element);

  for (const file of input.files) {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (event) => {
      const f = event.target;
      if (!f) {
        logger.error(`Failed to read file: ${file.name}`);
        return;
      }

      const img = document.createElement('img');
      img.src = `${f.result}`;
      img.title = file.name;

      const c = document.createElement('figcaption');
      c.textContent = file.name;

      const wrapper = document.createElement('figure');
      wrapper.classList.add(CLASSNAME_PREVIEW);
      wrapper.appendChild(img);
      wrapper.appendChild(c);

      element.appendChild(wrapper);
    });
    //Read the image
    fileReader.readAsDataURL(file);
  }
}

function initDragAndDrop(element, input) {
  // This prevents the default browser behavior.
  element.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  // This adds classes to element
  element.addEventListener('dragenter', (event) => {
    event.preventDefault();
    element.classList.add(CLASSNAME_ACTIVE);
  });
  element.addEventListener('dragleave', (event) => {
    event.preventDefault();
    element.classList.remove(CLASSNAME_ACTIVE);
  });

  // This determines when the user has dropped a file.
  element.addEventListener('drop', (event) => {
    event.preventDefault();
    element.classList.remove(CLASSNAME_ACTIVE);

    const dataTransfer = (event as DragEvent).dataTransfer;
    if (!dataTransfer) {
      logger.warn(`Data transfer was not defined`, event);
      return;
    }
    logger.log(`${dataTransfer.files.length} file(s) were dropped.`);

    const imageTransfer = new DataTransfer();
    for (const file of dataTransfer.files) {
      if (!file.type.match('image/svg')) {
        logger.warn('Ignoring file that is not an SVG: ', file);
        continue;
      }
      imageTransfer.items.add(file);
    }

    logger.log(`${imageTransfer.files.length} file(s) are valid inputs.`);
    input.files = imageTransfer.files;
    setPreview(input);

  });
}

function initInput(input) {
  input.addEventListener('change', (event) => {
    const files = (input as HTMLInputElement).files;
    setPreview(input);
  })
}

async function imgDrop() {
  const element = document.querySelector('.js-img-drop');
  if (!element) {
    logger.error('Failed to find js-img-drop element');
    return;
  }
  const input = element.querySelector('input');
  if (!input) {
    logger.error('Failed to find js-img-drop > input');
    return;
  }
  initDragAndDrop(element, input);
  initInput(input);
}

OnLoad(imgDrop);
