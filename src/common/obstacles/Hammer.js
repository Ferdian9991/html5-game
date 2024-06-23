import Canvas from "../Canvas.js";

export default class Hammer extends Canvas {
  static imageId = "hammer";
  static imageSrc = "assets/image/hammer.png";

  static hammerHitAudioId = "hammer-hit-aud";
  static hammerHitAudioSrc = "assets/sound/hammer-hit.mp3";

  constructor(id, x, y, delay = 3000) {
    super(id);

    this.width = 32;
    this.height = 64;
    this.x = x;
    this.y = y;
    this.currentSceneIndex = 0;
    this.standBy = true;
    this.lastAttackTime = 0;
    this.attackDelay = delay;
    this.isPlayHitSound = false;
  }

  static async preload({ addImage, addAudio }) {
    if (typeof addImage !== "function") return;

    await addImage(Hammer.imageId, Hammer.imageSrc);
    await addAudio(Hammer.hammerHitAudioId, Hammer.hammerHitAudioSrc);
  }

  draw() {
    if (this.x === undefined || this.y === undefined) return;

    const delayFrame = 60;
    const now = Date.now();

    if (this.standBy && now - this.lastAttackTime >= this.attackDelay) {
      this.standBy = false;
      this.currentSceneIndex = 0;
    } else if (!this.standBy) {
      const scenes = [0, 1, 2, 3, 4, 5, 6, 7];

      if (!window.playerStats.isDead) {
        this.isPlayHitSound = false;
      }

      if (
        this.currentSceneIndex >= 4 &&
        this.__isPlayerInRange(window.playerMovement.x, window.playerMovement.y)
      ) {
        if (!this.isPlayHitSound) {
          const hammerHitSound = this.getAudio(Hammer.hammerHitAudioId);
          hammerHitSound.currentTime = 0;
          hammerHitSound.volume = 0.5;
          hammerHitSound.play();

          this.isPlayHitSound = true;
        }

        window.playerStats.setDead();
        this.currentSceneIndex = 4;

        this.__buildSprite(
          this.currentSceneIndex,
          this.getImage(Hammer.imageId)
        );
        return;
      }

      if (!this.lastFrameTime || now - this.lastFrameTime >= delayFrame) {
        this.lastFrameTime = now;
        this.currentSceneIndex = (this.currentSceneIndex + 1) % scenes.length;

        if (this.currentSceneIndex === scenes.length - 1) {
          this.standBy = true;
          this.lastAttackTime = now;

          return;
        }
      }
    }

    this.__buildSprite(this.currentSceneIndex, this.getImage(Hammer.imageId));
  }

  __buildSprite(index, img) {
    const spritesPerRow = img.width / this.width;
    const row = Math.floor(index / spritesPerRow);
    const col = index % spritesPerRow;
    const sx = col * this.width;
    const sy = row * this.height;

    this.ctx.drawImage(
      img,
      sx,
      sy,
      this.width,
      this.height,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    return [sx, sy];
  }

  __isPlayerInRange(playerX, playerY) {
    const leftBoundary = Math.floor(this.x - (this.width / 2) * 4);
    const rightBoundary = Math.floor(this.x + this.width / 2) - 16;
    const y = playerY + 32;
    const playerWithinXRange =
      playerX >= leftBoundary && playerX <= rightBoundary;
    const playerWithinYRange = y >= this.y && y <= this.y + this.height;
    return playerWithinXRange && playerWithinYRange;
  }
}
