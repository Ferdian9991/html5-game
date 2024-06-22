export default class Controller {
  constructor(events) {
    this.keys = {};
    this.events = events;

    this.init();
  }

  init() {
    window.addEventListener("keydown", this.pressKey.bind(this, true));
    window.addEventListener("keyup", this.pressKey.bind(this, false));
  }

  pressKey(isPressed = false, e) {
    if (e.repeat || e.key === "Shift") return;

    this.keys[e.key] = isPressed;
    switch (e.key) {
      case "ArrowUp":
        this.events?.up?.(this.getState(isPressed));
        break;
      case "ArrowDown":
        this.events?.down?.(this.getState(isPressed));
        break;
      case "ArrowLeft":
        this.events?.left?.(this.getState(isPressed));
        break;
      case "ArrowRight":
        this.events?.right?.(this.getState(isPressed));
        break;
      case " ":
        this.events?.space?.(this.getState(isPressed));
        break;
    }
  }

  getState(isPressed = false) {
    return {
      isPressed,
    };
  }
}
