(function (SaunaTim) {
  const { MAX_HP, VIEWPORT } = SaunaTim.config;
  const { roundedRect } = SaunaTim.render.primitives;

  function drawHud(ctx, state) {
    drawHpBox(ctx, 126, 43, 318, 52, state.players[0]);
    drawHpBox(ctx, 836, 43, 318, 52, state.players[1]);
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
    ctx.strokeText(`${remaining} / 500 HP`, x + width / 2, y + 35);
    ctx.fillText(`${remaining} / 500 HP`, x + width / 2, y + 35);
    ctx.restore();
  }

  function drawRoundAndMessage(ctx, state) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 6;
    ctx.textAlign = "center";
    ctx.font = "900 46px system-ui";
    ctx.strokeText(state.round, 640, 170);
    ctx.fillText(state.round, 640, 170);

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

    const winner = state.players[0].hp >= MAX_HP ? "IVAN voitti!" : "SINÄ voitit!";
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
