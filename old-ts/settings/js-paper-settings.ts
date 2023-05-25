import {apiDomain} from '../config';
import {LabelPreview} from '../render/labelpreview';

async function run() {
	const selectElement = document.querySelector('.js-paper-settings select') as HTMLSelectElement;
	if (!selectElement) {
		return;
	}
	// <option value="30252" selected=""></option>
	// <option alue="30364">30364 Name Badge: 2-1/4" x 4"</option>

	const resp = await fetch(`${apiDomain}/api/labels/papers`);
	const papers = await resp.json();
	for (const paper of papers) {
		const option = document.createElement('option');
		option.value = paper.id;
		option.textContent = paper.name;
		selectElement.append(option);
		if (paper.current) {
			selectElement.value = option.value;
		}
	}

	selectElement.addEventListener('change', async (e) => {
			e.preventDefault();
			const selectElement = e.target as HTMLSelectElement;
			selectElement.disabled = true;
			try {
					const res = await fetch(`${apiDomain}/api/labels/current-paper`, {
							method: 'POST',
							headers: {
									'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								paperID: selectElement.value,
							})
					});
					if (!res.ok) {
						throw new Error('Request failed');
					}
			} catch(err) {
					console.error(`Failed to set current paper size: `, err);
			} finally {
				selectElement.disabled = false;
			}
	});
}

run();


