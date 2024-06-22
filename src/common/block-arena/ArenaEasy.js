import GrassBlock from "../blocks/GrassBlock.js";
import IronBlock from "../blocks/IronBlock.js";

export default class ArenaEasy {
  constructor(id) {
    this.id = id;
  }

  draw() {
    new IronBlock(
      this.id,
      0,
      window.innerHeight - 48,
      Math.round(window.innerWidth / 48) + 1
    ).draw();

    new IronBlock(
      this.id,
      0,
      window.innerHeight - 48 * 5.5,
      Math.round(window.innerWidth / (48 * 2)) + 5
    ).draw();

    new IronBlock(
      this.id,
      Math.round(window.innerWidth / (48 * 2)) * 48 - 48 + 48 * 5,
      window.innerHeight - 48 * 6.5,
      1
    ).draw();

    new IronBlock(
      this.id,
      0,
      window.innerHeight - 48 * 10,
      Math.round(window.innerWidth / (48 * 2))
    ).draw();

    new IronBlock(
      this.id,
      Math.round(window.innerWidth / (48 * 2)) * 48 - (48 *2),
      window.innerHeight - 48 * 11,
      1
    ).draw();
  }
}
