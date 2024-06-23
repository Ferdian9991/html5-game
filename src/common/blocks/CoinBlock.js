import Canvas from "../Canvas.js";

export default class CoinBlock extends Canvas {
  static imageId = "coin";
  static imageSrc = "assets/image/coin.png";

  static collectCoinAudioId = "collect-coin-aud";
  static collectCoinAudioSrc = "assets/sound/coin-collect.wav";

  constructor(id) {
    super(id);

    // Actual size of the coin image
    this.coinWidth = 16;
    this.coinHeight = 16;

    // Total size with padding
    this.width = 48;
    this.height = 48;

    this.blockId = "coin" + Math.random().toString(16).slice(2);

    // Internal arrays to store coins and collected coins
    this.coins = [];
    this.collectedCoins = [];
  }

  static async preload({ addImage, addAudio }) {
    if (typeof addImage !== "function") return;

    await addImage(CoinBlock.imageId, CoinBlock.imageSrc);
    await addAudio(CoinBlock.collectCoinAudioId, CoinBlock.collectCoinAudioSrc);
  }

  draw(coins = []) {
    this.coins = this.coins.filter((block) => block.id !== this.blockId);

    for (const block of coins) {
      const { x, y, drawTimes } = block;

      if (x === undefined || y === undefined || drawTimes === undefined) {
        continue;
      }

      this.coins.push({
        id: this.blockId,
        y: y,
        startY: y,
        endY: y + this.height - this.coinHeight,
        startX: x + (this.width - this.coinWidth) / 2,
        endX: x + this.width - (this.width - this.coinWidth) / 2,
        childs: [],
      });

      const img = this.getImage(CoinBlock.imageId);
      for (let i = 0; i < drawTimes; i++) {
        const coinX = x + i * this.width;
        const coinY = y;

        const findCoinBlock = this.coins.find(
          (block) => block.id === this.blockId
        );

        if (findCoinBlock) {
          findCoinBlock.childs.push({
            parentId: this.blockId,
            x: coinX,
            y: coinY,
            width: this.width,
            height: this.height,
          });
        }

        this.__drawBlock(img, coinX, coinY, this.width, this.height);
      }
    }
  }

  __drawBlock(img, coinX, coinY, width, height) {
    const findCollectedCoin = this.collectedCoins.find(
      (c) => c.x === coinX && c.y === coinY && c.parentId === this.blockId
    );

    if (findCollectedCoin) {
      return;
    }

    this.ctx.drawImage(img, coinX, coinY, width, height);

    const playerRangeX = window.playerMovement.x + 24;
    const playerRangeY = window.playerMovement.y + 64;

    this.__checkPlayerCollectCoin(playerRangeX, playerRangeY, coinX, coinY);
  }

  __checkPlayerCollectCoin(playerRangeX, playerRangeY, coinX, coinY) {
    if (
      playerRangeX >= coinX &&
      playerRangeX <= coinX + this.width &&
      playerRangeY >= coinY &&
      playerRangeY <= coinY + this.height
    ) {
      this.__collectCoin(coinX, coinY);
    }
  }

  __collectCoin(coinX, coinY) {
    const findCoinBlock = this.coins.find((c) => c.id === this.blockId);

    if (!findCoinBlock) {
      return;
    }

    const coinBlockByCoordinate = findCoinBlock.childs.find(
      (c) => c.x === coinX && c.y === coinY && c.parentId === this.blockId
    );

    if (!coinBlockByCoordinate) {
      return;
    }

    const findCollectedCoin = this.collectedCoins.find(
      (c) => c.x === coinX && c.y === coinY && c.parentId === this.blockId
    );

    if (!findCollectedCoin) {
      this.collectedCoins.push({
        x: coinX,
        y: coinY,
        parentId: this.blockId,
      });

      const coinSound = this.getAudio(CoinBlock.collectCoinAudioId);
      coinSound.currentTime = 0;
      coinSound.volume = 0.5;
      coinSound.play();
    }
  }
}
