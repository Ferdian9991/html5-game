import Canvas from "../Canvas.js";

export default class IronBlock extends Canvas {
  static imageId = "iron";
  static imageSrc = "assets/iron.png";

  constructor(id, x, y, drawTimes = 1) {
    super(id);

    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.drawTimes = drawTimes;
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await addImage(IronBlock.imageId, IronBlock.imageSrc);
  }

  draw() {
    if (window.blocks === undefined) {
      window.blocks = [];
    }

    window.blocks = window.blocks.filter((block) => block.y !== this.y);

    window.blocks.push({
      y: this.y,
      startY: this.y,
      endY: this.y + this.height + 12,
      startX: this.x + 20,
      endX: this.x + this.width * this.drawTimes - 20,
    });

    const img = this.getImage(IronBlock.imageId);

    for (let i = 0; i < this.drawTimes; i++) {
      this.ctx.drawImage(
        img,
        this.x + i * this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }
}