export class TextGroup {
    constructor(text, fontWeight, fontName, sizeDiff) {
      this.lines = text.split("\n");
      this.fontWeight = fontWeight;
      this.fontName = fontName;
      this.sizeDiff = sizeDiff;
    }

    measure(context, fontSize) {
        fontSize += this.sizeDiff;
        return this._measure(context, fontSize);
    }

    _measure(context, fontSize) {
        context.font = this._fontString(fontSize);

        const measure = {
            width: 0,
            height: 0,
            fontAscent: 0,
            fontDescent: 0,
        };
        for (const l of this.lines) {
            const measurements = context.measureText(l);
            measure.width = Math.max(measure.width, measurements.width);
            measure.height += measurements.fontBoundingBoxAscent + measurements.fontBoundingBoxDescent;
            measure.fontAscent = Math.max(measure.fontAscent, measurements.fontBoundingBoxAscent);
            measure.fontDescent = Math.max(measure.fontDescent, measurements.fontBoundingBoxDescent);
        }
        return measure;
    }

    draw(context, fontSize, x, yo) {
        fontSize += this.sizeDiff;
        context.font = this._fontString(fontSize);
        const measure = this._measure(context, fontSize);

        let y = yo;
        for (const l of this.lines) {
            context.fillText(l, x, y + measure.fontAscent);
            y += measure.fontAscent + measure.fontDescent;
        }
        return measure;
    }

    _fontString(fontSize) {
      return `${this.fontWeight} ${fontSize}px ${this.fontName}`;
    }
  }