(function (SaunaTim) {
  const { ASSETS, MAX_HP } = SaunaTim.config;
  const { getBlackKeyedImage, loadImage } = SaunaTim.assets;
  const { circle } = SaunaTim.render.primitives;
  const vladimirFaceImage = loadImage(ASSETS.vladimirFace);
  const VLADIMIR_FACE_CROP = {
    sx: 430,
    sy: 0,
    sw: 610,
    sh: 700
  };

  function drawSkinRedness(ctx, players) {
    drawPlayerSkinRedness(ctx, players, 0);
    drawPlayerSkinRedness(ctx, players, 1);
  }

  function drawCharacterOverlays(ctx, state) {
    if (state.opponentVariant === "vladimir") {
      drawVladimirOpponent(ctx);
    }
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

  function drawVladimirOpponent(ctx) {
    if (drawVladimirPhotoOpponent(ctx)) return;

    ctx.save();

    ctx.fillStyle = "rgba(86, 47, 25, .88)";
    ctx.beginPath();
    ctx.ellipse(1108, 353, 62, 73, .06, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(1107, 350);
    ctx.rotate(.025);

    const face = ctx.createLinearGradient(-32, -42, 30, 46);
    face.addColorStop(0, "#ffd3a9");
    face.addColorStop(.38, "#e9a873");
    face.addColorStop(.7, "#c8794b");
    face.addColorStop(1, "#9f542f");
    ctx.fillStyle = face;
    ctx.strokeStyle = "#5b2b18";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-31, -18);
    ctx.quadraticCurveTo(-30, -43, -5, -52);
    ctx.quadraticCurveTo(27, -49, 35, -18);
    ctx.quadraticCurveTo(38, 15, 20, 39);
    ctx.quadraticCurveTo(2, 58, -17, 40);
    ctx.quadraticCurveTo(-36, 17, -31, -18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#c69a78";
    ctx.beginPath();
    ctx.ellipse(-21, -27, 9, 16, -.55, 0, Math.PI * 2);
    ctx.ellipse(22, -28, 9, 15, .55, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#9a6d50";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-23, -38);
    ctx.quadraticCurveTo(-6, -48, 18, -39);
    ctx.stroke();

    ctx.fillStyle = "#f1c09a";
    ctx.beginPath();
    ctx.ellipse(-35, -7, 7, 18, -.18, 0, Math.PI * 2);
    ctx.ellipse(36, -8, 7, 18, .18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#5d442f";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-22, -17);
    ctx.quadraticCurveTo(-14, -21, -5, -18);
    ctx.moveTo(7, -18);
    ctx.quadraticCurveTo(16, -21, 25, -17);
    ctx.stroke();

    ctx.fillStyle = "#f6e4c8";
    ctx.beginPath();
    ctx.ellipse(-13, -10, 8, 4.2, -.06, 0, Math.PI * 2);
    ctx.ellipse(14, -10, 8, 4.2, .06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2a1a12";
    ctx.beginPath();
    ctx.arc(-12, -10, 2.2, 0, Math.PI * 2);
    ctx.arc(13, -10, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7a432a";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(2, -5);
    ctx.quadraticCurveTo(10, 9, -2, 13);
    ctx.moveTo(-12, 27);
    ctx.quadraticCurveTo(2, 32, 17, 25);
    ctx.stroke();

    ctx.strokeStyle = "rgba(96,45,23,.45)";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-22, -2);
    ctx.quadraticCurveTo(-18, 12, -26, 23);
    ctx.moveTo(24, -2);
    ctx.quadraticCurveTo(21, 13, 29, 22);
    ctx.moveTo(-8, 37);
    ctx.quadraticCurveTo(4, 42, 16, 35);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.24)";
    ctx.beginPath();
    ctx.ellipse(-11, -30, 7, 4, -.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.translate(1106, 300);
    ctx.rotate(-.035);
    ctx.fillStyle = "#ead9ae";
    ctx.strokeStyle = "#705f3d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-45, 16);
    ctx.quadraticCurveTo(-20, -26, 27, -22);
    ctx.quadraticCurveTo(47, -4, 38, 23);
    ctx.quadraticCurveTo(-2, 37, -45, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#8c7950";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-45, 17);
    ctx.quadraticCurveTo(-2, 39, 39, 22);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(22, -24, 9, .15, Math.PI * 1.85);
    ctx.stroke();

    drawRedStar(ctx, -1, 3, 10);
    ctx.restore();

    ctx.save();
    ctx.translate(1108, 407);
    ctx.fillStyle = "rgba(232, 169, 118, .96)";
    ctx.strokeStyle = "rgba(91,43,24,.72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  function drawVladimirPhotoOpponent(ctx) {
    const image = getBlackKeyedImage(vladimirFaceImage);
    if (!image) return false;

    ctx.save();

    ctx.fillStyle = "rgba(44, 20, 9, .84)";
    ctx.beginPath();
    ctx.ellipse(1108, 350, 63, 76, .02, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(
      image,
      VLADIMIR_FACE_CROP.sx,
      VLADIMIR_FACE_CROP.sy,
      VLADIMIR_FACE_CROP.sw,
      VLADIMIR_FACE_CROP.sh,
      1049,
      253,
      118,
      151
    );

    ctx.restore();
    return true;
  }

  function drawRedStar(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#c83a2e";
    ctx.strokeStyle = "#7b1b13";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 === 0 ? radius : radius * .42;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
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
    drawSkinRedness
  };
})(window.SaunaTim = window.SaunaTim || {});
