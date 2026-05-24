(function (SaunaTim) {
  function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  SaunaTim.assets = {
    loadImage
  };
})(window.SaunaTim = window.SaunaTim || {});
