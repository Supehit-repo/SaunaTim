(function (SaunaTim) {
  const { ASSETS, MAX_HP, VIEWPORT, WINS_TO_MATCH } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;
  const { roundedRect } = SaunaTim.render.primitives;
  const saunaLogoImage = ASSETS.saunaLogo ? loadImage(ASSETS.saunaLogo) : null;
  const SAUNA_LOGO_CROP = {
    sx: 58,
    sy: 70,
    sw: 405,
    sh: 182
  };

  function drawHud(ctx, state) {
    drawHeartBox(ctx, 126, 43, 318, 52, state.players[0]);
    drawHeartBox(ctx, 836, 43, 318, 52, state.players[1]);
    drawPlayerName(ctx, 285, 32, state.players[0].name);
    drawPlayerName(ctx, 995, 32, state.players[1].name);
    drawSaunaLogo(ctx);
    drawWins(ctx, 285, 119, state.players[0]);
    drawWins(ctx, 995, 119, state.players[1]);
    drawRoundAndMessage(ctx, state);
    if (state.gameOver) drawGameOver(ctx, state);
  }

  function drawHudTopLayer(ctx, state) {
    drawHealthHeart(ctx, 126, 43, 318, 52, state.players[0], 1);
    drawHealthHeart(ctx, 836, 43, 318, 52, state.players[1], -1);
  }

  function drawHeartBox(ctx, x, y, width, height, player) {
    const remaining = MAX_HP - player.hp;

    ctx.save();
    ctx.fillStyle = "#23120b";
    ctx.strokeStyle = "#d9964d";
    ctx.lineWidth = 4;
    roundedRect(ctx, x, y, width, height, 11, true, true);

    ctx.fillStyle = "#120c09";
    roundedRect(ctx, x + 8, y + 9, width - 16, height - 18, 8, true, false);

    ctx.save();
    ctx.beginPath();
    roundedRect(ctx, x + 8, y + 9, (width - 16) * (remaining / MAX_HP), height - 18, 8, false, false);
    ctx.clip();
    const healthGradient = ctx.createLinearGradient(x + 8, y, x + width - 8, y);
    healthGradient.addColorStop(0, "#ffdf62");
    healthGradient.addColorStop(.55, "#ff7b30");
    healthGradient.addColorStop(1, "#e4433c");
    ctx.fillStyle = healthGradient;
    ctx.fillRect(x + 8, y + 9, width - 16, height - 18);
    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,.88)";
    ctx.lineWidth = 5;
    ctx.font = "900 26px system-ui";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.strokeText(`${remaining}/${MAX_HP}`, x + width / 2 + 24, y + 29);
    ctx.fillText(`${remaining}/${MAX_HP}`, x + width / 2 + 24, y + 29);

    ctx.restore();
  }

  function drawHealthHeart(ctx, x, y, width, height, player, side) {
    const heat = player.hp / MAX_HP;
    const pulse = player.heartPulse > 0 ? Math.sin(player.heartPulse * .52) * player.heartPulse / 44 : 0;
    const scale = 1 + Math.max(0, pulse);
    const heartX = side > 0 ? x + width - 8 : x + 8;
    const heartY = y + height / 2 + 2;

    ctx.save();
    ctx.translate(heartX, heartY);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 3;
    drawHeart(ctx, 0, 0, 18 + heat * 5);

    ctx.restore();
  }

  function drawPlayerName(ctx, x, y, name) {
    ctx.save();
    ctx.fillStyle = "#fff7dc";
    ctx.strokeStyle = "rgba(0,0,0,.9)";
    ctx.lineWidth = 5;
    ctx.font = "1000 26px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.strokeText(name, x, y);
    ctx.fillText(name, x, y);
    ctx.restore();
  }

  function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#f0383e";
    ctx.strokeStyle = "rgba(0,0,0,.88)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, size * .62);
    ctx.bezierCurveTo(-size * 1.18, -size * .06, -size * .68, -size * .86, 0, -size * .35);
    ctx.bezierCurveTo(size * .68, -size * .86, size * 1.18, -size * .06, 0, size * .62);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.beginPath();
    ctx.ellipse(-size * .28, -size * .23, size * .17, size * .11, -.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSaunaLogo(ctx) {
    if (saunaLogoImage && saunaLogoImage.complete && saunaLogoImage.naturalWidth > 0) {
      drawSaunaLogoImage(ctx);
      return;
    }

    ctx.save();

    drawLogoSteam(ctx, 640, 20, .62);
    drawVihta(ctx, 485, 55, -1);
    drawVihta(ctx, 795, 55, 1);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "1000 50px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    const text = "SAUNA TIM";
    const fill = ctx.createLinearGradient(0, 25, 0, 78);
    fill.addColorStop(0, "#ffffff");
    fill.addColorStop(.46, "#fff7dc");
    fill.addColorStop(1, "#ffd36a");

    ctx.shadowColor = "rgba(0,0,0,.9)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 5;
    ctx.strokeStyle = "rgba(18,7,3,.98)";
    ctx.lineWidth = 12;
    ctx.strokeText(text, 640, 54);

    ctx.shadowColor = "rgba(255,165,55,.24)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "#9a4b1f";
    ctx.lineWidth = 5;
    ctx.strokeText(text, 640, 54);

    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = fill;
    ctx.fillText(text, 640, 54);

    drawLogoSteam(ctx, 640, 15, .9);

    ctx.globalAlpha = .42;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(504, 37);
    ctx.quadraticCurveTo(640, 21, 776, 37);
    ctx.stroke();

    ctx.restore();
  }

  function drawSaunaLogoImage(ctx) {
    const width = 348;
    const height = width * SAUNA_LOGO_CROP.sh / SAUNA_LOGO_CROP.sw;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.62)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.drawImage(
      saunaLogoImage,
      SAUNA_LOGO_CROP.sx,
      SAUNA_LOGO_CROP.sy,
      SAUNA_LOGO_CROP.sw,
      SAUNA_LOGO_CROP.sh,
      640 - width / 2,
      4,
      width,
      height
    );
    ctx.restore();
  }

  function drawLogoSteam(ctx, centerX, y, intensity = 1) {
    ctx.save();
    ctx.lineCap = "round";

    const wisps = [
      { x: -132, h: 25, lean: -14, alpha: .32 },
      { x: -72, h: 31, lean: 11, alpha: .28 },
      { x: -8, h: 27, lean: -7, alpha: .34 },
      { x: 58, h: 33, lean: 14, alpha: .26 },
      { x: 128, h: 24, lean: -10, alpha: .3 }
    ];

    wisps.forEach((wisp, index) => {
      const x = centerX + wisp.x;
      const steamGradient = ctx.createLinearGradient(x, y + wisp.h, x, y - 8);
      steamGradient.addColorStop(0, `rgba(255,255,255,0)`);
      steamGradient.addColorStop(.42, `rgba(255,255,255,${wisp.alpha * intensity})`);
      steamGradient.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.strokeStyle = steamGradient;
      ctx.lineWidth = 7 - index % 2;
      ctx.beginPath();
      ctx.moveTo(x, y + wisp.h);
      ctx.bezierCurveTo(
        x - wisp.lean * .95,
        y + wisp.h * .68,
        x + wisp.lean * .95,
        y + wisp.h * .28,
        x + wisp.lean,
        y - 6
      );
      ctx.stroke();
    });

    ctx.globalAlpha = .2 * intensity;
    ctx.fillStyle = "#ffffff";
    [
      [centerX - 112, y + 19, 13, 7],
      [centerX - 24, y + 14, 17, 8],
      [centerX + 78, y + 18, 15, 7],
      [centerX + 142, y + 12, 11, 6]
    ].forEach(([x, yy, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, yy, rx, ry, -.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawVihta(ctx, x, y, side) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(side * .36);
    ctx.lineCap = "round";

    const stem = ctx.createLinearGradient(0, -36, 0, 35);
    stem.addColorStop(0, "#a8df63");
    stem.addColorStop(1, "#496d22");
    ctx.strokeStyle = stem;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.bezierCurveTo(side * 5, 9, side, -14, side * 3, -36);
    ctx.stroke();

    for (let i = 0; i < 9; i++) {
      const yy = 24 - i * 7;
      const spread = 15 + i * 1.15;
      drawLeaf(ctx, -side * spread, yy, -side * (.98 + i * .05), .8 - i * .025);
      drawLeaf(ctx, side * (spread * .82), yy - 3, side * (.92 + i * .04), .73 - i * .025);
    }
    drawLeaf(ctx, side * 3, -38, side * .08, .82);

    ctx.restore();
  }

  function drawLeaf(ctx, x, y, rotation, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    const leaf = ctx.createRadialGradient(-2, -4, 2, 0, 0, 17);
    leaf.addColorStop(0, "#d6ff7b");
    leaf.addColorStop(.48, "#73b83e");
    leaf.addColorStop(1, "#2d6f2a");
    ctx.fillStyle = leaf;
    ctx.strokeStyle = "rgba(24,64,20,.72)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5.6, 13.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(236,255,176,.44)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 10);
    ctx.stroke();

    ctx.restore();
  }

  function drawWins(ctx, x, y, player) {
    ctx.save();
    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 4;
    ctx.font = "900 19px system-ui";
    ctx.textAlign = "center";
    const text = `Voitot: ${player.wins} / ${WINS_TO_MATCH}`;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawRoundAndMessage(ctx, state) {
    ctx.save();
    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.font = "800 18px system-ui";
    ctx.strokeText(`Kierros: ${state.round}`, 640, 145);
    ctx.fillText(`Kierros: ${state.round}`, 640, 145);

    ctx.fillStyle = "#fff";
    ctx.font = "900 26px system-ui";
    ctx.strokeText(state.msg, 640, 676);
    ctx.fillText(state.msg, 640, 676);
    ctx.restore();
  }

  function drawGameOver(ctx, state) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.68)";
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 8;
    ctx.textAlign = "center";
    ctx.font = "900 64px system-ui";

    const winner = state.players[0].wins >= WINS_TO_MATCH ? "SINÄ voitit!" : `${state.players[1].name} voitti!`;
    ctx.strokeText(winner, VIEWPORT.width / 2, VIEWPORT.height / 2 - 10);
    ctx.fillText(winner, VIEWPORT.width / 2, VIEWPORT.height / 2 - 10);

    ctx.font = "700 24px system-ui";
    const restartText = "Klikkaa tai paina välilyöntiä aloittaaksesi uudestaan.";
    ctx.strokeText(restartText, VIEWPORT.width / 2, VIEWPORT.height / 2 + 42);
    ctx.fillText(restartText, VIEWPORT.width / 2, VIEWPORT.height / 2 + 42);
    ctx.restore();
  }

  SaunaTim.render.hud = {
    drawHud,
    drawHudTopLayer
  };
})(window.SaunaTim = window.SaunaTim || {});
