class Block {
  constructor(ctx, x, y, drawTimes = 1, style = "grass") {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.drawTimes = drawTimes;
    this.style = style;
    this.draw();
  }

  draw() {
    if (window.blocks === undefined) {
      window.blocks = [];
    }

    window.blocks.push({
      y: this.y,
      startX: this.x,
      endX: (this.x + (this.width) * this.drawTimes) - 48,
    });

    const img = new Image();
    img.src = `assets/${this.style}.png`;
    img.onload = () => {
      for (let i = 0; i < this.drawTimes; i++) {
        this.ctx.drawImage(
          img,
          this.x + i * this.width,
          this.y,
          this.width,
          this.height
        );
      }
    };
  }
}
