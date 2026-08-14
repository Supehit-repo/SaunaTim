(function (SaunaTim) {
  const { roundedRect } = SaunaTim.render.primitives;
  const STOVE_CACHE = { x: 500, y: 354, width: 280, height: 240 };
  const STONES_CACHE = { x: 510, y: 334, width: 260, height: 108 };
  let stoveStaticSprite = null;
  let hdStoneSprite = null;

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
    ctx.drawImage(getHdStoneSprite(), STONES_CACHE.x, STONES_CACHE.y);
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

    ctx.fillStyle = "rgba(10, 11, 13, .78)";
    roundedRect(ctx, 522, 374, 236, 62, 22, true, false);
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

  function getHdStoneSprite() {
    if (hdStoneSprite) return hdStoneSprite;

    const canvas = document.createElement("canvas");
    canvas.width = STONES_CACHE.width;
    canvas.height = STONES_CACHE.height;
    const ctx = canvas.getContext("2d");
    ctx.translate(-STONES_CACHE.x, -STONES_CACHE.y);
    drawHdStones(ctx);
    hdStoneSprite = canvas;
    return hdStoneSprite;
  }

  function drawHdStones(ctx) {
    const stones = [
      [540, 386, 31, 19, -.38, "#4f555c", "#24282e"],
      [570, 374, 30, 19, .26, "#343941", "#181b20"],
      [604, 370, 36, 22, -.12, "#5f646b", "#2d3138"],
      [641, 367, 39, 23, .18, "#3d4249", "#171a1f"],
      [681, 370, 34, 21, -.28, "#565b63", "#282c33"],
      [714, 379, 32, 19, .35, "#333941", "#171a1f"],
      [743, 390, 29, 18, -.18, "#62666d", "#2a2e34"],
      [553, 411, 34, 20, .2, "#666b72", "#2c3138"],
      [588, 404, 37, 21, -.32, "#41474f", "#1b1f25"],
      [626, 400, 39, 23, .22, "#6c7077", "#30343b"],
      [666, 402, 38, 23, -.16, "#3b4149", "#171a1f"],
      [705, 409, 36, 21, .3, "#656970", "#2b3037"],
      [737, 419, 31, 19, -.24, "#444a52", "#1d2127"]
    ];

    for (let i = 0; i < stones.length; i++) {
      const stone = stones[i];
      drawHdStone(ctx, stone, i);
    }
  }

  function drawHdStone(ctx, stone, index) {
    const [x, y, rx, ry, rotation, light, dark] = stone;
    const points = makeStonePoints(x, y, rx, ry, rotation, index);

    ctx.save();
    ctx.lineJoin = "round";

    const shade = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
    shade.addColorStop(0, light);
    shade.addColorStop(.54, "#3f454d");
    shade.addColorStop(1, dark);

    ctx.fillStyle = shade;
    ctx.strokeStyle = "#121418";
    ctx.lineWidth = 2.2;
    drawPolygon(ctx, points);
    ctx.fill();
    ctx.stroke();

    drawStoneFacet(ctx, points, "rgba(255,255,255,.13)", 0, 1, 2, 3);
    drawStoneFacet(ctx, points, "rgba(0,0,0,.18)", 4, 5, 6, 7);

    ctx.strokeStyle = "rgba(12,14,18,.38)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(points[1].x, points[1].y);
    ctx.lineTo(x + rx * .08, y + ry * .04);
    ctx.lineTo(points[5].x, points[5].y);
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(x - rx * .12, y - ry * .1);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.stroke();

    drawMineralSpeckles(ctx, x, y, rx, ry, rotation, index);
    ctx.restore();
  }

  function makeStonePoints(x, y, rx, ry, rotation, index) {
    const irregularity = [
      [.82, .92], [1.02, .78], [1.12, .88], [1.0, 1.06],
      [.76, 1.05], [.94, 1.16], [1.1, 1.02], [.9, .86]
    ];
    const points = [];

    for (let i = 0; i < 8; i++) {
      const angle = -Math.PI * .82 + i * Math.PI * .25 + (index % 3 - 1) * .035;
      const scale = irregularity[(i + index) % irregularity.length];
      const px = Math.cos(angle) * rx * scale[0];
      const py = Math.sin(angle) * ry * scale[1];
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      points.push({
        x: x + px * cos - py * sin,
        y: y + px * sin + py * cos
      });
    }

    return points;
  }

  function drawPolygon(ctx, points) {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
  }

  function drawStoneFacet(ctx, points, color, a, b, c, d) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[a].x, points[a].y);
    ctx.lineTo(points[b].x, points[b].y);
    ctx.lineTo(points[c].x, points[c].y);
    ctx.lineTo(points[d].x, points[d].y);
    ctx.closePath();
    ctx.fill();
  }

  function drawMineralSpeckles(ctx, x, y, rx, ry, rotation, index) {
    const seed = index * 19 + 7;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    for (let i = 0; i < 7; i++) {
      const n1 = pseudoRandom(seed + i * 3);
      const n2 = pseudoRandom(seed + i * 3 + 1);
      const localX = (n1 - .5) * rx * 1.35;
      const localY = (n2 - .5) * ry * 1.05;

      if ((localX * localX) / (rx * rx) + (localY * localY) / (ry * ry) > .82) continue;

      const px = x + localX * cos - localY * sin;
      const py = y + localX * sin + localY * cos;
      ctx.fillStyle = i % 3 === 0 ? "rgba(214,220,218,.28)" : "rgba(22,24,28,.32)";
      ctx.beginPath();
      ctx.ellipse(px, py, 1.1 + pseudoRandom(seed + i) * 1.5, .7, rotation, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function pseudoRandom(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  SaunaTim.render.stove = {
    drawStove,
    drawStoveTopLayer
  };
})(window.SaunaTim = window.SaunaTim || {});
