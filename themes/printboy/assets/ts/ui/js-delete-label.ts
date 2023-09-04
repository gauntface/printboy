import {OnLoad} from '../utils/_onload';
import {logger} from '@gauntface/logger';
import {fetch} from '../api/_fetch';

async function deleteLabel() {
  const searchParams = new URLSearchParams(window.location.search);
  const filename = searchParams.get('label');
  if (!filename) {
    // TODO: show error message;
    throw new Error(`Failed to get "label" from the search parameters`);
  }

  const element = document.querySelector('.js-delete-label');
  if (!element) {
    logger.error('Failed to find js-label-search-param element');
    return;
  }
  element.disabled = false;
  element.addEventListener('click', async (e) => {
    e.preventDefault();
    element.disabled = true;
    try {
      await fetch('/api/label', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
        }),
      });
    } catch (err) {
      console.warn('Delete request returned an error: ', err);
    }
    window.location.href = '/';
  });
}

OnLoad(deleteLabel);
