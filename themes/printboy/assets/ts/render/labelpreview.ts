import { TextGroup } from './textgroup';
import {apiDomain} from '../config';

export class LabelPreview {
	private _canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;
	private _b64Img: string;
	private _title: string;
	private _address: string;
	private _widthInInches: number;
	private _heightInInches: number;

	constructor(canvas: HTMLCanvasElement) {
			this._canvas = canvas;
			const context = canvas.getContext('2d');
			if (!context) {
					throw new Error('Failed to get a 2d context');
			}
			this._context = context;
			this._canvas['labelPreview'] = this;

			this.setup();
	}

	async setup() {
		const resp = await fetch(`${apiDomain}/api/labels/current-paper`);
		const paper = await resp.json();
		this._widthInInches = Number(paper.widthInInches);
		this._heightInInches = Number(paper.heightInInches);
		this._canvas.width = Math.floor(this._widthInInches * 300);
		this._canvas.height = Math.floor(this._heightInInches * 300);
		this.refresh();
	}

	labelAsBase64() {
		return this._canvas.toDataURL();
	}

	widthInInches() {
		return this._widthInInches;
	}

	heightInInches() {
		return this._heightInInches;
	}

	setImage(value, refresh=true) {
			this._b64Img = value
			if (refresh) this.refresh();
	}

	setTitle(value, refresh=true) {
		this._title = value;
		if (refresh) this.refresh();
	}

	setAddress(value, refresh=true) {
		this._address = value;
		if (refresh) this.refresh();
	}

	refresh() {
			// Clear canvas
			this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)

			const columns = [];
			if (this._b64Img) {
				columns.push(this.imageColumn());
			}

			if (this._title || this._address) {
				columns.push(this.addressColumn());
			}

			if (!columns.length) {
				return;
			}

			const portions = this.getPortions(columns);
			const total = portions.reduce((pv, v) => pv + v);
			const padding = this._canvas.height * 0.1;
			const gap = padding / 2;
			const usableWidth = this._canvas.width - (2 * padding) - ((columns.length - 1) * gap);
			const usableHeight = this._canvas.height - (2 * padding);
			const pw = usableWidth / total;
			let left = padding;
			const top = padding;
			for (let i = 0; i < columns.length; i++) {
				const col = columns[i];
				const colWidth = portions[i] * pw;
				const height = usableHeight;
				col.draw(colWidth, height, left, top);

				left += colWidth + gap;
			}
	}

	imageColumn() {
		return {
			draw: async (w, h, l, t) => {
				const img = await this.genImage(this._b64Img);
				const min = Math.min(w, h);
				const centerX = (w - min) / 2;
				const centerY = (h - min) / 2;
				this._context.drawImage(img, l + centerX, t + centerY, min, min);
			},
		}
	}

	addressColumn() {
		return {
			draw: async (w, h, l, t) => {
				const textGroups = [];
				if (this._title) {
					textGroups.push(new TextGroup(this._title, 700, 'Roboto', 0));
				}
				if (this._address) {
					textGroups.push(new TextGroup(this._address, 400, 'Roboto', -8));
				}

				const fontSize = this.findFontSize(textGroups, w, h);
				const measure = this.calcTextGroupSize(textGroups, fontSize);
				let x = l + (w - measure.width);
				let y = t + ((h - measure.height) / 2);
				for (const tg of textGroups) {
					const measure = tg.draw(this._context, fontSize, x, y);
					y += measure.height;
				}
			}
		}
	}

	findFontSize(textGroups, availableWidth, availableHeight) {
		let fontSize = 64;

		// Start by looping on width
		while (true) {
			if (fontSize == 0) {
				break;
			}

			const w = this.maxLineWidth(textGroups, fontSize);
			if (w <= availableWidth) {
				break;
			}
			fontSize--;
		}

		// Start by looping on height
		while (true) {
			if (fontSize == 0) {
				break;
			}

			const h = this.heightOfLines(textGroups, fontSize);
			if (h < availableHeight) {
				break;
			}
			fontSize--;
		}


		if (fontSize == 0) {
			throw new Error("Unable to find a font that can print the lines within the available width.")
		}
		return fontSize
	}

	calcTextGroupSize(textGroups, fontSize) {
		const size = {
			width: 0,
			height: 0,
		};
		for (const tg of textGroups) {
			const measurements = tg.measure(this._context, fontSize);
			size.width = Math.max(size.width, measurements.width);
			size.height += measurements.height;
		}
		return size;
	}

	maxLineWidth(textGroups, fontSize) {
		let maxWidth = 0;
		for (const tg of textGroups) {
			const measurements = tg.measure(this._context, fontSize);
			maxWidth = Math.max(maxWidth, measurements.width);
		}
		return maxWidth;
	}

	heightOfLines(textGroups, fontSize) {
		let height = 0;
		for (const tg of textGroups) {
			const measurements = tg.measure(this._context, fontSize);
			height += measurements.height;
		}
		return height;
	}

	getPortions(cols) {
		switch(cols.length) {
			case 1:
				return [1];
			case 2:
				return [1, 2];
			default:
				throw new Error(`Unexpected number of columns: ${cols.length}`);
		}
	}

	genImage(b64) {
		return new Promise(resolve => {
			const i = new Image();
			i.onload = () => {
				resolve(i);
			}
			i.onerror = () => {
				resolve(null);
			}
			i.src = b64;
		});
	}
}
