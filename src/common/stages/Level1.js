import SkyBackground from "../background/SkyBackground.js";
import IronBlock from "../blocks/IronBlock.js";
import Player from "../character/Player.js";
import Hammer from "../obstacles/Hammer.js";

export default class Level1 {
  constructor(id, controller) {
    this.id = id;

    this.background = new SkyBackground(this.id);
    window.blockPosition = window.gameCanvasObject.canvas.height - 48 * 13;
    this.player = new Player(this.id, controller);
    this.block = new IronBlock(this.id);
    this.obstacle = {
      hammer1: new Hammer(
        this.id,
        39.5 * 14,
        window.gameCanvasObject.canvas.height - 38 * 4 + 14,
        2000
      ),
      hammer2: new Hammer(
        this.id,
        38.7 * 18,
        window.gameCanvasObject.canvas.height - 38 * 4 + 14,
        1500
      ),
    };
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await IronBlock.preload({ addImage });
    await Hammer.preload({ addImage });
  }

  draw() {
    this.__drawBackground();
    this.__drawBlocks();
    this.__drawPlayer();
    this.__drawObstacles();
  }

  __drawBackground() {
    this.background.draw();
  }

  __drawPlayer() {
    this.player.draw();
  }

  __drawObstacles() {
    this.obstacle.hammer1.draw();
    this.obstacle.hammer2.draw();
  }

  __drawBlocks() {
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