(function (SaunaTim) {
  const { LAUNCH_POINTS } = SaunaTim.config;
  const SWING_DURATION = 36;
  const LADLE_POSES = [
    {
      handX: 200,
      handY: 438,
      launch: LAUNCH_POINTS.player,
      side: 1
    },
    {
      handX: 1078,
      handY: 438,
      launch: LAUNCH_POINTS.npc,
      side: -1
    }
  ];

  function drawProps(ctx, state) {
    if (SaunaTim.render.characters.isPlayerSpriteReady(state)) {
      drawLadleSplash(ctx, state, 0);
    } else {
      drawPlayerLadle(ctx, state, 0);
    }

    if (SaunaTim.render.characters.isOpponentSpriteReady(state)) {
      drawLadleSplash(ctx, state, 1);
    } else {
      drawPlayerLadle(ctx, state, 1);
    }
  }

  function drawLadleSplash(ctx, state, playerIndex) {
    const pose = LADLE_POSES[playerIndex];
    const swing = state.ladleSwing[playerIndex] || 0;
    const progress = Math.max(0, Math.min(1, (SWING_DURATION - swing) / SWING_DURATION));
    const motion = swing > 0 ? Math.sin(progress * Math.PI) : 0;

    drawBucketSplash(ctx, pose.launch.x, pose.launch.y, pose.side, motion);
  }

  function drawPlayerLadle(ctx, state, playerIndex) {
    const pose = LADLE_POSES[playerIndex];
    const swing = state.ladleSwing[playerIndex] || 0;
    const progress = Math.max(0, Math.min(1, (SWING_DURATION - swing) / SWING_DURATION));
    const motion = swing > 0 ? Math.sin(progress * Math.PI) : 0;
    const bowlX = pose.launch.x + pose.side * motion * 56;
    const bowlY = pose.launch.y - motion * 68;
    const rotation = -pose.side * (.2 + motion * .95);

    drawBucketSplash(ctx, pose.launch.x, pose.launch.y, pose.side, motion);
    drawHandLadle(ctx, pose.handX, pose.handY, bowlX, bowlY, rotation);
    drawHandGrip(ctx, pose.handX, pose.handY, bowlX, bowlY, pose.side);
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

  function drawHandGrip(ctx, handX, handY, bowlX, bowlY, side) {
    const angle = Math.atan2(bowlY - handY, bowlX - handX);

    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(angle);

    ctx.fillStyle = "#f3b184";
    ctx.strokeStyle = "rgba(76,35,18,.72)";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.ellipse(1, 0, 11, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#ffd1a9";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-6, i * 3.6);
      ctx.quadraticCurveTo(1, i * 4.4, 7, i * 2.8);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(76,35,18,.5)";
    ctx.lineWidth = 1.1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-7, i * 3.6);
      ctx.quadraticCurveTo(1, i * 4.4, 8, i * 2.8);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffd1a9";
    ctx.beginPath();
    ctx.ellipse(-4, -side * 8, 4.8, 7, -.4 * side, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBucketSplash(ctx, x, y, side, motion) {
    if (motion <= 0) return;

    ctx.save();
    ctx.globalAlpha = .35 + motion * .35;
    ctx.fillStyle = "#7bdfff";
    ctx.strokeStyle = "rgba(205,248,255,.72)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const dropX = x + side * (8 + t * 28) * motion;
      const dropY = y - 7 - Math.sin(t * Math.PI) * 16 * motion - i * 1.5;
      const size = 2.2 + (1 - t) * 2.2;
      ctx.beginPath();
      ctx.ellipse(dropX, dropY, size, size * 1.3, .35 * side, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(x - side * 6, y - 2);
    ctx.quadraticCurveTo(x + side * 18, y - 12 - motion * 18, x + side * 42 * motion, y - 16 - motion * 22);
    ctx.stroke();

    ctx.restore();
  }

  SaunaTim.render.props = {
    drawProps,
    SWING_DURATION
  };
})(window.SaunaTim = window.SaunaTim || {});
