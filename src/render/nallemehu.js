(function (SaunaTim) {
  const { ASSETS, NALLEMEHU, VIEWPORT } = SaunaTim.config;
  const { getBlackKeyedImage, loadImage } = SaunaTim.assets;
  const { roundedRect } = SaunaTim.render.primitives;
  const vladimirFaceImage = loadImage(ASSETS.vladimirFace);
  const VLADIMIR_FACE_CROP = {
    sx: 430,
    sy: 0,
    sw: 610,
    sh: 700
  };

  function drawNallemehu(ctx, state) {
    const event = state.nallemehu;
    if (!event || event.phase === "hidden" || event.phase === "done") return;

    if (event.phase !== "ad") {
      const scale = NALLEMEHU.bottle.scale || 1;
      drawRope(ctx, event, scale);
      drawBottle(ctx, event, scale);
    }

    if (event.popupOpen) {
      drawDiscoveryPopup(ctx);
    }

    if (event.phase === "ad") {
      drawAd(ctx, event);
    }
  }

  function drawBottle(ctx, event, scale = 1, rotation = NALLEMEHU.bottle.rotation) {
    const glow = event.phase === "available" || event.phase === "armed";

    ctx.save();
    ctx.translate(event.x, event.y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    if (glow) {
      ctx.save();
      ctx.globalAlpha = .56 + Math.sin((event.age || 0) * .12) * .12;
      ctx.fillStyle = "rgba(255, 222, 112, .36)";
      ctx.beginPath();
      ctx.ellipse(0, 2, 55, 115, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = .42;
    ctx.fillStyle = "#080302";
    ctx.beginPath();
    ctx.ellipse(10, 80, 36, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const glass = ctx.createLinearGradient(-35, -120, 35, 80);
    glass.addColorStop(0, "#7d451e");
    glass.addColorStop(.28, "#a25c25");
    glass.addColorStop(.52, "#5a2a11");
    glass.addColorStop(1, "#2d1308");

    ctx.fillStyle = glass;
    ctx.strokeStyle = "#180904";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-28, 78);
    ctx.quadraticCurveTo(-38, 68, -35, 48);
    ctx.lineTo(-25, -40);
    ctx.quadraticCurveTo(-23, -58, -9, -66);
    ctx.lineTo(-6, -113);
    ctx.lineTo(14, -113);
    ctx.lineTo(17, -66);
    ctx.quadraticCurveTo(31, -58, 33, -40);
    ctx.lineTo(38, 48);
    ctx.quadraticCurveTo(40, 68, 29, 78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = .4;
    ctx.strokeStyle = "#ffd49a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-18, -42);
    ctx.quadraticCurveTo(-23, 3, -18, 54);
    ctx.stroke();
    ctx.globalAlpha = 1;

    drawCrownCap(ctx);
    drawLabel(ctx);

    ctx.restore();
  }

  function drawRope(ctx, event, scale) {
    const anchorX = NALLEMEHU.bottle.anchorX;
    const anchorY = NALLEMEHU.bottle.anchorY;
    const rotation = NALLEMEHU.bottle.rotation;
    const neck = transformBottlePoint(event, 4, -121, scale, rotation);
    const sway = Math.sin((event.age || 0) * .13) * 2.5;

    ctx.save();
    ctx.lineCap = "round";

    ctx.strokeStyle = "rgba(19,10,5,.78)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(anchorX + 2, anchorY + 2);
    ctx.quadraticCurveTo(
      (anchorX + neck.x) / 2 + sway + 2,
      (anchorY + neck.y) / 2 + 2,
      neck.x + 2,
      neck.y + 2
    );
    ctx.stroke();

    ctx.strokeStyle = "#b88a55";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.quadraticCurveTo(
      (anchorX + neck.x) / 2 + sway,
      (anchorY + neck.y) / 2,
      neck.x,
      neck.y
    );
    ctx.stroke();

    ctx.fillStyle = "#5c3219";
    ctx.strokeStyle = "#1a0c05";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function transformBottlePoint(event, localX, localY, scale, rotation) {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const x = localX * scale;
    const y = localY * scale;

    return {
      x: event.x + x * cos - y * sin,
      y: event.y + x * sin + y * cos
    };
  }

  function drawCrownCap(ctx) {
    ctx.save();
    ctx.translate(4, -121);
    ctx.fillStyle = "#d9d0b7";
    ctx.strokeStyle = "#382315";
    ctx.lineWidth = 2.4;

    ctx.beginPath();
    ctx.ellipse(0, -8, 17, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-18, -5);
    for (let i = 0; i < 9; i++) {
      const x = -18 + i * 4.5;
      ctx.lineTo(x, i % 2 === 0 ? 10 : 4);
    }
    ctx.lineTo(18, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.46)";
    ctx.beginPath();
    ctx.ellipse(-3, -10, 8, 2.8, -.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLabel(ctx) {
    ctx.save();
    ctx.translate(4, 5);
    ctx.rotate(.08);

    ctx.fillStyle = "#ffe7a8";
    ctx.strokeStyle = "#3b1c0e";
    ctx.lineWidth = 3;
    roundedRect(ctx, -33, -38, 66, 68, 8, true, true);

    ctx.fillStyle = "#5a2b13";
    ctx.strokeStyle = "rgba(255,255,255,.65)";
    ctx.lineWidth = 1.7;
    ctx.font = "1000 17px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Nalle", 0, -15);
    ctx.fillText("mehu", 0, 6);

    drawBearFace(ctx, 19, 21, .64);

    ctx.restore();
  }

  function drawBearFace(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#8a4f26";
    ctx.strokeStyle = "#3b1c0e";
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.arc(-8, -7, 5, 0, Math.PI * 2);
    ctx.arc(8, -7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f4c589";
    ctx.beginPath();
    ctx.ellipse(0, 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1c0b05";
    ctx.beginPath();
    ctx.arc(-4, -2, 1.8, 0, Math.PI * 2);
    ctx.arc(4, -2, 1.8, 0, Math.PI * 2);
    ctx.arc(0, 4, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawDiscoveryPopup(ctx) {
    const { x, y, width, height } = NALLEMEHU.popup;

    ctx.save();
    ctx.fillStyle = "rgba(7,4,3,.78)";
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    ctx.fillStyle = "rgba(255, 241, 168, .09)";
    ctx.strokeStyle = "#d9964d";
    ctx.lineWidth = 4;
    roundedRect(ctx, x, y, width, height, 18, true, true);

    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.82)";
    ctx.lineWidth = 4;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = "900 31px system-ui";
    strokeFillText(ctx, "Osuit Nallemehuun!", x + 38, y + 58);

    ctx.font = "800 24px system-ui";
    ctx.fillStyle = "#fff";
    const lines = [
      "Jos saat seuraavalla heitolla uuden osuman pulloon,",
      "vastustajasi muuttuu Vladimiriksi",
      "mainoksen jälkeen!"
    ];
    lines.forEach((line, index) => {
      strokeFillText(ctx, line, x + 38, y + 110 + index * 36);
    });

    ctx.save();
    ctx.translate(x + width - 176, y + 58);
    drawBottle(ctx, { x: 0, y: 0, age: 20, phase: "available" }, .36, .38);
    ctx.restore();

    drawVladimirIcon(ctx, x + width - 92, y + 185, 1.08);
    drawPopupButton(ctx, x + width / 2 - 168, y + height - 66, 132, 44, "OK");
    drawPopupButton(ctx, x + width / 2 - 18, y + height - 66, 188, 44, "Ei kiitos");
    drawRoundButton(ctx, x + width - 46, y + 38, 22, "×");

    ctx.restore();
  }

  function drawAd(ctx, event) {
    const progress = 1 - Math.max(0, event.adTimer) / NALLEMEHU.adDuration;
    const cardX = 230;
    const cardY = 168;
    const cardW = 820;
    const cardH = 360;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.74)";
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    const card = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    card.addColorStop(0, "#6b3517");
    card.addColorStop(.54, "#241007");
    card.addColorStop(1, "#0d0603");
    ctx.fillStyle = card;
    ctx.strokeStyle = "#ffd66e";
    ctx.lineWidth = 5;
    roundedRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.82)";
    ctx.lineWidth = 6;
    ctx.font = "1000 50px system-ui";
    strokeFillText(ctx, "Mainoskatko", 640, cardY + 64);

    ctx.fillStyle = "#fff";
    ctx.font = "900 29px system-ui";
    strokeFillText(ctx, "Tähän tulisi lopullisessa pelissä mainos,", 640, cardY + 134);

    ctx.font = "900 29px system-ui";
    strokeFillText(ctx, "jolla saat Vladimirin.", 640, cardY + 176);

    ctx.save();
    ctx.translate(cardX + 146, cardY + 218);
    drawBottle(ctx, { x: 0, y: 0, age: 36, phase: "available" }, .8);
    ctx.restore();

    drawVladimirIcon(ctx, cardX + cardW - 152, cardY + 224, 1.9);

    ctx.fillStyle = "rgba(0,0,0,.52)";
    ctx.strokeStyle = "#d9964d";
    ctx.lineWidth = 3;
    roundedRect(ctx, cardX + 250, cardY + 260, 320, 22, 11, true, true);

    ctx.fillStyle = "#fff1a8";
    roundedRect(ctx, cardX + 253, cardY + 263, Math.max(0, 314 * progress), 16, 8, true, false);

    ctx.restore();
  }

  function drawVladimirIcon(ctx, x, y, scale) {
    if (drawVladimirPhotoIcon(ctx, x, y, scale)) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(33, 18, 10, .44)";
    ctx.beginPath();
    ctx.ellipse(1, 4, 28, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    const face = ctx.createLinearGradient(-18, -28, 22, 30);
    face.addColorStop(0, "#ffd1a4");
    face.addColorStop(.44, "#e4a16f");
    face.addColorStop(1, "#b86a43");
    ctx.fillStyle = face;
    ctx.strokeStyle = "#5d2b18";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-19, -12);
    ctx.quadraticCurveTo(-17, -31, 2, -36);
    ctx.quadraticCurveTo(23, -33, 25, -10);
    ctx.quadraticCurveTo(27, 12, 12, 29);
    ctx.quadraticCurveTo(-3, 40, -16, 25);
    ctx.quadraticCurveTo(-28, 8, -19, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#dfb28b";
    ctx.beginPath();
    ctx.ellipse(-21, -5, 5, 12, -.2, 0, Math.PI * 2);
    ctx.ellipse(26, -6, 5, 12, .2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#9d7b58";
    ctx.lineWidth = 4.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-14, -28);
    ctx.quadraticCurveTo(1, -37, 19, -29);
    ctx.stroke();

    ctx.strokeStyle = "#5d442f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, -12);
    ctx.quadraticCurveTo(-8, -17, -1, -14);
    ctx.moveTo(7, -14);
    ctx.quadraticCurveTo(15, -17, 21, -12);
    ctx.stroke();

    ctx.fillStyle = "#f4dfc2";
    ctx.beginPath();
    ctx.ellipse(-7, -7, 6, 3, -.12, 0, Math.PI * 2);
    ctx.ellipse(13, -8, 6, 3, .12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#24130d";
    ctx.beginPath();
    ctx.arc(-6, -7, 1.7, 0, Math.PI * 2);
    ctx.arc(13, -8, 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7a432a";
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(4, -4);
    ctx.quadraticCurveTo(10, 8, 0, 12);
    ctx.moveTo(-10, 20);
    ctx.quadraticCurveTo(1, 24, 14, 18);
    ctx.stroke();

    ctx.strokeStyle = "rgba(91,43,24,.48)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-16, 1);
    ctx.quadraticCurveTo(-13, 12, -20, 19);
    ctx.moveTo(20, 0);
    ctx.quadraticCurveTo(18, 12, 23, 18);
    ctx.moveTo(-6, 29);
    ctx.quadraticCurveTo(4, 32, 14, 27);
    ctx.stroke();

    ctx.save();
    ctx.translate(2, -37);
    ctx.rotate(-.08);
    ctx.fillStyle = "#ead8a8";
    ctx.strokeStyle = "#75613e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-29, 12);
    ctx.quadraticCurveTo(-13, -17, 20, -15);
    ctx.quadraticCurveTo(35, -2, 28, 17);
    ctx.quadraticCurveTo(-2, 27, -29, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#8d7850";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-29, 13);
    ctx.quadraticCurveTo(-2, 28, 28, 17);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(18, -16, 6, .25, Math.PI * 1.82);
    ctx.stroke();
    drawTinyRedStar(ctx, 0, 2, 5.8);
    ctx.restore();

    ctx.restore();
  }

  function drawVladimirPhotoIcon(ctx, x, y, scale) {
    const image = getBlackKeyedImage(vladimirFaceImage);
    if (!image) return false;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(19, 9, 5, .46)";
    ctx.beginPath();
    ctx.ellipse(1, 2, 32, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(
      image,
      VLADIMIR_FACE_CROP.sx,
      VLADIMIR_FACE_CROP.sy,
      VLADIMIR_FACE_CROP.sw,
      VLADIMIR_FACE_CROP.sh,
      -31,
      -45,
      62,
      84
    );

    ctx.restore();
    return true;
  }

  function drawTinyRedStar(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#c83a2e";
    ctx.strokeStyle = "#7b1b13";
    ctx.lineWidth = 1;
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

  function drawPopupButton(ctx, x, y, width, height, text) {
    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "#3b1c0e";
    ctx.lineWidth = 3;
    roundedRect(ctx, x, y, width, height, 8, true, true);

    ctx.fillStyle = "#3b1c0e";
    ctx.font = "1000 24px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, y + height / 2 + 1);
  }

  function drawRoundButton(ctx, x, y, radius, text) {
    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "#3b1c0e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#3b1c0e";
    ctx.font = "1000 30px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y - 2);
  }

  function strokeFillText(ctx, text, x, y) {
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  SaunaTim.render.nallemehu = {
    drawNallemehu
  };
})(window.SaunaTim = window.SaunaTim || {});
