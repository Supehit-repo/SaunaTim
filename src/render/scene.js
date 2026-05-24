(function (SaunaTim) {
  const { VIEWPORT } = SaunaTim.config;
  const { drawHeatOverlay } = SaunaTim.render.characters;
  const { drawEffects } = SaunaTim.render.effects;
  const { drawHud } = SaunaTim.render.hud;
  const { drawProjectile } = SaunaTim.render.projectile;
  const { drawStove } = SaunaTim.render.stove;
  const { drawAimArc } = SaunaTim.render.trajectory;

  function drawScene(ctx, background, state, shotFromDrag) {
    ctx.clearRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    if (background.complete && background.naturalWidth > 0) {
      ctx.drawImage(background, 0, 0, VIEWPORT.width, VIEWPORT.height);
    } else {
      ctx.fillStyle = "#2b180d";
      ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    }

    drawStove(ctx);
    drawHeatOverlay(ctx, state.players);
    drawAimArc(ctx, state, shotFromDrag);
    drawProjectile(ctx, state.projectile);
    drawEffects(ctx, state);
    drawHud(ctx, state);
  }

  SaunaTim.render.scene = {
    drawScene
  };
})(window.SaunaTim = window.SaunaTim || {});
