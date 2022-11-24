import {apiDomain} from './config';
import {LabelPreview} from './js-label-preview';

async function run() {
	const selectionContainer = document.querySelector('.js-select-img');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/images`);
	const imgs = await resp.json();
	for (const img of imgs) {
		const container = document.createElement('div');
		container.classList.add('c-select-img');

		const input = document.createElement('input');
		input.type = "radio";
		input.name = "labelimage";
		input.id = img.filename;
		input.value = img.base64;

		const label = document.createElement('label');
		label.htmlFor=img.filename;

		const imgElement = document.createElement('img');
		imgElement.src = img.base64;

		const span = document.createElement('span');
		span.textContent = img.filename;

		label.appendChild(imgElement);
		label.appendChild(span);

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
		(p['labelPreview'] as LabelPreview).setImage(value);
	}
}

run();


