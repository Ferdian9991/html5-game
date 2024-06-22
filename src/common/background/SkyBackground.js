import Canvas from "../Canvas.js";

export default class SkyBackground extends Canvas {
  static imageId = "sky-bg";
  static imageSrc = "assets/image/sky-bg.jpg";

  constructor(id) {
    super(id);
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await addImage(SkyBackground.imageId, SkyBackground.imageSrc);
  }

  draw() {
    const img = this.getImage(SkyBackground.imageId);
    const imgAspectRatio = img.width / img.height;
    const canvasAspectRatio = this.canvas.width / this.canvas.height;

    let sx = 0,
      sy = 0,
      sWidth = img.width,
      sHeight = img.height,
      dx = 0,
      dy = 0,
      dWidth = this.canvas.width,
      dHeight = this.canvas.height;

    if (imgAspectRatio > canvasAspectRatio) {
      sWidth = img.height * canvasAspectRatio;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / canvasAspectRatio;
      sy = (img.height - sHeight) / 2;
    }

    this.ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}
