(function (SaunaTim) {
  const { MAX_HP, VIEWPORT, WINS_TO_MATCH } = SaunaTim.config;
  const { roundedRect } = SaunaTim.render.primitives;

  function drawHud(ctx, state) {
    drawHpBox(ctx, 126, 43, 318, 52, state.players[0]);
    drawHpBox(ctx, 836, 43, 318, 52, state.players[1]);
    drawTagline(ctx);
    drawWins(ctx, 285, 119, state.players[0]);
    drawWins(ctx, 995, 119, state.players[1]);
    drawRoundAndMessage(ctx, state);
    drawScoreFlash(ctx, state);
    if (state.gameOver) drawGameOver(ctx, state);
  }

  function drawHpBox(ctx, x, y, width, height, player) {
    const remaining = MAX_HP - player.hp;
    ctx.save();
    ctx.fillStyle = "#23120b";
    ctx.strokeStyle = "#d9964d";
    ctx.lineWidth = 4;
    roundedRect(ctx, x, y, width, height, 11, true, true);

    ctx.fillStyle = "#120c09";
    roundedRect(ctx, x + 8, y + 9, width - 16, height - 18, 8, true, false);

    ctx.fillStyle = "#e4433c";
    roundedRect(ctx, x + 8, y + 9, (width - 16) * (remaining / MAX_HP), height - 18, 8, true, false);

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 5;
    ctx.font = "900 25px system-ui";
    ctx.textAlign = "center";
    ctx.strokeText(`${remaining} / ${MAX_HP} HP`, x + width / 2, y + 35);
    ctx.fillText(`${remaining} / ${MAX_HP} HP`, x + width / 2, y + 35);
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
    roundedRect(ctx, 490, 245, 300, 62, 14, true, true);

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
