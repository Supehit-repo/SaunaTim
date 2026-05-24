(function (SaunaTim) {
  const { circle } = SaunaTim.render.primitives;

  function drawProjectile(ctx, projectile) {
    if (!projectile) return;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.65)";
    projectile.trail.forEach((point, index) => {
      circle(ctx, point.x, point.y, 3 + index * .08, true, false);
    });
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
