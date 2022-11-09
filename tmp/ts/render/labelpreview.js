(()=>{var f=class{constructor(t,n,e,s){this.lines=t.split(`
`),this.fontWeight=n,this.fontName=e,this.sizeDiff=s}measure(t,n){return n+=this.sizeDiff,this._measure(t,n)}_measure(t,n){t.font=this._fontString(n);let e={width:0,height:0,fontAscent:0,fontDescent:0};for(let s of this.lines){let i=t.measureText(s);e.width=Math.max(e.width,i.width),e.height+=i.fontBoundingBoxAscent+i.fontBoundingBoxDescent,e.fontAscent=Math.max(e.fontAscent,i.fontBoundingBoxAscent),e.fontDescent=Math.max(e.fontDescent,i.fontBoundingBoxDescent)}return e}draw(t,n,e,s){n+=this.sizeDiff,t.font=this._fontString(n);let i=this._measure(t,n),h=s;for(let r of this.lines)t.fillText(r,e,h+i.fontAscent),h+=i.fontAscent+i.fontDescent;return i}_fontString(t){return`${this.fontWeight} ${t}px ${this.fontName}`}},_=class{constructor(t){this._canvas=t;let n=t.getContext("2d");if(!n)throw new Error("Failed to get a 2d context");this._context=n;let e=this._canvas.getAttribute("width-inches");if(!e)throw new Error("width-inches not defined on the canvas element");let s=this._canvas.getAttribute("height-inches");if(!s)throw new Error("height-inches not defined on the canvas element");this._widthInInches=Number(e),this._heightInInches=Number(s),this._canvas.width=Math.floor(this._widthInInches*300),this._canvas.height=Math.floor(this._heightInInches*300),this._canvas.labelPreview=this}labelAsBase64(){return this._canvas.toDataURL()}widthInInches(){return this._widthInInches}heightInInches(){return this._heightInInches}setImage(t,n=!0){this._b64Img=t,n&&this.refresh()}setTitle(t,n=!0){this._title=t,n&&this.refresh()}setAddress(t,n=!0){this._address=t,n&&this.refresh()}refresh(){this._context.clearRect(0,0,this._canvas.width,this._canvas.height);let t=[];if(this._b64Img&&t.push(this.imageColumn()),(this._title||this._address)&&t.push(this.addressColumn()),!t.length)return;let n=this.getPortions(t),e=n.reduce((o,d)=>o+d),s=this._canvas.height*.1,i=s/2,h=this._canvas.width-2*s-(t.length-1)*i,r=this._canvas.height-2*s,a=h/e,c=s,u=s;for(let o=0;o<t.length;o++){let d=t[o],g=n[o]*a,m=r;d.draw(g,m,c,u),c+=g+i}}imageColumn(){return{draw:async(t,n,e,s)=>{let i=await this.genImage(this._b64Img),h=Math.min(t,n),r=(t-h)/2,a=(n-h)/2;this._context.drawImage(i,e+r,s+a,h,h)}}}addressColumn(){return{draw:async(t,n,e,s)=>{let i=[];this._title&&i.push(new f(this._title,700,"Roboto",0)),this._address&&i.push(new f(this._address,400,"Roboto",-8));let h=this.findFontSize(i,t,n),r=this.calcTextGroupSize(i,h),a=e+(t-r.width),c=s+(n-r.height)/2;for(let u of i){let o=u.draw(this._context,h,a,c);c+=o.height}}}}findFontSize(t,n,e){let s=64;for(;!(s==0);){let i=this.maxLineWidth(t,s);if(i<=n)break;s--}for(;!(s==0);){let i=this.heightOfLines(t,s);if(i<e)break;s--}if(s==0)throw new Error("Unable to find a font that can print the lines within the available width.");return s}calcTextGroupSize(t,n){let e={width:0,height:0};for(let s of t){let i=s.measure(this._context,n);e.width=Math.max(e.width,i.width),e.height+=i.height}return e}maxLineWidth(t,n){let e=0;for(let s of t){let i=s.measure(this._context,n);e=Math.max(e,i.width)}return e}heightOfLines(t,n){let e=0;for(let s of t){let i=s.measure(this._context,n);e+=i.height}return e}getPortions(t){switch(t.length){case 1:return[1];case 2:return[1,2];default:throw new Error(`Unexpected number of columns: ${t.length}`)}}genImage(t){return new Promise(n=>{let e=new Image;e.onload=()=>{n(e)},e.onerror=()=>{n(null)},e.src=t})}};})();