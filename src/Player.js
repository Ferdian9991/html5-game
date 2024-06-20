class Player {
  constructor(ctx) {
    this.ctx = ctx;
    this.blockPosition = 48 * 11;
    this.x = 15;
    this.y = window.innerHeight - 64 - this.blockPosition;
    this.width = 64;
    this.height = 64;
    this.isJumping = false;
    this.isMoveRight = false;
    this.isMoveLeft = false;
    this.isRunMove = false;
    this.jumpSpeed = 0;
    this.gravity = 0.6;
    this.jumpStrength = 10;
    this.currentSceneIndex = 16;
    this.standRight = 16;
    this.standLeft = 24;
    this.standPosition = this.standRight;
    this.moveSpeed = 6;
    this.jumpFrameRate = 40;
    this.moveFrameRate = 15;
    this.lastJumpUpdate = 0;
    this.lastMoveUpdate = 0;

    this.drawPlayerObject();
    this.defineMovement();
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      isJumping: this.isJumping,
      isMoveRight: this.isMoveRight,
      isMoveLeft: this.isMoveLeft,
      jumpSpeed: this.jumpSpeed,
      gravity: this.gravity,
      jumpStrength: this.jumpStrength,
      currentSceneIndex: this.currentSceneIndex,
      standRight: this.standRight,
      standLeft: this.standLeft,
    };
  }

  clearCanvas() {
    this.ctx.clearRect(
      this.x - (160 - this.width) / 2,
      this.y - (160 - this.height) / 2,
      (this.width * 160) / this.width,
      (this.height * 160) / this.height
    );
  }

  draw() {
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  drawPlayerObject(styleIndex = 16) {
    const img = new Image();
    img.src = "assets/player.png";
    img.onload = () => {
      const [sx, sy] = this.drawPlayerSprite(styleIndex, img);
      const scale = 160 / this.width;

      this.clearCanvas();
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
    };
  }

  drawPlayerSprite(index, img) {
    const spritesPerRow = img.width / this.width;
    const row = Math.floor(index / spritesPerRow);
    const col = index % spritesPerRow;
    const sx = col * this.width;
    const sy = row * this.height;

    return [sx, sy];
  }

  defineMovement() {
    return new Controller({
      up: (state) => {
        if (state.isPressed && !this.isJumping) {
          this.isJumping = true;
          this.jumpSpeed = -this.jumpStrength;
          this.moveAnimationJump();
        }
      },
      left: (state) => {
        if (this.isMoveRight) return;

        if (state.isPressed) {
          this.isMoveLeft = true;
          this.standPosition = this.standLeft;
          this.moveAnimationX("pMoveL", -this.moveSpeed);
          return;
        }

        this.stopMove("pMoveL");
        this.isMoveLeft = false;

        this.drawPlayerObject(this.standLeft);
      },
      right: (state) => {
        if (this.isMoveLeft) return;

        if (state.isPressed) {
          this.isMoveRight = true;
          this.standPosition = this.standRight;
          this.moveAnimationX("pMoveR", this.moveSpeed);
          return;
        }

        this.stopMove("pMoveR");
        this.isMoveRight = false;

        this.drawPlayerObject(this.standRight);
      },
      space: (state) => {
        if (state.isPressed && !this.isRunMove) {
          this.isRunMove = true;

          return;
        }

        this.isRunMove = false;
      },
    });
  }

  onOffsetCollision() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > window.innerWidth - this.width) {
      this.x = window.innerWidth - this.width;
    } else {
      return false;
    }

    return true;
  }

  moveX(x) {
    if (!this.onOffsetCollision()) {
      this.x += x;
    } else {
      return;
    }

    // If the player is jumping, don't animate the run
    if (this.isJumping) {
      return;
    }

    let scenes;
    if (this.isRunMove) {
      scenes = this.getRunAnimation();
    } else {
      scenes = this.getWalkAnimation();
    }

    this.currentSceneIndex = (this.currentSceneIndex + 1) % scenes.length;
    this.drawPlayerObject(scenes[this.currentSceneIndex]);
  }

  getWalkAnimation() {
    let scenes = [];

    if (this.isMoveRight) {
      scenes = this.getAnimationScene("walk_r");
    } else if (this.isMoveLeft) {
      scenes = this.getAnimationScene("walk_l");
    }

    return scenes;
  }

  getRunAnimation() {
    let scenes = [];

    if (this.isMoveRight) {
      scenes = this.getAnimationScene("run_r");
    } else if (this.isMoveLeft) {
      scenes = this.getAnimationScene("run_l");
    }

    return scenes;
  }

  moveY(y) {
    this.y += y;

    this.drawPlayerObject(this.standPosition);
  }

  moveAnimationX(variable, value = 0) {
    if (!variable) {
      throw new Error("Variable is required");
    }

    this.stopMove(variable);
    this.smoothMoveX(variable, value);
  }

  smoothMoveX(variable, value) {
    const now = Date.now();
    const delta = now - this.lastMoveUpdate;

    let updatedFrameRate = this.isRunMove ? 20 : this.moveFrameRate;

    if (delta <= 1000 / updatedFrameRate) {
      window[variable] = requestAnimationFrame(() => {
        this.smoothMoveX(variable, value);
      });
      return;
    }

    let passedValue = 0;
    if (this.isRunMove) {
      passedValue = value < 0 ? -12 : 12;
    } else {
      passedValue = value;
    }

    this.moveX(passedValue);
    this.lastMoveUpdate = now;

    if (!this.isOnBlock() && !this.isJumping) {
      this.isJumping = true;
      this.jumpSpeed = -this.jumpStrength;
      this.moveAnimationFall();

      this.stopMove(variable);
      return;
    }

    window[variable] = requestAnimationFrame(() => {
      this.smoothMoveX(variable, value);
    });
  }

  moveAnimationFall() {
    if (!this.isJumping) return;

    const now = Date.now();
    const delta = now - this.lastJumpUpdate;

    let jumpScenes;
    if (this.standPosition === this.standRight) {
      jumpScenes = this.getAnimationScene("jump_r")[0];
    } else {
      jumpScenes = this.getAnimationScene("jump_l")[0];
    }

    if (delta > 1000 / this.jumpFrameRate) {
      this.jumpSpeed += 12;
      this.moveY(this.jumpSpeed);

      const blockBelow = this.findBlockBelow();

      if (this.y >= blockBelow.y - this.height) {
        this.y = blockBelow.y - this.height;
        this.isJumping = false;
        this.jumpSpeed = 0;
      }

      this.lastJumpUpdate = now;
    }

    if (this.isJumping && (this.isMoveRight || this.isMoveLeft)) {
      this.drawPlayerObject(jumpScenes);
    } else {
      this.drawPlayerObject(this.standPosition);
    }

    if (this.isJumping) {
      requestAnimationFrame(() => this.moveAnimationJump());
    }
  }

  moveAnimationJump() {
    if (!this.isJumping) return;

    const now = Date.now();
    const delta = now - this.lastJumpUpdate;

    let jumpScenes;
    if (this.standPosition === this.standRight) {
      jumpScenes = this.getAnimationScene("jump_r")[0];
    } else {
      jumpScenes = this.getAnimationScene("jump_l")[0];
    }

    if (delta > 1000 / this.jumpFrameRate) {
      this.jumpSpeed += this.gravity;
      this.moveY(this.jumpSpeed);

      const blockBelow = this.findBlockBelow();

      if (this.y >= blockBelow.y - this.height) {
        this.y = blockBelow.y - this.height;
        this.isJumping = false;
        this.jumpSpeed = 0;
      }

      this.lastJumpUpdate = now;
    }

    if (this.isJumping && (this.isMoveRight || this.isMoveLeft)) {
      this.drawPlayerObject(jumpScenes);
    } else {
      this.drawPlayerObject(this.standPosition);
    }

    if (this.isJumping) {
      requestAnimationFrame(() => this.moveAnimationJump());
    }
  }

  stopMove(variable) {
    cancelAnimationFrame(window[variable]);
  }

  getAnimationScene(scene) {
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

  isOnBlock() {
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

  findBlockBelow() {
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
}
