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
    // Padding is 10% of the height
    const padding = this.canvas.height * 0.1;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const {width, height} = this.logoImgSize(this.logoImg, padding)
    const y = (this.canvas.height - height) / 2;
    this.context.drawImage(this.logoImg, padding, y, width, height)
  }

  logoImgSize(img, padding) {
    // Minus some padding
    const maxh = this.canvas.height - (padding * 2); 
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

  async print() {
    try {
      const resp = await fetch('/api/print', {
        method: 'post',
        body: JSON.stringify({
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
      if (!i) {
        throw new Error("No img found for logo button")
      }
  
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

  hookPrintBtn(btn) {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await this.print();
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
});