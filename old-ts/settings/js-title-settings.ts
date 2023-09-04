import {apiDomain} from '../config';

async function run() {
	const selectionContainer = document.querySelector('.js-title-settings tbody');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/titles`);
	const titles = await resp.json();
	for (const title of titles) {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        const tdActions = document.createElement('td');

        tr.append(tdTitle);
        tr.append(tdActions);

		tdTitle.textContent = title.text;

        const btn = document.createElement('button') as HTMLButtonElement;
        btn.classList.add('drac-btn', 'drac-bg-purple-cyan');
        btn.textContent = 'Delete';
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            try {
                await fetch(`${apiDomain}/api/labels/titles`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: title.filename,
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


