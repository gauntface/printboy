import {apiDomain} from './config';

async function run() {
	const selectionContainer = document.querySelector('.js-select-address');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/addresses`);
	const addresses = await resp.json();
	for (const addr of addresses) {
		const container = document.createElement('div');
		container.classList.add('c-select-address');

		const input = document.createElement('input');
		input.type = "radio";
		input.name = "labeladdress";
		input.id = addr.filename;
		input.value = addr.text;

		const label = document.createElement('label');
		label.htmlFor = addr.filename;
        label.textContent = addr.text

		container.appendChild(input);
		container.appendChild(label);

		selectionContainer.appendChild(container);
	}
}

run();


