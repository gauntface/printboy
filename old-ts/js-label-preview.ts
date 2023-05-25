import {OnLoad} from './utils/_onload';
import {LabelPreview} from './render/labelpreview';

OnLoad(() => {
	const canvases = document.querySelectorAll('.js-label-preview');
	for (const c of canvases) {
		new LabelPreview(c as HTMLCanvasElement);
	}
});
