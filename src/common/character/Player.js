import Canvas from "../Canvas.js";

export default class Player extends Canvas {
  static playerImageId = "player";
  static playerImageSrc = "assets/image/player.png";

  static hairImageId = "hair";
  static hairmageSrc = "assets/image/player-hair.png";

  static armorImageId = "armor";
  static armorImageSrc = "assets/image/player-armor.png";

  constructor(id, controller) {
    super(id);
    this.blockPosition = window.blockPosition || 0;
    this.x = 15;
    this.y = window.gameCanvasObject.canvas.height - 64 - this.blockPosition;
    this.width = 64;
    this.height = 64;

    // Player initialization
    this.isInnactiveController = false;
    this.isPlayerInit = false;
    this.isMoveRight = false;
    this.isMoveLeft = false;
    this.isJump = false;
    this.isRun = false;

    // Player state
    this.standRight = 16;
    this.standLeft = 24;
    this.standPosition = this.standRight;
    this.currentSceneIndex = null;
    this.jumpSpeed = 0;
    this.gravity = 0.19;
    this.jumpStrength = 6;
    this.jumpKeyPressed = false;

    // Movement
    this.moveSpeed = 1;

    // Controller
    this.controller = controller;
    window.playerMovement = {
      x: 0,
      y: 0,
    };
  }

  static async preload({ addImage }) {
    if (typeof addImage !== "function") return;

    await addImage(Player.playerImageId, Player.playerImageSrc);
    await addImage(Player.hairImageId, Player.hairmageSrc);
    await addImage(Player.armorImageId, Player.armorImageSrc);
  }

  draw() {
    let { up, left, right, space } = this.controller;

    if (this.isInnactiveController) {
      up = false;
      left = false;
      right = false;
      space = false;
    }

    this.__attackedEvent();

    if (!this.isPlayerInit) {
      this.__drawPlayerSprite();
      this.isPlayerInit = true;

      return;
    }

    // For sprint
    if (space) {
      setTimeout(() => {
        this.isRun = true;
      }, 150);
    }

    if (up) {
      if (!this.jumpKeyPressed && !this.isJump) {
        this.isJump = true;
        this.jumpSpeed = -this.jumpStrength;
        this.__jump();
      }
      this.jumpKeyPressed = true;
    } else {
      this.jumpKeyPressed = false;
    }

    if (left) {
      this.isMoveLeft = true;
      this.__moveXAxis();
    } else if (right) {
      this.isMoveRight = true;
      this.__moveXAxis();
    } else {
      this.__drawPlayerSprite(this.standPosition);
    }

    // Apply gravity and update jump
    if (this.isJump) {
      this.__jump();
    }

    this.isMoveRight = false;
    this.isMoveLeft = false;
    this.isRun = false;

    window.playerMovement = {
      x: this.x,
      y: this.y,
    };
  }

  __moveXAxis() {
    const originalX = this.x;

    const moveSpeed = this.isRun ? 2.2 : this.moveSpeed;

    if (this.isMoveRight) {
      this.standPosition = this.standRight;
      this.x += moveSpeed;
    } else if (this.isMoveLeft) {
      this.standPosition = this.standLeft;
      this.x -= moveSpeed;
    }

    if (this.__onOffsetCollisionX()) {
      this.x = originalX;
    }

    this.__preventBlockPenetrationX();

    let scenes = [];
    if (this.isRun) {
      scenes = this.__getRunAnimation();
    } else {
      scenes = this.__getWalkAnimation();
    }

    let delayFrame = 100;
    const now = Date.now();

    if (this.isRun) {
      delayFrame = 70;
    }

    // If the player is jumping, stop animate movement x-axis
    if (this.isJump) {
      return;
    }

    if (!this.lastFrameTime || now - this.lastFrameTime >= delayFrame) {
      this.lastFrameTime = now;
      this.currentSceneIndex = (this.currentSceneIndex + 1) % scenes.length;
      this.__drawPlayerSprite(scenes[this.currentSceneIndex]);
    } else {
      this.__drawPlayerSprite(scenes[this.currentSceneIndex]);
    }

    if (!this.__isOnBlock() && !this.isJump) {
      this.isJump = true;
      this.jumpSpeed = -this.jumpStrength;
      this.__jump(true);
    }
  }

  __attackedEvent() {
    if (window.playerStats.isDead) {
      this.standPosition = 21;
      this.isInnactiveController = true;

      let delayFrame = 2000;
      const now = Date.now();

      if (now - this.lastFrameTime >= delayFrame || !this.lastFrameTime) {
        this.lastFrameTime = now;
        window.playerStats.reduceHealth();
        window.playerStats.setAlive();
        this.isInnactiveController = false;

        this.x = 15;
        this.y =
          window.gameCanvasObject.canvas.height - 64 - this.blockPosition;
        this.standPosition = this.standRight;
      }
    }
  }

