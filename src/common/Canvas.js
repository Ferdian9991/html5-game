export default class Canvas {
  constructor(id) {
    this.id = id;

    if (!window.gameCanvasObject) {
      this.canvas = document.getElementById(this.id);
      this.ctx = this.canvas.getContext("2d");

      window.gameCanvasObject = {
        canvas: this.canvas,
        ctx: this.ctx,
      };

      this.__init();
    } else {
      this.ctx = window.gameCanvasObject.ctx;
      this.canvas = window.gameCanvasObject.canvas;
    }
  }

  getImage(id) {
    return window.getImage(id);
  }

  __init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (window.innerWidth < 900) {
      this.canvas.width = 900;
    }
  }
}
