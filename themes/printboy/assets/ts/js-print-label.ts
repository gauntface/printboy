import {apiDomain} from './config';
import {LabelPreview} from './js-label-preview';

async function run() {
	const printButton = document.querySelector('.js-print-label');
    const copiesInput = document.querySelector('.js-print-copies');
    const labelPreview = document.querySelector('.js-label-preview');
	if (!printButton || !copiesInput || !labelPreview) {
		return;
	}

	printButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.target as HTMLButtonElement;
        btn.disabled = true;
        const copies = copiesInput.value;

        try {
            const lp = labelPreview['labelPreview'] as LabelPreview;
            await fetch(`${apiDomain}/api/print`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                copies: copies,
                base64: lp.labelAsBase64(),
                widthInches: lp.widthInInches(),
                heightInches: lp.heightInInches(),
              }),
            })
        } catch (err) {
            console.error('Failed to print: ', err);
        } finally {
          btn.disabled = false;
        }
    })

    printButton.disabled = false;
}

run();


