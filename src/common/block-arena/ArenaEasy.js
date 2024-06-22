import IronBlock from "../blocks/IronBlock.js";

export default class ArenaEasy {
  constructor(id) {
    this.id = id;

    this.block = new IronBlock(this.id);
    window.blockPosition = window.gameCanvasObject.canvas.height - 48 * 13;
  }

  draw() {
    this.block.draw([
      {
        x: 0,
        y: window.gameCanvasObject.canvas.height - 48,
        drawTimes: window.gameCanvasObject.canvas.width / 48,
      },
      {
        x: 48 * 5,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 1,
      },
      {
        x: 48 * 6,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 1,
      },
      {
        x: 48 * 6,
        y: window.gameCanvasObject.canvas.height - 48 * 3,
        drawTimes: 1,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 1,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 3,
        drawTimes: 1,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 4,
        drawTimes: (window.gameCanvasObject.canvas.width - 48 * 10) / 48,
      },
      {
        x: window.gameCanvasObject.canvas.width - 48 * 2,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: window.gameCanvasObject.canvas.width - 48,
        y: window.gameCanvasObject.canvas.height - 48 * 3,
        drawTimes: 1,
      },
      {
        x: 0,
        y: window.gameCanvasObject.canvas.height - 48 * 6,
        drawTimes: 5,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 8,
        drawTimes: (window.gameCanvasObject.canvas.width - 48 * 7) / 48,
      },
      {
        x: 48 * 11,
        y: window.gameCanvasObject.canvas.height - 48 * 9,
        drawTimes: 5,
      },
      {
        x: 48 * 18,
        y: window.gameCanvasObject.canvas.height - 48 * 11,
        drawTimes: (window.gameCanvasObject.canvas.width - 48 * 18) / 48,
      },
    ]);
  }
}
