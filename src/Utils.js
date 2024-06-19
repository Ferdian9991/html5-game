class Utils {
  static drawPlayScreen() {
    const canvas = document.getElementById("play-screen");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return [canvas, ctx];
  }

  static drawBackgroundScreen() {
    const canvas = document.getElementById("background-screen");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image();
    img.src = "assets/sky-bg.jpg";
    img.onload = () => {
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvas.width / canvas.height;

      let sx = 0,
        sy = 0,
        sWidth = img.width,
        sHeight = img.height,
        dx = 0,
        dy = 0,
        dWidth = canvas.width,
        dHeight = canvas.height;

      if (imgAspectRatio > canvasAspectRatio) {
        sWidth = img.height * canvasAspectRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / canvasAspectRatio;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    return [canvas, ctx];
  }
}
