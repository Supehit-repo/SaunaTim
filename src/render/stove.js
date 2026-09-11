(function (SaunaTim) {
  const HEAT = {
    x: 640,
    y: 558,
    width: 118,
    height: 38
  };

  function drawStoveHeatEffect(ctx, state) {
    drawElectricHeaterGlow(ctx, state || {});
  }

  function drawElectricHeaterGlow(ctx, state) {
    const phase = state.phase || 0;
    const boost = Math.max(0, Math.min(1, (state.fireBoost || 0) / 160));
    const pulse = .72 + Math.sin(phase * 2.1) * .08 + Math.sin(phase * 4.8) * .04;
    const intensity = (.7 + boost * .35) * pulse;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const glow = ctx.createRadialGradient(HEAT.x, HEAT.y, 4, HEAT.x, HEAT.y, HEAT.width * .62);
    glow.addColorStop(0, `rgba(255, 166, 42, ${.16 * intensity})`);
    glow.addColorStop(.45, `rgba(255, 74, 28, ${.09 * intensity})`);
    glow.addColorStop(1, "rgba(255, 74, 28, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(HEAT.x, HEAT.y, HEAT.width * .62, HEAT.height, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 207, 96, ${.08 * intensity})`;
    ctx.fillRect(HEAT.x - 45, HEAT.y - 7, 90, 14);

    ctx.restore();
  }

  SaunaTim.render.stove = {
    drawStoveHeatEffect
  };
})(window.SaunaTim = window.SaunaTim || {});
