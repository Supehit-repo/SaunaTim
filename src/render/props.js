(function (SaunaTim) {
  const SWING_DURATION = 36;

  function drawProps(ctx, state) {
    drawPlayerLadle(ctx, state, 0);
    drawPlayerLadle(ctx, state, 1);
  }

  function drawPlayerLadle(ctx, state, playerIndex) {
    const swing = state.ladleSwing[playerIndex] || 0;
    const progress = Math.max(0, Math.min(1, (SWING_DURATION - swing) / SWING_DURATION));
    const motion = swing > 0 ? Math.sin(progress * Math.PI) : 0;

    if (playerIndex === 0) {
      drawHandLadle(
        ctx,
        200,
        454,
        253 + motion * 48,
        419 - motion * 58,
        -0.36 - motion * .86
      );
      return;
    }

    drawHandLadle(
      ctx,
      1052,
      454,
      995 - motion * 48,
      419 - motion * 58,
      0.36 + motion * .86
    );
  }

  function drawHandLadle(ctx, handX, handY, bowlX, bowlY, rotation) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(31,15,7,.75)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(handX + 2, handY + 2);
    ctx.lineTo(bowlX + 2, bowlY + 2);
    ctx.stroke();

    ctx.strokeStyle = "#b97736";
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(bowlX, bowlY);
    ctx.stroke();

    ctx.translate(bowlX, bowlY);
    ctx.rotate(rotation);
    ctx.fillStyle = "#b46b31";
    ctx.strokeStyle = "#27140a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#7bdfff";
    ctx.beginPath();
    ctx.ellipse(0, -2, 12, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  SaunaTim.render.props = {
    drawProps,
    SWING_DURATION
  };
})(window.SaunaTim = window.SaunaTim || {});
