import { TextGroup } from "./text-group";

export class LabelComponent {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private widthInches: number;
  private heightInches: number;
	private debug: boolean;
	private fontLoaded: boolean;

  constructor(canvas: HTMLCanvasElement, debug = false) {
    this.canvas = canvas;
		this.debug = debug;
    const context = canvas.getContext('2d');
		if (!context) {
				throw new Error('Failed to get a 2d context');
		}
		this.context = context;
		this.fontLoaded = false;

    this.updatePaperSize();
    this.draw();
  }

  async updatePaperSize() {
    console.warn('TODO: Get label size from API...');
    this.widthInches = 3;
    this.heightInches = 1.125;
  }

	setImage(b64) {
		this.canvas.attributes['image'] = b64;
		this.draw();
	}

	setTitle(t) {
		this.canvas.attributes['title'] = t;
		this.draw();
	}

	setContent(t) {
		this.canvas.attributes['content'] = t;
		this.draw();
	}

  async draw() {
		if (!this.fontLoaded) {
			await this.waitForFonts();
			this.fontLoaded = true;
		}
    this.canvas.width = Math.floor(this.widthInches * 300);
		this.canvas.height = Math.floor(this.heightInches * 300);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const columns: Array<Renderer> = [];
    if (this.canvas.attributes['image']) {
      columns.push(this.imageColumn(this.canvas.attributes['image']));
    }

    if (this.canvas.attributes['title'] || this.canvas.attributes['content']) {
      columns.push(this.addressColumn(this.canvas.attributes['title'], this.canvas.attributes['content']));
    }

		const padding = this.canvas.height * 0.1;
		const gap = padding;
		const widths = this.getColumnWidths(padding, gap, columns);

    if (columns.length) {
			let left = padding;
			const top = padding;
			const height = this.canvas.height - (2 * padding);
			for (let i = 0; i < columns.length; i++) {
				const col = columns[i];
				const colWidth = widths[i];
				col.draw(colWidth, height, left, top);

				left += colWidth + gap;
			}
    }

		this.drawDebug(padding, gap, widths);
  }

	async waitForFonts() {
		return new Promise(async (resolve) => {
			const fontface = await document.fonts.ready;
			const want = [
				{family: "Roboto", weight: 400},
				{family: "Roboto", weight: 700},
			];
			const missing = [];
			for (const w of want) {
				if (!fontface.check(`${w.weight} 16px ${w.family}`)) {
					missing.push(w);
				}
			}
			if (!missing.length) {
				resolve(undefined);
				return;
			}

			document.fonts.onloadingdone = (e) => {
				for (const w of missing) {
					const ff = e.fontfaces.find(f => f.family == w.family && f.weight == w.weight);
					if (!ff) {
						logger.warn(`Still waiting for font ${w} to load`);
						return;
					}
				}
				resolve(undefined);
			};
			for (const m of missing) {
				await document.fonts.load(`${m.weight} 16px ${m.family}`);
			}
		})
	}

	getColumnWidths(padding, gap, columns) {
		const widths: Array<number> = [];

		const portions = this.getPortions(columns);
		const portionCount = portions.reduce((pv, v) => pv + v);
		const usableWidth = this.canvas.width - (2 * padding) - ((columns.length - 1) * gap);
		const pw = usableWidth / portionCount;
		for (let i = 0; i < columns.length; i++) {
			widths.push(portions[i] * pw);
		}
		return widths;
	}

	drawDebug(padding, gap, widths) {
		if (!this.debug) {
			return;
		}

		// Draw Padding
		this.context.beginPath();
		this.context.fillStyle = 'rgba(155, 89, 182, 0.2)';
		// Left
		this.context.rect(0, 0, padding, this.canvas.height);
		// Right
		this.context.rect(this.canvas.width - padding, 0, padding, this.canvas.height);
		// Top
		this.context.rect(0, 0, this.canvas.width, padding);
		// Bottom
		this.context.rect(0, this.canvas.height - padding, this.canvas.width, padding);
		this.context.fill();
		this.context.closePath();

		let left = padding;
		const top = padding;
		const height = this.canvas.height - (2 * padding);

		for (let i = 0; i < widths.length; i++) {
			const w = widths[i];
			this.context.beginPath();
			this.context.fillStyle = 'rgba(26, 188, 156, 0.2)';
			this.context.rect(left, top, w, height);
			this.context.fill();
			this.context.closePath();

			left += w;

			if (i+1 < widths.length) {
				this.context.beginPath();
				this.context.fillStyle = 'rgba(231, 76, 60, 0.2)';
				this.context.rect(left, top, gap, height);
				this.context.fill();
				this.context.closePath();

				left += gap;
			}
		}
	}

  imageColumn(b64Img): Renderer {
		return {
			draw: async (w, h, l, t) => {
				const img = await this.genImage(b64Img);
        if (!img) {
          return;
        }
				const min = Math.min(w, h);
				const centerX = (w - min) / 2;
				const centerY = (h - min) / 2;
				this.context.drawImage(img, l + centerX, t + centerY, min, min);
			},
		}
	}

  addressColumn(title: string|null, content: string|null): Renderer {
		return {
			draw: async (w, h, l, t) => {
				const textGroups: Array<TextGroup> = [];
				if (title) {
					textGroups.push(new TextGroup(title, 700, 'Roboto', 0));
				}
				if (content) {
					textGroups.push(new TextGroup(content, 400, 'Roboto', -8));
				}

				const fontSize = this.findFontSize(textGroups, w, h);
				const measure = this.calcTextGroupSize(textGroups, fontSize);
				let x = l;
				let y = t + ((h - measure.height) / 2);
				for (const tg of textGroups) {
					const measure = tg.draw(this.context, fontSize, x, y);
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

  maxLineWidth(textGroups, fontSize) {
		let maxWidth = 0;
		for (const tg of textGroups) {
			const measurements = tg.measure(this.context, fontSize);
			maxWidth = Math.max(maxWidth, measurements.width);
		}
		return maxWidth;
	}

	heightOfLines(textGroups, fontSize) {
		let height = 0;
		for (const tg of textGroups) {
			const measurements = tg.measure(this.context, fontSize);
			height += measurements.height;
		}
		return height;
	}

	calcTextGroupSize(textGroups, fontSize) {
		const size = {
			width: 0,
			height: 0,
		};
		for (const tg of textGroups) {
			const measurements = tg.measure(this.context, fontSize);
			size.width = Math.max(size.width, measurements.width);
			size.height += measurements.height;
		}
		return size;
	}

  genImage(b64): Promise<CanvasImageSource|null> {
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

	getPortions(cols: Array<Renderer>) {
		switch(cols.length) {
			case 0:
				return [1];
			case 1:
				return [1];
			case 2:
				return [1, 2];
			default:
				throw new Error(`Unexpected number of columns: ${cols.length}`);
		}
	}

	asBase64() {
		return this.canvas.toDataURL();
	}

	widthInInches() {
		return this.widthInches;
	}

	heightInInches() {
		return this.heightInches;
	}
}

interface Renderer {
	draw: (w: number, h: number, l: number, t: number) => void;
}
