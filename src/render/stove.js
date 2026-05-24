(function (SaunaTim) {
  const { roundedRect } = SaunaTim.render.primitives;

  function drawStove(ctx) {
    ctx.save();

    const x = 515;
    const y = 390;
    const width = 250;
    const height = 200;
    const bodyGradient = ctx.createLinearGradient(x, y, x, y + height);
    bodyGradient.addColorStop(0, "rgba(54,56,61,.99)");
    bodyGradient.addColorStop(.55, "rgba(38,40,45,.99)");
    bodyGradient.addColorStop(1, "rgba(21,22,26,.99)");

    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = "rgba(5,5,6,.96)";
    ctx.lineWidth = 4;
    roundedRect(ctx, x, y, width, height, 8, true, true);

    ctx.fillStyle = "rgba(0,0,0,.18)";
    ctx.fillRect(x + 8, y + 10, 15, height - 20);
    ctx.fillRect(x + width - 23, y + 10, 15, height - 20);

    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      const lineY = y + i * 38;
      ctx.beginPath();
      ctx.moveTo(x + 16, lineY);
      ctx.lineTo(x + width - 16, lineY);
      ctx.stroke();
    }

    ctx.fillStyle = "#111";
    roundedRect(ctx, 565, 515, 150, 65, 8, true, false);

    const fire = ctx.createRadialGradient(640, 552, 4, 640, 552, 58);
    fire.addColorStop(0, "#fff36c");
    fire.addColorStop(.42, "#ff8a20");
    fire.addColorStop(1, "#861711");
    ctx.fillStyle = fire;
    roundedRect(ctx, 582, 528, 116, 42, 5, true, false);

    ctx.strokeStyle = "rgba(0,0,0,.48)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(590 + i * 15, 568);
      ctx.lineTo(596 + i * 13, 532 + Math.sin(i) * 4);
      ctx.stroke();
    }

    drawStones(ctx);
    ctx.restore();
  }

  function drawStones(ctx) {
    const stones = [
      [540, 382, 28, 17], [570, 372, 30, 18], [604, 367, 34, 20], [640, 365, 38, 22],
      [678, 368, 34, 20], [713, 376, 31, 18], [742, 388, 28, 17],
      [555, 406, 31, 18], [592, 400, 35, 20], [628, 395, 36, 21], [665, 397, 36, 21],
      [703, 404, 33, 19], [735, 416, 29, 17]
    ];

    for (let i = 0; i < stones.length; i++) {
      const stone = stones[i];
      ctx.fillStyle = ["#4d5056", "#393c42", "#676970"][i % 3];
      ctx.strokeStyle = "#17181a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(stone[0], stone[1], stone[2], stone[3], Math.sin(i) * .35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  SaunaTim.render.stove = {
    drawStove
  };
})(window.SaunaTim = window.SaunaTim || {});
