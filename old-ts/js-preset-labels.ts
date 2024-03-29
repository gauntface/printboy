import {apiDomain} from './config';
import {LabelPreview} from './render/labelpreview';
import {printLabel} from './api/printlabel';

async function run() {
	const labelsContainer = document.querySelector('.js-preset-labels');
	if (!labelsContainer) {
		return;
	}

	while (labelsContainer.firstChild) {
		labelsContainer.removeChild(labelsContainer.firstChild);
}

	const resp = await fetch(`${apiDomain}/api/labels/presets`);
	const presets = await resp.json();
	if (presets.length == 0) {
		labelsContainer.textContent = '👋 Hello. To add a quick print, create a new label and hit save.'
		return;
	}

	for (const preset of presets) {
		const canvas = document.createElement('canvas');
		canvas.classList.add('c-label-preview');
		labelsContainer.appendChild(canvas);

		const lp = new LabelPreview(canvas);
		lp.setImage(preset.image.base64, false);
		lp.setTitle(preset.title.text, false);
		lp.setAddress(preset.address.text, false);
		lp.refresh();

		canvas.addEventListener('click', async (e) => {
			e.preventDefault();
			const canvas = e.target as HTMLCanvasElement;
			try {
				const lp = canvas['labelPreview'] as LabelPreview;
				await printLabel(lp, 1);
			} catch (err) {
					console.error('Failed to print: ', err);
			}
		});
	}
}

run();