  __jump(isFall = false) {
    const originalY = this.y;

    const delayFrame = 11;
    const now = Date.now();

    if (!this.lastFrameTime || now - this.lastFrameTime >= delayFrame) {
      this.lastFrameTime = now;

      this.y += this.jumpSpeed;

      if (this.__onOffsetCollisionY()) {
        this.y = originalY + 12;
        this.jumpSpeed = 0;
      } else {
        if (isFall) {
          this.jumpSpeed += 8;
        } else {
          this.jumpSpeed += this.gravity;
        }
      }
    }

    if (!isFall) {
      this.__preventBlockPenetrationY();
    }

    // Check if landed on the ground
    const blockBelow = this.__findBlockBelow();

    if (this.y >= blockBelow?.y - this.height) {
      this.y = blockBelow?.y - this.height;
      this.isJump = false;
      this.jumpSpeed = 0;
    }

    let jumpScenes;
    if (this.standPosition === this.standRight) {
      jumpScenes = this.__getAnimationScene("jump_r")[0];
    } else {
      jumpScenes = this.__getAnimationScene("jump_l")[0];
    }

    if (this.isJump && (this.isMoveRight || this.isMoveLeft)) {
      this.__drawPlayerSprite(jumpScenes);
    } else {
      this.__drawPlayerSprite(this.standPosition);
    }
  }

  __preventBlockPenetrationX() {
    const defaultMove = this.isMoveLeft ? -this.moveSpeed : this.moveSpeed;

    for (let block of window.blocks) {
      if (
        this.y + this.height > block.y &&
        this.y < block.y &&
        this.x + this.width > block.startX &&
        this.x < block.endX
      ) {
        if (defaultMove > 0) {
          this.x = block.startX - this.width;
        } else if (defaultMove < 0) {
          this.x = block.endX;
        }

        break;
      }
    }
  }

  __preventBlockPenetrationY() {
    for (let block of window.blocks) {
      if (
        this.x + this.width > block.startX &&
        this.x < block.endX &&
        this.y + this.height > block.startY &&
        this.y < block.endY
      ) {
        if (this.jumpSpeed < 0) {
          this.y = block.endY;
          this.jumpSpeed = 0;

          return;
        }
      }
    }
  }

  __drawPlayerSprite(styleIndex = 16) {
    this.__buildSprite(styleIndex, this.getImage(Player.playerImageId));
    this.__buildSprite(styleIndex, this.getImage(Player.hairImageId));
    this.__buildSprite(styleIndex, this.getImage(Player.armorImageId));
  }

  __buildSprite(index, img) {
    const spritesPerRow = img.width / this.width;
    const row = Math.floor(index / spritesPerRow);
    const col = index % spritesPerRow;
    const sx = col * this.width;
    const sy = row * this.height;

    const scale = 160 / this.width;

    this.ctx.drawImage(
      img,
      sx,
      sy,
      this.width,
      this.height,
      this.x - (160 - this.width) / 2,
      this.y - (160 - this.height) / 2,
      this.width * scale,
      this.height * scale
    );

    return [sx, sy];
  }

  __isOnBlock() {
    for (let block of window.blocks) {
      if (
        this.y + this.height <= block.y &&
        this.y + this.height + this.jumpSpeed >= block.y &&
        this.x + this.width > block.startX &&
        this.x < block.endX
      ) {
        this.y = block.y - this.height;
        return true;
      }
    }
    return false;
  }

  __getWalkAnimation() {
    let scenes = [];

    if (this.isMoveRight) {
      scenes = this.__getAnimationScene("walk_r");
    } else if (this.isMoveLeft) {
      scenes = this.__getAnimationScene("walk_l");
    }

    return scenes;
  }

  __getRunAnimation() {
    let scenes = [];

    if (this.isMoveRight) {
      scenes = this.__getAnimationScene("run_r");
    } else if (this.isMoveLeft) {
      scenes = this.__getAnimationScene("run_l");
    }

    return scenes;
  }

  __getAnimationScene(scene) {
    const scenes = {
      walk_r: [48, 49, 50, 51],
      walk_l: [59, 57, 58, 56],
      run_r: [52, 53, 54, 55],
      run_l: [60, 61, 62, 63],
      jump_r: [54],
      jump_l: [62],
    };

    return scenes[scene] || [];
  }

  __findBlockBelow() {
    let closestBlock = null;
    for (let block of window.blocks) {
      if (
        this.x + this.width > block.startX &&
        this.x < block.endX &&
        this.y < block.y &&
        (!closestBlock || block.y < closestBlock.y)
      ) {
        closestBlock = block;
      }
    }
    return closestBlock;
  }

  __onOffsetCollisionX() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > window.gameCanvasObject.canvas.width - this.width) {
      this.x = window.gameCanvasObject.canvas.width - this.width;
    } else {
      return false;
    }

    return true;
  }

  __onOffsetCollisionY() {
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > window.gameCanvasObject.canvas.height - this.height) {
      this.y = window.gameCanvasObject.canvas.height - this.height;
    } else {
      return false;
    }

    return true;
  }
}
