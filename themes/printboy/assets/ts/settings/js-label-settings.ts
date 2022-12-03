import {apiDomain} from '../config';
import {LabelPreview} from '../render/labelpreview';

async function run() {
	const selectionContainer = document.querySelector('.js-label-settings tbody');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/presets`);
	const presets = await resp.json();
	for (const preset of presets) {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        const tdActions = document.createElement('td');

        tr.append(tdTitle);
        tr.append(tdActions);

        const canvas = document.createElement('canvas');
				canvas.classList.add('c-label-preview');
				canvas.setAttribute("width-inches", "3");
				canvas.setAttribute("height-inches", "1.125");
				tdTitle.appendChild(canvas);

				const lp = new LabelPreview(canvas);
				lp.setImage(preset.image.base64, false);
				lp.setTitle(preset.title.text, false);
				lp.setAddress(preset.address.text, false);
				lp.refresh();

        const btn = document.createElement('button') as HTMLButtonElement;
        btn.classList.add('drac-btn', 'drac-bg-purple-cyan');
        btn.textContent = 'Delete';
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            try {
                const res = await fetch(`${apiDomain}/api/labels/presets`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: preset.filename,
                    })
                });
								if (!res.ok) {
									throw new Error('Request failed');
								}

                selectionContainer.removeChild(tr);
            } catch(err) {
                console.error(`Failed to delete image: `, err);
            } finally {
                e.target.disabled = false;
            }
        });
        tdActions.appendChild(btn);

		selectionContainer.appendChild(tr);
	}
}

run();


