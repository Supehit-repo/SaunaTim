(function (SaunaTim) {
  const { LAUNCH_POINTS, PHYSICS, VIEWPORT } = SaunaTim.config;

  function drawAimArc(ctx, state, shotFromDrag) {
    if (!state.dragging || !state.dragNow || state.turn !== 0) return;

    const shot = shotFromDrag();
    let x = LAUNCH_POINTS.player.x;
    let y = LAUNCH_POINTS.player.y;
    let vx = shot.vx;
    let vy = shot.vy;

    ctx.save();
    ctx.strokeStyle = "rgba(120, 220, 255, .9)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.setLineDash([8, 14]);
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 0; i < 62; i++) {
      x += vx;
      y += vy;
      vy += PHYSICS.gravity;
      ctx.lineTo(x, y);
      if (y > VIEWPORT.height) break;
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(255,255,255,.32)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  SaunaTim.render.trajectory = {
    drawAimArc
  };
})(window.SaunaTim = window.SaunaTim || {});
