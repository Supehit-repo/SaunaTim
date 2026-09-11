(function (SaunaTim) {
  const { NALLEMEHU, VIEWPORT } = SaunaTim.config;
  const { roundedRect } = SaunaTim.render.primitives;

  function drawNallemehu(ctx, state) {
    const event = state.nallemehu;
    if (!event || event.phase === "hidden" || event.phase === "done") return;

    const scale = NALLEMEHU.bottle.scale || 1;
    drawRope(ctx, event, scale);
    drawBottle(ctx, event, scale);

    if (event.popupOpen) {
      drawDiscoveryPopup(ctx);
    }
  }

  function drawBottle(ctx, event, scale = 1, rotation = NALLEMEHU.bottle.rotation) {
    const glow = event.phase === "available";

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
    strokeFillText(ctx, "Onneksi olkoon!", x + 38, y + 58);

    ctx.font = "800 23px system-ui";
    ctx.fillStyle = "#fff";
    const lines = [
      "Voitit -10% alennuksen seuraavaan",
      "Kyläsaunan tapahtumaasi.",
      "Koodi: SaunaTIM26",
      "Käytä koodia varauksen yhteydessä."
    ];
    lines.forEach((line, index) => {
      const isCode = line.includes("SaunaTIM26");
      if (isCode) {
        ctx.fillStyle = "#fff1a8";
        ctx.font = "900 25px system-ui";
      } else {
        ctx.fillStyle = "#fff";
        ctx.font = "800 23px system-ui";
      }
      strokeFillText(ctx, line, x + 38, y + 106 + index * 33);
    });

    ctx.save();
    ctx.translate(x + width - 124, y + 136);
    drawBottle(ctx, { x: 0, y: 0, age: 20, phase: "available" }, .44, .2);
    ctx.restore();

    drawPopupButton(ctx, x + width / 2 - 80, y + height - 66, 160, 44, "OK");
    drawRoundButton(ctx, x + width - 46, y + 38, 22, "×");

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
