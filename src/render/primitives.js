(function (SaunaTim) {
  function roundedRect(ctx, x, y, width, height, radius, fill = true, stroke = false) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function circle(ctx, x, y, radius, fill = true, stroke = false) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  SaunaTim.render = SaunaTim.render || {};
  SaunaTim.render.primitives = {
    circle,
    roundedRect
  };
})(window.SaunaTim = window.SaunaTim || {});
