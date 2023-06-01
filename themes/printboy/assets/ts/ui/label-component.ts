import { TextGroup } from "./text-group";

export class LabelComponent {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private widthInches: number;
  private heightInches: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
			if (!context) {
					throw new Error('Failed to get a 2d context');
			}
			this.context = context;


    this.updatePaperSize();
    this.draw();
  }

  async updatePaperSize() {
    console.warn('TODO: Get label size from API...');
    this.widthInches = 3;
    this.heightInches = 1.125;
  }

  draw() {
    this.canvas.width = Math.floor(this.widthInches * 300);
		this.canvas.height = Math.floor(this.heightInches * 300);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const columns = [];
    if (this.canvas.attributes['image']) {
      columns.push(this.imageColumn(this.canvas.attributes['image']));
    }

    if (this.canvas.attributes['title'] || this.canvas.attributes['content']) {
      columns.push(this.addressColumn(this.canvas.attributes['title'], this.canvas.attributes['content']));
    }

    if (!columns.length) {
      return;
    }
  }

  imageColumn(b64Img) {
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

  addressColumn(title: string|null, content: string|null) {
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
				let x = l + (w - measure.width);
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
}
