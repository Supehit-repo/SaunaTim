(function (SaunaTim) {
  const { ASSETS, MAX_HP } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;
  const { circle } = SaunaTim.render.primitives;

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

  function drawSkinRedness(ctx, players) {
    drawPlayerSkinRedness(ctx, players, 0);
    drawPlayerSkinRedness(ctx, players, 1);
  }

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
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, .3)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(
      image,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
    ctx.restore();
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

  function drawPlayerSkinRedness(ctx, players, playerIndex) {
    const hp = players[playerIndex].hp;
    if (hp <= 0) return;

    const alpha = Math.min(.34, hp / MAX_HP * .34);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#ff6554";
    ctx.strokeStyle = "#ff6554";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (playerIndex === 0) {
      tintLeftPlayerSkin(ctx);
    } else {
      tintRightPlayerSkin(ctx);
    }

    ctx.restore();
  }

  function tintLeftPlayerSkin(ctx) {
    circle(ctx, 55, 58, 34, true, false);
    ellipse(ctx, 128, 353, 31, 39, -.12);
    ellipse(ctx, 128, 431, 36, 48, -.15);
    strokeLimb(ctx, 148, 407, 197, 451, 20);
    strokeLimb(ctx, 111, 449, 161, 488, 22);
    strokeLimb(ctx, 151, 463, 124, 518, 24);
    strokeLimb(ctx, 159, 466, 185, 494, 20);
  }

  function tintRightPlayerSkin(ctx) {
    circle(ctx, 1222, 58, 34, true, false);
    ellipse(ctx, 1104, 363, 31, 41, .05);
    ellipse(ctx, 1108, 438, 39, 47, .12);
    strokeLimb(ctx, 1087, 417, 1028, 453, 20);
    strokeLimb(ctx, 1122, 456, 1089, 503, 22);
    strokeLimb(ctx, 1117, 462, 1148, 494, 19);
  }

  function ellipse(ctx, x, y, rx, ry, rotation) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
  }

  function strokeLimb(ctx, x1, y1, x2, y2, width) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  SaunaTim.render.characters = {
    drawCharacterOverlays,
    drawSkinRedness,
    isPlayerSpriteReady,
    isOpponentSpriteReady
  };
})(window.SaunaTim = window.SaunaTim || {});
