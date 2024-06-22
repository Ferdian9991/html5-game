import IronBlock from "../blocks/IronBlock.js";

export default class ArenaEasy {
  constructor(id) {
    this.id = id;

    this.block = new IronBlock(this.id);
    window.blockPosition = window.gameCanvasObject.canvas.height - (48 * 4);
  }

  draw() {
    this.block.draw([
      {
        x: 0,
        y: window.gameCanvasObject.canvas.height - 48,
        drawTimes: Math.round(window.gameCanvasObject.canvas.width / 48) + 1,
      },
      {
        x: 0,
        y: window.gameCanvasObject.canvas.height - 48 * 5.5,
        drawTimes:
          Math.round(window.gameCanvasObject.canvas.width / (48 * 2)) + 5,
      },
      {
        x:
          Math.round(window.gameCanvasObject.canvas.width / (48 * 2)) * 48 -
          48 +
          48 * 5,
        y: window.gameCanvasObject.canvas.height - 48 * 6.5,
        drawTimes: 1,
      },
      {
        x: 0,
        y: window.gameCanvasObject.canvas.height - 48 * 10,
        drawTimes: Math.round(window.gameCanvasObject.canvas.width / (48 * 2)),
      },
      {
        x:
          Math.round(window.gameCanvasObject.canvas.width / (48 * 2)) * 48 -
          48 * 2,
        y: window.gameCanvasObject.canvas.height - 48 * 11,
        drawTimes: 1,
      },
    ]);
  }
}
