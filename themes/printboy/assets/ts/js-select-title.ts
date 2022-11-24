import {apiDomain} from './config';

async function run() {
	const selectionContainer = document.querySelector('.js-select-title');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/titles`);
	const titles = await resp.json();
	for (const title of titles) {
		const container = document.createElement('div');
		container.classList.add('c-select-title');

		const input = document.createElement('input');
		input.type = "radio";
		input.name = "labeltitle";
		input.id = title.filename;
		input.value = title.text;

		const label = document.createElement('label');
		label.htmlFor = title.filename;
        label.textContent = title.text

		container.appendChild(input);
		container.appendChild(label);

		selectionContainer.appendChild(container);
	}
}

run();


