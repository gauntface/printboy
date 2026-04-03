import {OnLoad} from '../utils/_onload';
import {fetch} from '../api/_fetch';

async function setupApiForms() {
  const forms = document.querySelectorAll<HTMLFormElement>('.js-api-form');
  for (const form of forms) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const url = form.action;
      const method = form.method || 'POST';

      const options: RequestInit = {
        method,
      };

      if (form.enctype === 'multipart/form-data') {
        options.body = formData;
      } else {
        const data = Object.fromEntries(formData.entries());
        options.body = JSON.stringify(data);
        options.headers = {
          'Content-Type': 'application/json',
        };
      }

      try {
        const resp = await fetch(url, options);
        // On success, reload the page to show new data
        // This is a simple way to handle the update for now
        window.location.reload();
      } catch (err) {
        console.error('Form submission failed:', err);
        alert(`Failed to save: ${err.message}`);
      }
    });
  }
}

OnLoad(setupApiForms);
