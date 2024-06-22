import MainFrame from "./common/MainFrame.js";
import SkyBackground from "./common/background/SkyBackground.js";
import ArenaEasy from "./common/block-arena/ArenaEasy.js";
import IronBlock from "./common/blocks/IronBlock.js";
import Player from "./common/character/Player.js";

const frame = new MainFrame();

const idCanvas = "gameCanvas";

frame.preload(async (loader) => {
  await SkyBackground.preload(loader);
  await IronBlock.preload(loader);
  await Player.preload(loader);
});

frame.initialize((controller) => {
  return {
    skyBackground: new SkyBackground(idCanvas),
    blocks: new ArenaEasy(idCanvas),
    player: new Player(idCanvas, controller),
  };
});

frame.update((renderer) => {
  renderer.skyBackground.draw();
  renderer.blocks.draw();
  renderer.player.draw();
});
