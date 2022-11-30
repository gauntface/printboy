import {apiDomain} from '../config';

async function run() {
	const selectionContainer = document.querySelector('.js-address-settings tbody');
	if (!selectionContainer) {
		return;
	}

	const resp = await fetch(`${apiDomain}/api/labels/addresses`);
	const addresses = await resp.json();
	for (const address of addresses) {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        const tdActions = document.createElement('td');

        tr.append(tdTitle);
        tr.append(tdActions);

		tdTitle.textContent = address.text;

        const btn = document.createElement('button') as HTMLButtonElement;
        btn.classList.add('drac-btn', 'drac-bg-purple-cyan');
        btn.textContent = 'Delete';
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            try {
                await fetch(`${apiDomain}/api/labels/addresses`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: address.filename,
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


