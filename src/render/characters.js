(function (SaunaTim) {
  const { ASSETS } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;

  const CHARACTER_WIDTH = 444;
  const CHARACTER_HEIGHT = 295;
  const PLAYER_SPRITE_RECT = {
    x: 31,
    y: 217,
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT
  };
  const OPPONENT_SPRITE_RECTS = {
    default: {
      x: 815,
      y: 218,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT
    }
  };

  const playerCharacterImages = Object.entries(ASSETS.playerCharacters || {}).reduce((images, [variant, src]) => {
    images[variant] = loadImage(src);
    return images;
  }, {});
  const opponentCharacterImages = Object.entries(ASSETS.opponentCharacters || {}).reduce((images, [variant, src]) => {
    images[variant] = loadImage(src);
    return images;
  }, {});
  function drawCharacterOverlays(ctx, state) {
    drawPlayerCharacter(ctx, state);
    drawOpponentCharacter(ctx, state);
  }

  function drawPlayerCharacter(ctx, state) {
    const image = getPlayerCharacterImage(state);

    if (!isImageReady(image)) return;

    drawCharacterImage(ctx, image, PLAYER_SPRITE_RECT);
  }

  function drawOpponentCharacter(ctx, state) {
    const image = getOpponentCharacterImage(state);

    if (!isImageReady(image)) return;

    drawCharacterImage(ctx, image, getOpponentSpriteRect(state));
  }

  function drawCharacterImage(ctx, image, rect) {
    ctx.drawImage(
      image,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
  }

  function getPlayerCharacterImage() {
    return playerCharacterImages.default || null;
  }

  function getOpponentCharacterImage() {
    return opponentCharacterImages.default || null;
  }

  function getOpponentSpriteRect() {
    return OPPONENT_SPRITE_RECTS.default;
  }

  function isPlayerSpriteReady(state) {
    return isImageReady(getPlayerCharacterImage(state));
  }

  function isOpponentSpriteReady(state) {
    return isImageReady(getOpponentCharacterImage(state));
  }

  function isImageReady(image) {
    return image && image.complete && image.naturalWidth > 0;
  }

  SaunaTim.render.characters = {
    drawCharacterOverlays,
    isPlayerSpriteReady,
    isOpponentSpriteReady
  };
})(window.SaunaTim = window.SaunaTim || {});
