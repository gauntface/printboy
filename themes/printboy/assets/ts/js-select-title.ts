import {apiDomain} from './config';
import {LabelPreview} from './js-label-preview';

async function run() {
	const selectionContainer = document.querySelector('.js-select-title');
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

	const resp = await fetch(`${apiDomain}/api/labels/titles`);
	const titles = await resp.json();
	for (const title of titles) {
		const container = document.createElement('div');
		container.classList.add('c-create-label-selection');

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
		(p['labelPreview'] as LabelPreview).setTitle(value);
	}
}

run();


