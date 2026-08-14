(function (SaunaTim) {
  const { ASSETS } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;

  const CHARACTER_WIDTH = 370;
  const CHARACTER_HEIGHT = 246;
  const PLAYER_SPRITE_RECT = {
    x: 108,
    y: 304,
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT
  };
  const OPPONENT_SPRITE_RECTS = {
    default: {
      x: 812,
      y: 305,
      width: CHARACTER_WIDTH,
      height: CHARACTER_HEIGHT
    },
    vladimir: {
      x: 807,
      y: 296,
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
  let woodenStoolSprite = null;

  function drawCharacterOverlays(ctx, state) {
    drawCharacterStools(ctx);
    drawPlayerCharacter(ctx, state);
    drawOpponentCharacter(ctx, state);
  }

  function drawCharacterStools(ctx) {
    drawWoodenStool(ctx, 232, 468);
    drawWoodenStool(ctx, 1048, 468);
  }

  function drawWoodenStool(ctx, centerX, y) {
    const sprite = getWoodenStoolSprite();
    ctx.drawImage(sprite, centerX - sprite.width / 2, y - 14);
  }

  function getWoodenStoolSprite() {
    if (woodenStoolSprite) return woodenStoolSprite;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 100;
    const spriteCtx = canvas.getContext("2d");
    spriteCtx.translate(64, 14);
    drawWoodenStoolShape(spriteCtx);
    woodenStoolSprite = canvas;
    return woodenStoolSprite;
  }

  function drawWoodenStoolShape(ctx) {
    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    ctx.ellipse(0, 68, 49, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    const legGradient = ctx.createLinearGradient(0, 18, 0, 72);
    legGradient.addColorStop(0, "#9b5522");
    legGradient.addColorStop(.55, "#6f3516");
    legGradient.addColorStop(1, "#3b1b0b");

    ctx.fillStyle = legGradient;
    ctx.strokeStyle = "rgba(30, 12, 4, .78)";
    ctx.lineWidth = 2.2;
    drawStoolLeg(ctx, -28, 9, -39, 55);
    drawStoolLeg(ctx, 28, 9, 39, 55);

    ctx.strokeStyle = "rgba(255, 188, 93, .32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-21, 20);
    ctx.lineTo(21, 20);
    ctx.stroke();

    const seatGradient = ctx.createLinearGradient(0, -8, 0, 24);
    seatGradient.addColorStop(0, "#cf8435");
    seatGradient.addColorStop(.48, "#9a4f1f");
    seatGradient.addColorStop(1, "#57260d");

    ctx.fillStyle = seatGradient;
    ctx.strokeStyle = "rgba(36, 15, 5, .88)";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-46, 5);
    ctx.quadraticCurveTo(-26, -8, 0, -6);
    ctx.quadraticCurveTo(27, -8, 47, 5);
    ctx.lineTo(39, 25);
    ctx.quadraticCurveTo(0, 34, -39, 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 213, 130, .32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, 7);
    ctx.quadraticCurveTo(0, 1, 32, 7);
    ctx.stroke();

    ctx.restore();
  }

  function drawStoolLeg(ctx, topX, topY, bottomX, bottomY) {
    ctx.beginPath();
    ctx.moveTo(topX - 9, topY);
    ctx.lineTo(topX + 8, topY + 1);
    ctx.lineTo(bottomX + 10, bottomY);
    ctx.lineTo(bottomX - 8, bottomY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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

  function getOpponentCharacterImage(state) {
    return opponentCharacterImages[state.opponentVariant] || opponentCharacterImages.default || null;
  }

  function getOpponentSpriteRect(state) {
    return OPPONENT_SPRITE_RECTS[state.opponentVariant] || OPPONENT_SPRITE_RECTS.default;
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
