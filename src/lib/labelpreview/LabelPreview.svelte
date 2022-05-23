<script>
  import { onMount } from 'svelte';

  export let values;
  export let widthInches;
  export let heightInches;

  let canvas;

  class LabelGenerator {
    constructor(c) {
      this.canvas = c;
      // 30252 Address Label
      // 3-1/2" x 1-1/8"

      // 30364 Name Badge
      // 4" x 2.25"
      this.canvas.width = Math.floor(widthInches * 300);
      this.canvas.height = Math.floor(heightInches * 300);
      this.context = c.getContext('2d');
    }

    async refresh() {
      // Clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      let labelimage = null;
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
      }
    }

    measureLabel(labelimage, textGroups) {
      const measurements = {
        logoWidth: 0,
        logoHeight: 0,
        logoLeft: 0,
        logoTop: 0,

        contentsWidth: 0,
        contentsHeight: 0,
        contentsLeft: 0,
        contentsTop: 0,

        fontDescent: 0,
        fontAscent: 0,
        fontSize: 0,
      };

      // Padding is 10% of the height
      const padding = this.canvas.height * 0.1;
      let availableWidth = this.canvas.width - (padding * 2);
      let availableHeight = this.canvas.height - (padding * 2);

      let columns = 0;
      if (labelimage) {
        columns++;

        const {width, height} = this.logoImgSize(labelimage, availableWidth, availableHeight)
        measurements.logoWidth = width;
        measurements.logoHeight = height;
      }

      if (measurements.logoWidth) {
        availableWidth = availableWidth - measurements.logoWidth - padding
      }

      if (textGroups.length > 0) {
        columns++;
      }

      measurements.fontSize = this.findFontSize(textGroups, availableWidth);
      const textSize = this.calcTextSize(textGroups, measurements.fontSize);
      measurements.contentsWidth = textSize.width;
      measurements.contentsHeight = textSize.height;

      const consumedWidth = measurements.logoWidth + measurements.contentsWidth;
      const remainingWidth = this.canvas.width - consumedWidth;
      const hPadding = remainingWidth / (columns + 1);
      if (measurements.logoWidth) {
        measurements.logoLeft = hPadding;
      }
      measurements.contentsLeft = measurements.logoLeft + measurements.logoWidth + hPadding;

      measurements.logoTop = (this.canvas.height - measurements.logoHeight) / 2;
      measurements.contentsTop = (this.canvas.height - measurements.contentsHeight) / 2;

      return measurements;
    }

    findFontSize(textGroups, availableWidth) {
      let fontSize = 64;
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

      if (fontSize == 0) {
        throw new Error("Unable to find a font that can print the lines within the available width.")
      }
      return fontSize
    }

    calcTextSize(textGroups, fontSize) {
      const size = {
        width: 0,
        height: 0,
      };
      for (const tg of textGroups) {
        const measurements = tg.measure(this.context, fontSize)
        size.width = Math.max(size.width, measurements.width);
        size.height += measurements.height;
      }
      return size;
    }

    maxLineWidth(textGroups, fontSize) {
      let maxWidth = 0;
      for (const tg of textGroups) {
        const measurements = tg.measure(this.context, fontSize);
        maxWidth = Math.max(maxWidth, measurements.width);
      }
      return maxWidth;
    }

    logoImgSize(img, availableWidth, availableHeight) {
      const maxd = Math.min(availableHeight, availableWidth * 0.35);

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (w > h) {
        const r = h/w;
        return {
          width: maxd,
          height: maxd * r,
        }
      }

      const r = w/h;
      return {
        width: maxd*r,
        height: maxd,
      }
    }

    fontString(weight, size, name) {
      return `${weight} ${size}px ${name}`;
    }
  }

  class TextGroup {
    constructor(text, fontWeight, fontName) {
      this.lines = text.split("\n");
      this.fontWeight = fontWeight;
      this.fontName = fontName;
    }

    measure(context, fontSize) {
      context.font = this.fontString(fontSize);

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
      context.font = this.fontString(fontSize);
      const measure = this.measure(context, fontSize);

      let y = yo;
      for (const l of this.lines) {
        context.fillText(l, x, y + measure.fontAscent);
        y += measure.fontAscent + measure.fontDescent;
      }
      return measure;
    }

    fontString(fontSize) {
      return `${this.fontWeight} ${fontSize}px ${this.fontName}`;
    }
  }

  function genImage(b64) {
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

  onMount(() => {
		const lg = new LabelGenerator(canvas);
    lg.refresh();
	});
</script>
<div>
	<canvas bind:this={canvas} class="c-label-preview js-label-canvas"></canvas>
</div>

<style>
  .c-label-preview {
    border-style: solid;
    border-width: 4px;
    border-color: grey;
    width: 100%;
    box-sizing: border-box;
  }
</style>