import {apiDomain} from '../config';

async function run() {
	const selectionContainer = document.querySelector('.js-img-settings tbody');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/images`);
	const imgs = await resp.json();
	for (const img of imgs) {
        const tr = document.createElement('tr');
        const tdImage = document.createElement('td');
        const tdName = document.createElement('td');
        const tdActions = document.createElement('td');

        tr.append(tdImage);
        tr.append(tdName);
        tr.append(tdActions);

		const imgElement = document.createElement('img');
		imgElement.src = img.base64;
        tdImage.appendChild(imgElement);

		tdName.textContent = img.filename;

        const btn = document.createElement('button') as HTMLButtonElement;
        btn.classList.add('drac-btn', 'drac-bg-purple-cyan');
        btn.textContent = 'Delete';
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            try {
                await fetch(`${apiDomain}/api/labels/images`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: img.filename,
                    })
                });

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


