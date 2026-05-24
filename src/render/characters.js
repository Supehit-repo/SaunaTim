(function (SaunaTim) {
  const { MAX_HP } = SaunaTim.config;
  const { circle } = SaunaTim.render.primitives;

  function drawHeatOverlay(ctx, players) {
    drawPlayerHeatOverlay(ctx, players, 0);
    drawPlayerHeatOverlay(ctx, players, 1);
  }

  function drawPlayerHeatOverlay(ctx, players, playerIndex) {
    const hp = players[playerIndex].hp;
    if (hp <= 0) return;

    const alpha = Math.min(.62, hp / MAX_HP * .62);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#e23b2e";

    if (playerIndex === 0) {
      ctx.beginPath();
      ctx.ellipse(120, 470, 55, 80, .15, 0, Math.PI * 2);
      ctx.ellipse(160, 545, 65, 75, -.4, 0, Math.PI * 2);
      ctx.fill();
      circle(ctx, 55, 58, 40, true, false);
    } else {
      ctx.beginPath();
      ctx.ellipse(1100, 468, 55, 80, -.15, 0, Math.PI * 2);
      ctx.ellipse(1068, 548, 70, 75, .35, 0, Math.PI * 2);
      ctx.fill();
      circle(ctx, 1222, 58, 40, true, false);
    }

    ctx.restore();
  }

  SaunaTim.render.characters = {
    drawHeatOverlay
  };
})(window.SaunaTim = window.SaunaTim || {});
