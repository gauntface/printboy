import {apiDomain} from './config';
import {LabelPreview} from './js-label-preview';

function getSelectedValueID(name) {
	const input = document.querySelector(`input[name=${name}]:checked`) as HTMLInputElement;
	if (!input) {
		throw new Error(`Failed to find a selected input with name ${name}`);
	}
	if (!input.value) {
		return "";
	}
	return input.id;
}

async function run() {
	const saveButton = document.querySelector('.js-save-label');
	if (!saveButton) {
		return;
	}

	saveButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const btn = e.target as HTMLButtonElement;
		btn.disabled = true;

		try {
			await fetch(`${apiDomain}/api/labels/presets`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					imageFilename: getSelectedValueID('labelimage'),
					titleFilename: getSelectedValueID('labeltitle'),
					addressFilename: getSelectedValueID('labeladdress'),
				}),
			});
		} catch (err) {
			console.error('Failed to print: ', err);
		} finally {
			btn.disabled = false;
		}
	})

    saveButton.disabled = false;
}

run();


