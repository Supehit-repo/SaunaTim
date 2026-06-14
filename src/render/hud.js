(function (SaunaTim) {
  const { MAX_HP, VIEWPORT, WINS_TO_MATCH } = SaunaTim.config;
  const { roundedRect } = SaunaTim.render.primitives;

  function drawHud(ctx, state) {
    drawHeartBox(ctx, 126, 43, 318, 52, state.players[0]);
    drawHeartBox(ctx, 836, 43, 318, 52, state.players[1]);
    drawTagline(ctx);
    drawWins(ctx, 285, 119, state.players[0]);
    drawWins(ctx, 995, 119, state.players[1]);
    drawRoundAndMessage(ctx, state);
    drawScoreFlash(ctx, state);
    if (state.gameOver) drawGameOver(ctx, state);
  }

  function drawHeartBox(ctx, x, y, width, height, player) {
    const remaining = MAX_HP - player.hp;
    const heat = player.hp / MAX_HP;
    const pulse = player.heartPulse > 0 ? Math.sin(player.heartPulse * .52) * player.heartPulse / 44 : 0;
    const scale = 1 + Math.max(0, pulse);

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

    ctx.translate(x + width / 2 + 60, y + 29);
    ctx.scale(scale, scale);
    drawHeart(ctx, 0, 0, 15 + heat * 3);

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

  function drawTagline(ctx) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,.82)";
    ctx.lineWidth = 3;
    ctx.font = "800 15px system-ui";
    ctx.textAlign = "center";
    const text = "Heitä vettä kiukaalle ja paahda vastustaja!";
    ctx.strokeText(text, 640, 78);
    ctx.fillText(text, 640, 78);
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

  function drawScoreFlash(ctx, state) {
    if (state.scoreFlash <= 0 || !state.lastScoreText) return;

    ctx.save();
    ctx.globalAlpha = Math.min(1, state.scoreFlash / 25);
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.strokeStyle = "#d9964d";
    ctx.lineWidth = 4;
    roundedRect(ctx, 420, 245, 440, 62, 14, true, true);

    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 5;
    ctx.font = "900 31px system-ui";
    ctx.textAlign = "center";
    ctx.strokeText(state.lastScoreText, 640, 286);
    ctx.fillText(state.lastScoreText, 640, 286);
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

    const winner = state.players[0].wins >= WINS_TO_MATCH ? "SINÄ voitit!" : "IVAN voitti!";
    ctx.strokeText(winner, VIEWPORT.width / 2, VIEWPORT.height / 2 - 10);
    ctx.fillText(winner, VIEWPORT.width / 2, VIEWPORT.height / 2 - 10);

    ctx.font = "700 24px system-ui";
    const restartText = "Klikkaa tai paina välilyöntiä aloittaaksesi uudestaan.";
    ctx.strokeText(restartText, VIEWPORT.width / 2, VIEWPORT.height / 2 + 42);
    ctx.fillText(restartText, VIEWPORT.width / 2, VIEWPORT.height / 2 + 42);
    ctx.restore();
  }

  SaunaTim.render.hud = {
    drawHud
  };
})(window.SaunaTim = window.SaunaTim || {});
