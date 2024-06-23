import MainFrame from "./common/MainFrame.js";
import SkyBackground from "./common/background/SkyBackground.js";
import Level1 from "./common/stages/Level1.js";

const frame = new MainFrame();

const idCanvas = "gameCanvas";

frame.preload(async (loader) => {
  await Level1.preload(loader);
});

frame.initialize((controller) => {
  return {
    level1: new Level1(idCanvas, controller),
  };
});

frame.update((renderer) => {
  renderer.level1.draw();
});

document.addEventListener("initializeCompleted", (event) => {
  const bg = getImage(SkyBackground.imageId);

  if (bg instanceof HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = bg.width;
    canvas.height = bg.height;

    context.drawImage(bg, 0, 0);

    canvas.toBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const mainElement = document.getElementById("backdrop");
      mainElement.style.backgroundImage = `url(${blobUrl})`;
      mainElement.style.backgroundPosition = "center";
      mainElement.style.backgroundSize = "cover";
      mainElement.style.backgroundRepeat = "no-repeat";
    }, "image/png");
  }
});
