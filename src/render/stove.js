(function (SaunaTim) {
  const { roundedRect } = SaunaTim.render.primitives;
  const STOVE_CACHE = { x: 500, y: 354, width: 280, height: 240 };
  let stoveStaticSprite = null;

  function drawStove(ctx, state) {
    ctx.save();
    ctx.drawImage(getStoveStaticSprite(), STOVE_CACHE.x, STOVE_CACHE.y);

    const fireBoost = state ? state.fireBoost / 160 : 0;
    ctx.fillStyle = fireBoost > .2 ? "#c43a15" : "#8f1711";
    roundedRect(ctx, 582, 528, 116, 42, 5, true, false);
    ctx.fillStyle = fireBoost > .2 ? "rgba(255, 213, 69, .48)" : "rgba(255, 120, 32, .36)";
    roundedRect(ctx, 602, 538, 76, 24, 12, true, false);

    drawFlames(ctx, fireBoost);
    drawFirewood(ctx);
    drawFireGrate(ctx);

    ctx.restore();
  }

  function drawStoveTopLayer(ctx) {
    ctx.save();
    drawStones(ctx);
    ctx.restore();
  }

  function getStoveStaticSprite() {
    if (stoveStaticSprite) return stoveStaticSprite;

    const canvas = document.createElement("canvas");
    canvas.width = STOVE_CACHE.width;
    canvas.height = STOVE_CACHE.height;
    const ctx = canvas.getContext("2d");
    ctx.translate(-STOVE_CACHE.x, -STOVE_CACHE.y);
    drawStoveStatic(ctx);
    stoveStaticSprite = canvas;
    return stoveStaticSprite;
  }

  function drawStoveStatic(ctx) {
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

    drawStones(ctx);
  }

  function drawFlames(ctx, fireBoost) {
    const boost = Math.max(0, Math.min(1, fireBoost));
    const flames = [
      [606, 565, 22, 36, "#ffdd47"],
      [633, 568, 28, 46, "#ff7725"],
      [662, 565, 24, 40, "#ffec7a"],
      [685, 566, 19, 34, "#ff5a1e"]
    ];

    flames.forEach((flame, index) => {
      const flicker = Math.sin(Date.now() * .009 + index * 1.8) * 4;
      const height = flame[3] + boost * 28 + flicker;
      ctx.fillStyle = flame[4];
      ctx.beginPath();
      ctx.moveTo(flame[0], flame[1] - height);
      ctx.bezierCurveTo(
        flame[0] - flame[2],
        flame[1] - height * .55,
        flame[0] - flame[2] * .45,
        flame[1] - height * .16,
        flame[0],
        flame[1]
      );
      ctx.bezierCurveTo(
        flame[0] + flame[2] * .52,
        flame[1] - height * .18,
        flame[0] + flame[2],
        flame[1] - height * .56,
        flame[0],
        flame[1] - height
      );
      ctx.fill();
    });
  }

  function drawFirewood(ctx) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#5f2f13";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(596, 562);
    ctx.lineTo(638, 535);
    ctx.moveTo(623, 566);
    ctx.lineTo(682, 536);
    ctx.stroke();

    ctx.strokeStyle = "#2a1308";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(596, 562);
    ctx.lineTo(638, 535);
    ctx.moveTo(623, 566);
    ctx.lineTo(682, 536);
    ctx.stroke();

    ctx.fillStyle = "#c98945";
    ctx.beginPath();
    ctx.ellipse(596, 562, 7, 5, -.55, 0, Math.PI * 2);
    ctx.ellipse(623, 566, 7, 5, -.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFireGrate(ctx) {
    ctx.strokeStyle = "rgba(0,0,0,.48)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(590 + i * 15, 568);
      ctx.lineTo(596 + i * 13, 532 + Math.sin(i) * 4);
      ctx.stroke();
    }
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
    drawStove,
    drawStoveTopLayer
  };
})(window.SaunaTim = window.SaunaTim || {});
