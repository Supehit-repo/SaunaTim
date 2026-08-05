(function (SaunaTim) {
  const images = new Map();
  const blackKeyedImages = new WeakMap();

  function loadImage(src) {
    if (images.has(src)) {
      return images.get(src);
    }

    const image = new Image();
    image.src = src;
    images.set(src, image);
    return image;
  }

  function getBlackKeyedImage(image) {
    if (!image || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
      return null;
    }

    if (blackKeyedImages.has(image)) {
      return blackKeyedImages.get(image);
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    let pixels;
    try {
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
      blackKeyedImages.set(image, image);
      return image;
    }

    const data = pixels.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const brightness = red + green + blue;
      const isBlackBackground = brightness < 92 && Math.max(red, green, blue) < 48;

      if (isBlackBackground) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(pixels, 0, 0);
    blackKeyedImages.set(image, canvas);
    return canvas;
  }

  SaunaTim.assets = {
    getBlackKeyedImage,
    loadImage
  };
})(window.SaunaTim = window.SaunaTim || {});
