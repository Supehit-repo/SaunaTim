(function (SaunaTim) {
  const { VIEWPORT } = SaunaTim.config;
  const { drawBackgroundCleanup } = SaunaTim.render.backgroundCleanup;
  const { drawSkinRedness } = SaunaTim.render.characters;
  const { drawEffects } = SaunaTim.render.effects;
  const { drawHud } = SaunaTim.render.hud;
  const { drawProjectile } = SaunaTim.render.projectile;
  const { drawProps } = SaunaTim.render.props;
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

    drawBackgroundCleanup(ctx);
    drawProps(ctx);
    drawStove(ctx);
    drawSkinRedness(ctx, state.players);
    drawAimArc(ctx, state, shotFromDrag);
    drawProjectile(ctx, state.projectile);
    drawEffects(ctx, state);
    drawHud(ctx, state);
  }

  SaunaTim.render.scene = {
    drawScene
  };
})(window.SaunaTim = window.SaunaTim || {});
