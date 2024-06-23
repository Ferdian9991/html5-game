import Canvas from "../Canvas.js";

export default class CoinBlock extends Canvas {
  static imageId = "coin";
  static imageSrc = "assets/image/coin.png";

  constructor(id) {
    super(id);

    this.width = 48;
    this.height = 48;
    this.blockId = "coin" + Math.random().toString(16).slice(2);
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await addImage(CoinBlock.imageId, CoinBlock.imageSrc);
  }

  draw(coins = []) {
    if (window.coins === undefined) {
      window.coins = [];
    }

    window.coins = window.coins?.filter((block) => block.id !== this.blockId);

    for (const block of coins) {
      const { x, y, drawTimes } = block;

      if (x === undefined && y === undefined && drawTimes === undefined) {
        return;
      }

      window.coins.push({
        id: this.blockId,
        y: y,
        startY: y,
        endY: y + this.height + 12,
        startX: x + 20,
        endX: x + this.width * drawTimes - 20,
      });

      const img = this.getImage(CoinBlock.imageId);

      for (let i = 0; i < drawTimes; i++) {
        this.ctx.drawImage(img, x + i * this.width, y, this.width, this.height);
      }
    }
  }
}
