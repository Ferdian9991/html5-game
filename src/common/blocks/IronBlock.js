import Canvas from "../Canvas.js";

export default class IronBlock extends Canvas {
  static imageId = "iron";
  static imageSrc = "assets/image/iron.png";

  constructor(id) {
    super(id);

    this.width = 48;
    this.height = 48;
    this.blockId = "iron" + Math.random().toString(16).slice(2);
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await addImage(IronBlock.imageId, IronBlock.imageSrc);
  }

  draw(blocks = []) {
    if (window.blocks === undefined) {
      window.blocks = [];
    }

    window.blocks = window.blocks?.filter((block) => block.id !== this.blockId);

    for (const block of blocks) {
      const { x, y, drawTimes } = block;

      if (x === undefined && y === undefined && drawTimes === undefined) {
        return;
      }

      window.blocks.push({
        id: this.blockId,
        y: y,
        startY: y,
        endY: y + this.height + 12,
        startX: x + 20,
        endX: x + this.width * drawTimes - 20,
      });

      const img = this.getImage(IronBlock.imageId);

      for (let i = 0; i < drawTimes; i++) {
        this.ctx.drawImage(img, x + i * this.width, y, this.width, this.height);
      }
    }
  }
}
