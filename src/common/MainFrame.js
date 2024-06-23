import Controller from "./Controller.js";

export default class MainFrame {
  constructor() {
    this.controller = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
    };
    this.renderer = {};
    this.isPreloaded = false;
    this.isFirstUpdate = true;
    this.assets = [];

    window.getImage = this.__getImage.bind(this);
    window.getAudio = this.__getAudio.bind(this);

    this.__init();
  }

  async initialize(callback) {
    if (this.isPreloaded) {
      window.initializeCallback = callback;
      return;
    }

    if (typeof callback !== "function") {
      return;
    }

    this.renderer = callback(this.controller);

    // Excecute all draw method
    for (const render of Object.values(this.renderer)) {
      if (typeof render?.draw === "function") {
        render.draw();
      }
    }

    this.isFirstUpdate = false;

    // Delay first update
    await this.__delay(10);
    if (typeof window.updateCallback === "function") {
      this.update(window.updateCallback);
    }

    // Event to notify that the initialization is completed
    const event = new CustomEvent("initializeCompleted", {
      detail: this.getState(),
    });

    document.dispatchEvent(event);

    console.info("ENGINE: Initialize completed!");
  }

  update(callback) {
    if (this.isFirstUpdate) {
      window.updateCallback = callback;
      return;
    }

    callback(this.renderer);

    requestAnimationFrame(this.update.bind(this, callback));
  }

  getState() {
    return {
      controller: this.controller,
    };
  }

  async preload(callback) {
    if (typeof callback !== "function") {
      this.isPreloaded = false;
      return;
    }

    this.isPreloaded = true;
    await callback({
      addImage: this.__addImage.bind(this),
      addAudio: this.__addAudio.bind(this),
    });
    this.isPreloaded = false;

    if (typeof window.initializeCallback === "function") {
      this.initialize(window.initializeCallback);
    }

    console.info("ENGINE: Preload asset completed!");
  }

  __delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  __getImage(id) {
    const asset = this.assets.find((asset) => asset.id === id);
    return asset ? asset.img : null;
  }

  __getAudio(id) {
    const asset = this.assets.find((asset) => asset.id === id);
    return asset ? asset.audio : null;
  }

  async __addImage(id, src) {
    const img = new Image();
    img.src = src;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.assets.push({
          id,
          img,
        });
        resolve();
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject("Failed to load image");
      };
    });
  }

  async __addAudio(id, src) {
    const audio = new Audio();
    audio.src = src;

    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => {
        this.assets.push({
          id,
          audio,
        });
        resolve();
      };

      audio.onerror = () => {
        console.error(`Failed to load audio: ${src}`);
        reject("Failed to load audio");
      };
    });
  }

  __init() {
    this.__defineController();
  }

  __defineController() {
    new Controller({
      up: ({ isPressed }) => {
        this.controller.up = isPressed;
      },
      down: ({ isPressed }) => {
        this.controller.down = isPressed;
      },
      left: ({ isPressed }) => {
        this.controller.left = isPressed;
      },
      right: ({ isPressed }) => {
        this.controller.right = isPressed;
      },
      space: ({ isPressed }) => {
        this.controller.space = isPressed;
      },
    });
  }
}
