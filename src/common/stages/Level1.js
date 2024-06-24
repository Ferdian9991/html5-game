import PlayerStats from "../PlayerStats.js";
import SkyBackground from "../background/SkyBackground.js";
import CoinBlock from "../blocks/CoinBlock.js";
import IronBlock from "../blocks/IronBlock.js";
import Player from "../character/Player.js";
import Hammer from "../obstacles/Hammer.js";

export default class Level1 {
  constructor(id, controller) {
    this.id = id;

    // Initialize player stats
    new PlayerStats();

    // Initialize background
    this.background = new SkyBackground(this.id);

    // Set the player on specific block position
    window.blockPosition = window.gameCanvasObject.canvas.height - 48 * 13;

    this.player = new Player(this.id, controller);
    this.ironBlock = new IronBlock(this.id);
    this.coinBlock = new CoinBlock(this.id);
    this.obstacle = {
      hammer1: new Hammer(
        this.id,
        39.5 * 14,
        window.gameCanvasObject.canvas.height - 38 * 4 + 8,
        500
      ),
      hammer2: new Hammer(
        this.id,
        38.7 * 18,
        window.gameCanvasObject.canvas.height - 38 * 4 + 8,
        600
      ),
      hammer3: new Hammer(
        this.id,
        40 * 21,
        window.gameCanvasObject.canvas.height - 38 * 4 + 8,
        1000
      ),
    };
  }

  static async preload(loader) {
    if (typeof loader !== "object") return;

    await SkyBackground.preload(loader);
    await Player.preload(loader);
    await IronBlock.preload(loader);
    await CoinBlock.preload(loader);
    await Hammer.preload(loader);
    await PlayerStats.preload(loader);
  }

  draw() {
    this.__drawBackground();
    this.__drawIronBlocks();
    this.__drawCoinBlocks();
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
    this.obstacle.hammer3.draw();
  }
  __drawCoinBlocks() {
    this.coinBlock.draw([
      {
        x: 48 * 8,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: 48 * 11,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: 48 * 14,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: 48 * 17,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: 48 * 20,
        y: window.gameCanvasObject.canvas.height - 48 * 2,
        drawTimes: 2,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 9,
        drawTimes: 2,
      },
      {
        x: 48 * 23,
        y: window.gameCanvasObject.canvas.height - 48 * 9,
        drawTimes: 2,
      },
      {
        x: 48 * 7,
        y: window.gameCanvasObject.canvas.height - 48 * 5,
        drawTimes: 2,
      },
      {
        x: 48 * 11,
        y: window.gameCanvasObject.canvas.height - 48 * 5,
        drawTimes: 2,
      },
      {
        x: 48 * 14,
        y: window.gameCanvasObject.canvas.height - 48 * 5,
        drawTimes: 2,
      },
      {
        x: 48 * 18,
        y: window.gameCanvasObject.canvas.height - 48 * 5,
        drawTimes: 2,
      },
    ]);
  }

  __drawIronBlocks() {
    this.ironBlock.draw([
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
