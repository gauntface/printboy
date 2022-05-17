<script>
  import { onMount } from 'svelte';

  export let values;
  export let canvas;


  class LabelGenerator {
    constructor() {
      const c = document.querySelector('.js-label-canvas');
      if (!c) {
        throw new Error("Could not find canvas")
      }
      canvas = c;
      console.log(`Canvas Set => `, canvas, values);
      this.canvas = c;
      this.context = c.getContext('2d');
    }

    async refresh() {
      // Clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      let labelimage = null;
      if (values.labelimage) {
        labelimage = await genImage(values.labelimage);
      }

      const placement = this.measureLabel(labelimage);

      if (labelimage) {
        this.context.drawImage(labelimage, placement.logoLeft, placement.logoTop, placement.logoWidth, placement.logoHeight)
      }

      let y = placement.contentsTop;
      if (values.labeltitle) {
        this.context.font = this.fontString(700, placement.fontSize, 'Roboto');
        this.context.fillText(values.labeltitle, placement.contentsLeft, y + placement.fontAscent);
        y += placement.fontAscent + placement.fontDescent;
      }

      if (values.labeladdress) {
        const lines = values.labeladdress.split('\n');
        for (const l of lines) {
          this.context.font = this.fontString(500, placement.fontSize, 'Roboto');
          this.context.fillText(l, placement.contentsLeft, y + placement.fontAscent);
          y += placement.fontAscent + placement.fontDescent;
        }
      }
    }

    measureLabel(labelimage) {
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

        const {width, height} = this.logoImgSize(labelimage, availableHeight)
        measurements.logoWidth = width;
        measurements.logoHeight = height;
      }
      if (measurements.logoWidth) {
        availableWidth = availableWidth - measurements.logoWidth - padding
      }

      if (values.labeladdress) {
        columns++;
        const lines = values.labeladdress.split("\n")
        measurements.fontSize = this.findFontSize(lines, availableWidth);
        let maxWidth = 0;
        let maxAscent = 0;
        let maxDescent = 0;

        for (const l of lines) {
          this.context.font = this.fontString(400, measurements.fontSize, 'Roboto');
          const mt = this.context.measureText(l);
          if (mt.width > maxWidth) {
            maxWidth = mt.width;
          }
          if (mt.actualBoundingBoxAscent > maxAscent) {
            maxAscent = mt.actualBoundingBoxAscent;
          }
          if (mt.actualBoundingBoxDescent > maxDescent) {
            maxDescent = mt.actualBoundingBoxDescent;
          }
        }

        measurements.fontAscent = maxAscent;
        measurements.fontDescent = maxDescent;

        measurements.contentsWidth = maxWidth;
        measurements.contentsHeight = lines.length * (maxAscent + maxDescent);
      }

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

    findFontSize(lines, availableWidth) {
      let fontSize = 42;
      while (true) {
        if (fontSize == 0) {
          break;
        }
        const w = this.maxLineWidth(lines, fontSize);
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

    maxLineWidth(lines, fontSize) {
      let maxWidth = 0;
      for (const l of lines) {
        this.context.font = this.fontString(400, fontSize, 'Roboto');
        const measurements = this.context.measureText(l);
        if (measurements.width > maxWidth) {
          maxWidth = measurements.width;
        }
      }
      return maxWidth;
    }

    fontString(weight, fontSize, fontName) {
      return `${weight} ${fontSize}px ${fontName}`;
    }

    logoImgSize(img, availableHeight) {

      // Minus some padding
      const maxh = availableHeight;
      const maxw = maxh;

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (w > h) {
        const r = h/w;
        return {
          width: maxw,
          height: maxw * r,
        }
      }
      const r = w/h;
      return {
        width: maxh*r,
        height: maxh,
      }
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
		const lg = new LabelGenerator();
    lg.refresh();
	});
</script>
<div>
  <p>Label Preview TBD</p>
	<canvas class="c-label-preview js-label-canvas" width="1050" height="337"></canvas>
</div>

<style>
  .c-label-preview {
    border-style: solid;
    border-width: 4px;
    border-color: grey;
    width: 100%;
  }
</style>