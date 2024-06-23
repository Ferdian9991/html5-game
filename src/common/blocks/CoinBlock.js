import Canvas from "../Canvas.js";

export default class CoinBlock extends Canvas {
  static imageId = "coin";
  static imageSrc = "assets/image/coin.png";

  static collectCoinAudioId = "collect-coin-aud";
  static collectCoinAudioSrc = "assets/sound/coin-collect.wav";

  constructor(id) {
    super(id);

    this.coinWidth = 16;
    this.coinHeight = 16;

    this.width = 48;
    this.height = 48;

    this.coins = [];
    this.collectedCoins = [];

    this.animationOffset = 0;
    this.animationSpeed = 0.03;
    this.collectAnimationSpeed = 2;
    this.collectAnimationDuration = 60;
  }

  static async preload({ addImage, addAudio }) {
    if (typeof addImage !== "function") return;

    await addImage(CoinBlock.imageId, CoinBlock.imageSrc);
    await addAudio(CoinBlock.collectCoinAudioId, CoinBlock.collectCoinAudioSrc);
  }

  draw(coins = []) {
    this.coins = this.coins.filter(
      (coin) => !coins.some((c) => c.x === coin.x && c.y === coin.y)
    );

    for (const block of coins) {
      const { x, y, drawTimes } = block;

      if (x === undefined || y === undefined || drawTimes === undefined) {
        continue;
      }

      for (let i = 0; i < drawTimes; i++) {
        const coinX = x + i * this.width;
        const coinY = y;

        if (!this.coins.some((coin) => coin.x === coinX && coin.y === coinY)) {
          this.coins.push({
            x: coinX,
            y: coinY,
            width: this.width,
            height: this.height,
          });
        }

        const img = this.getImage(CoinBlock.imageId);
        this.__drawBlock(img, coinX, coinY, this.width, this.height);
      }
    }

    this.__animateCollectedCoins();

    this.animationOffset += this.animationSpeed;
    this.frame++;
  }

  __drawBlock(img, coinX, coinY, width, height) {
    if (this.collectedCoins.some((c) => c.x === coinX && c.y === coinY)) {
      return;
    }

    const bounceOffset = Math.sin(this.animationOffset) * 5;
    const bounceY = coinY + bounceOffset;

    this.ctx.drawImage(img, coinX, bounceY, width, height);

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
    if (!this.coins.some((coin) => coin.x === coinX && coin.y === coinY)) {
      return;
    }

    if (!this.collectedCoins.some((c) => c.x === coinX && c.y === coinY)) {
      this.collectedCoins.push({
        x: coinX,
        y: coinY,
        opacity: 1,
        offsetY: 0,
        animationFrame: 0,
      });

      const coinSound = this.getAudio(CoinBlock.collectCoinAudioId);
      coinSound.currentTime = 0;
      coinSound.volume = 0.5;
      coinSound.play();
    }
  }

  __animateCollectedCoins() {
    const img = this.getImage(CoinBlock.imageId);

    for (const coin of this.collectedCoins) {
      if (coin.animationFrame < this.collectAnimationDuration) {
        coin.offsetY -= this.collectAnimationSpeed;
        coin.opacity -= 1 / this.collectAnimationDuration;
        coin.animationFrame++;

        this.ctx.save();
        this.ctx.globalAlpha = coin.opacity;
        this.ctx.drawImage(
          img,
          coin.x,
          coin.y + coin.offsetY,
          this.width,
          this.height
        );
        this.ctx.restore();
      }
    }
  }
}
