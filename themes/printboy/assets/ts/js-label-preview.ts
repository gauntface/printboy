import {OnLoad} from './utils/_onload';

export class LabelPreview {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _b64Img: string;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get a 2d context');
        }
        this._context = context;
        const wi = this._canvas.getAttribute("width-inches");
        if (!wi) {
            throw new Error('width-inches not defined on the canvas element');
        }
        const hi = this._canvas.getAttribute("height-inches");
        if (!hi) {
            throw new Error('height-inches not defined on the canvas element');
        }
        this._canvas.width = Math.floor(Number(wi) * 300);
        this._canvas.height = Math.floor(Number(hi) * 300);

        this._canvas['labelPreview'] = this;
    }

    setImage(value) {
        this._b64Img = value
        this.refresh();
    }

    refresh() {
        // Clear canvas
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
  
        /*let labelimage = null;
        const textGroups = [];
  
        if (values.labelimage) {
          labelimage = await genImage(values.labelimage);
        }
        if (values.labeltitle) {
          textGroups.push(new TextGroup(values.labeltitle, 700, 'Roboto'));
        }
        if (values.labeladdress) {
          textGroups.push(new TextGroup(values.labeladdress, 400, 'Roboto'));
        }
  
        const placement = this.measureLabel(labelimage, textGroups);
        if (labelimage) {
          this.context.drawImage(labelimage, placement.logoLeft, placement.logoTop, placement.logoWidth, placement.logoHeight)
        }
  
        let y = placement.contentsTop;
        for (const tg of textGroups) {
          const measure = tg.draw(this.context, placement.fontSize, placement.contentsLeft, y);
          y += measure.height;
        }*/
    }
}

OnLoad(() => {
	const canvases = document.querySelectorAll('.js-label-preview');
	for (const c of canvases) {
		new LabelPreview(c as HTMLCanvasElement);
	}
});