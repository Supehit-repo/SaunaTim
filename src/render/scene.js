(function (SaunaTim) {
  const { VIEWPORT } = SaunaTim.config;
  const { drawCharacterOverlays, drawSkinRedness } = SaunaTim.render.characters;
  const { drawEffects, drawFloatingTexts } = SaunaTim.render.effects;
  const { drawHud, drawHudTopLayer } = SaunaTim.render.hud;
  const { drawNallemehu } = SaunaTim.render.nallemehu;
  const { drawProjectile } = SaunaTim.render.projectile;
  const { drawProps } = SaunaTim.render.props;
  const { drawSponsors } = SaunaTim.render.sponsors;
  const { drawStove } = SaunaTim.render.stove;
  const { drawThermometers } = SaunaTim.render.thermometers;
  const { drawAimArc } = SaunaTim.render.trajectory;

  function drawScene(ctx, background, state, shotFromDrag) {
    ctx.clearRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    if (background.complete && background.naturalWidth > 0) {
      ctx.drawImage(background, 0, 0, VIEWPORT.width, VIEWPORT.height);
    } else {
      ctx.fillStyle = "#2b180d";
      ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    }

    drawSponsors(ctx, state);
    drawThermometers(ctx, state);
    drawCharacterOverlays(ctx, state);
    drawProps(ctx, state);
    drawStove(ctx, state);
    drawSkinRedness(ctx, state.players);
    drawAimArc(ctx, state, shotFromDrag);
    drawProjectile(ctx, state.projectile);
    drawEffects(ctx, state);
    drawHud(ctx, state);
    drawNallemehu(ctx, state);
    drawFloatingTexts(ctx, state);
    drawHudTopLayer(ctx, state);
  }

  SaunaTim.render.scene = {
    drawScene
  };
})(window.SaunaTim = window.SaunaTim || {});
