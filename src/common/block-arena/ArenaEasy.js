import GrassBlock from "../blocks/GrassBlock.js";

export default class ArenaEasy {
  constructor(id) {
    this.id = id;
  }

  draw() {
    new GrassBlock(
      this.id,
      0,
      window.innerHeight - 48,
      Math.round(window.innerWidth / 48) + 1
    ).draw();

    new GrassBlock(
      this.id,
      0,
      window.innerHeight - 48 * 5.5,
      Math.round(window.innerWidth / (48 * 2)) + 5
    ).draw();

    new GrassBlock(
      this.id,
      Math.round(window.innerWidth / (48 * 2)) * 48 - 48 + 48 * 5,
      window.innerHeight - 48 * 6.5,
      1
    ).draw();

    new GrassBlock(
      this.id,
      0,
      window.innerHeight - 48 * 10,
      Math.round(window.innerWidth / (48 * 2))
    ).draw();

    new GrassBlock(
      this.id,
      Math.round(window.innerWidth / (48 * 2)) * 48 - (48 *2),
      window.innerHeight - 48 * 11,
      1
    ).draw();
  }
}
