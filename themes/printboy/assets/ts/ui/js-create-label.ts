import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import { LabelComponent } from './label-component';

const CLASSNAME_LABEL = 'l-labels-list__label';
const CLASSNAME_LABEL_CANVAS = 'l-labels-list__label-canvas';

async function labelForm() {
  const element = document.querySelector('.js-create-label');
  if (!element) {
    logger.error('Failed to find js-label-form element');
    return;
  }

  const labelWrapper = document.createElement('div');
  labelWrapper.classList.add(CLASSNAME_LABEL);

  const canvas = document.createElement('canvas');
  canvas.classList.add(CLASSNAME_LABEL_CANVAS);

  labelWrapper.appendChild(canvas);
  element.appendChild(labelWrapper);

  const label = new LabelComponent(canvas);

  // TODO Setup form listeners
  const form = document.querySelector('.js-create-label__form');
  if (form) {
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            const radios = node.querySelectorAll('.js-label-image');
            for (const r of radios) {
              if (r.attributes['base64']) {
                r.addEventListener('change', (e) => {
                  label.setImage(r.getAttribute('base64'));
                });
              }
            }
          }
        } else {
          console.warn(`Unknown mutation type: ${mutation.type}`);
        }
      }
    });
    observer.observe(form, {
      childList: true,
      subtree: true,
    });

    const titleInput = form.querySelector('.js-label-title');
    if (titleInput){
      titleInput.addEventListener('input', (e) => {
        label.setTitle(titleInput.value);
      });
    }
    const contentInput = form.querySelector('.js-label-content');
    if (contentInput) {
      contentInput.addEventListener('input', (e) => {
        label.setContent(contentInput.value);
      });
    }
  }
}

OnLoad(labelForm);
