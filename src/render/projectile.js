(function (SaunaTim) {
  const { circle } = SaunaTim.render.primitives;

  function drawProjectile(ctx, projectile) {
    if (!projectile) return;

    ctx.save();
    ctx.fillStyle = "#69d4ff";
    ctx.strokeStyle = "#103849";
    ctx.lineWidth = 3;
    circle(ctx, projectile.x, projectile.y, 13, true, true);
    ctx.restore();
  }

  SaunaTim.render.projectile = {
    drawProjectile
  };
})(window.SaunaTim = window.SaunaTim || {});
