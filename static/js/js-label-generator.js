class LabelGenerator {
  constructor() {
    const c = document.querySelector('.js-label-canvas');
    if (!c) {
      throw new Error("Could not find canvas")
    }
    this.canvas = c;
    this.context = c.getContext('2d');

    this.logoImg = null;
  }

  refresh() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const placement = this.measureLabel();

    if (this.logoImg) {
      this.context.drawImage(this.logoImg, placement.logoLeft, placement.logoTop, placement.logoWidth, placement.logoHeight)
    }

    if (this.lines) {
      let y = placement.contentsTop;
      for (const l of this.lines) {
        this.context.font = this.fontString(l, placement.fontSize);
        this.context.fillText(l.text, placement.contentsLeft, y + placement.fontAscent);
        y += placement.fontAscent + placement.fontDescent;
      }
    }
  }

  measureLabel() {
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
    if (this.logoImg) {
      columns++;

      const {width, height} = this.logoImgSize(this.logoImg, availableHeight)
      measurements.logoWidth = width;
      measurements.logoHeight = height;
    }
    if (measurements.logoWidth) {
      availableWidth = availableWidth - measurements.logoWidth - padding
    }

    if (this.lines) {
      columns++;

      measurements.fontSize = this.findFontSize(this.lines, availableWidth);
      let maxWidth = 0;
      let maxAscent = 0;
      let maxDescent = 0;

      for (const l of this.lines) {
        this.context.font = this.fontString(l, measurements.fontSize);
        const mt = this.context.measureText(l.text);
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
      measurements.contentsHeight = this.lines.length * (maxAscent + maxDescent);
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
      this.context.font = this.fontString(l, fontSize);
      const measurements = this.context.measureText(l.text);
      if (measurements.width > maxWidth) {
        maxWidth = measurements.width;
      }
    }
    return maxWidth;
  }

  fontString(line, fontSize) {
    return `${line.weight} ${fontSize}px ${line.fontName}`;
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

  async print(copies) {
    try {
      const resp = await fetch('/api/print', {
        method: 'post',
        body: JSON.stringify({
          Copies: copies,
          Base64EncodedImage: this.canvas.toDataURL(),
        }),
      })
      console.log('Print resp: ', await resp.text())
    } catch (err) {
      console.error('Failed to print: ', err);
    }
  }

  hookLogoBtn(l) {
    l.addEventListener('click', () => {
      const i = l.querySelector('.js-logo-img')  
      this.logoImg = i;
      this.refresh();
    });
  }
  
  hookLogoBtns() {
    const logos = document.querySelectorAll('.js-logo-btn');
    for (const l of logos) {
      this.hookLogoBtn(l)
    }
  }

  hookContentBtn(btn) {
    btn.addEventListener('click', async () => {
      const lines = btn.querySelectorAll('.js-content-line')
      if (!lines) {
        throw new Error("No lines found for content button")
      }
  
      this.lines = []      
      for (const l of lines) {
        this.lines.push({
          fontName: 'Roboto',
          weight: l.style.fontWeight,
          text: l.textContent.trim(),
        });
      }
      console.log(`lines: `, this.lines);
      this.refresh();
    })
  }

  hookContentBtns() {
    const btns = document.querySelectorAll('.js-content-btn');
    for (const b of btns) {
      this.hookContentBtn(b)
    }
  }

  hookPrintBtn(btn) {
    btn.addEventListener('click', async () => {
      const c = document.querySelector('.js-print-copies');
      if (!c) {
        throw new Error("Unable to find number of copies input")
      }
      const copies = parseInt(c.value, 10)
      btn.disabled = true;
      await this.print(copies);
      btn.disabled = false;
    })
  }

  hookPrintBtns() {
    const btns = document.querySelectorAll('.js-print-btn');
    for (const b of btns) {
      this.hookPrintBtn(b)
    }
  }
}



window.addEventListener('load', () => {
  const lg = new LabelGenerator()
  lg.hookLogoBtns();
  lg.hookPrintBtns();
  lg.hookContentBtns();
});