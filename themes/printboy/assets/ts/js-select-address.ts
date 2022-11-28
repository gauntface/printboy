import {apiDomain} from './config';

async function run() {
	const selectionContainer = document.querySelector('.js-select-address');
	if (!selectionContainer) {
		return;
	}

	const existingInputs = selectionContainer.querySelectorAll('input');
	for (const i of existingInputs) {
		i.addEventListener('click', function(e) {
			const value = (e.target as HTMLInputElement).value;
			updateLabelPreviews(value);
		})
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

		input.addEventListener('click', function(e) {
			const value = (e.target as HTMLInputElement).value;
			updateLabelPreviews(value);
		});

		selectionContainer.appendChild(container);
	}
}

function updateLabelPreviews(value) {
	const previews = document.querySelectorAll('.js-label-preview');
	for (const p of previews) {
		(p['labelPreview'] as LabelPreview).setAddress(value);
	}
}

run();


