(function (SaunaTim) {
  function drawBackgroundCleanup(ctx) {
    removeTagline(ctx);
    removeSteamIcons(ctx);
    removeRoundSign(ctx);
    softenCatapultHardware(ctx);
    removeTurnTimer(ctx);
    replaceInstructionText(ctx);
  }

  function clonePatch(ctx, source, target, alpha) {
    const patch = document.createElement("canvas");
    patch.width = source.w;
    patch.height = source.h;
    patch.getContext("2d").drawImage(
      ctx.canvas,
      source.x,
      source.y,
      source.w,
      source.h,
      0,
      0,
      source.w,
      source.h
    );

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(patch, target.x, target.y, target.w, target.h);
    ctx.restore();
  }

  function woodPatch(ctx, x, y, width, height, top, bottom, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "rgba(18, 8, 4, .55)";
    ctx.lineWidth = 1;
    for (let yy = y + 11; yy < y + height; yy += 24) {
      ctx.beginPath();
      ctx.moveTo(x, yy);
      ctx.lineTo(x + width, yy + .8);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(126, 67, 29, .26)";
    for (let yy = y + 16; yy < y + height; yy += 24) {
      ctx.beginPath();
      ctx.moveTo(x, yy);
      ctx.lineTo(x + width, yy + .6);
      ctx.stroke();
    }

    ctx.restore();
  }

  function benchPatch(ctx, points) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();

    const top = Math.min(...points.map((point) => point.y));
    const bottom = Math.max(...points.map((point) => point.y));
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, "#9b5a24");
    gradient.addColorStop(.55, "#713814");
    gradient.addColorStop(1, "#3d1d0d");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.clip();
    ctx.strokeStyle = "rgba(29, 12, 4, .54)";
    ctx.lineWidth = 1.2;
    for (let x = Math.min(...points.map((point) => point.x)) + 16; x < Math.max(...points.map((point) => point.x)); x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, top - 8);
      ctx.lineTo(x + 16, bottom + 12);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(243, 151, 62, .14)";
    ctx.beginPath();
    ctx.moveTo(points[0].x + 4, points[0].y + 4);
    ctx.lineTo(points[1].x - 4, points[1].y + 4);
    ctx.stroke();
    ctx.restore();
  }

  function removeTagline(ctx) {
    woodPatch(ctx, 410, 63, 460, 30, "#130904", "#241107", 1);
  }

  function removeSteamIcons(ctx) {
    woodPatch(ctx, 138, 100, 122, 34, "#261208", "#3f1f0d", 1);
    woodPatch(ctx, 1020, 100, 122, 34, "#261208", "#3f1f0d", 1);
  }

  function removeRoundSign(ctx) {
    clonePatch(ctx, { x: 760, y: 92, w: 132, h: 22 }, { x: 574, y: 92, w: 132, h: 22 }, 1);
    clonePatch(ctx, { x: 760, y: 102, w: 220, h: 70 }, { x: 530, y: 102, w: 220, h: 70 }, 1);
    woodPatch(ctx, 530, 102, 220, 70, "rgba(47, 22, 9, .22)", "rgba(83, 39, 17, .2)", 1);
  }

  function softenCatapultHardware(ctx) {
    clonePatch(ctx, { x: 360, y: 383, w: 64, h: 74 }, { x: 288, y: 383, w: 64, h: 74 }, .78);
    clonePatch(ctx, { x: 840, y: 383, w: 64, h: 74 }, { x: 930, y: 383, w: 64, h: 74 }, .78);

    benchPatch(ctx, [
      { x: 264, y: 456 },
      { x: 352, y: 454 },
      { x: 354, y: 486 },
      { x: 258, y: 487 }
    ]);
    benchPatch(ctx, [
      { x: 910, y: 456 },
      { x: 1015, y: 454 },
      { x: 1018, y: 486 },
      { x: 904, y: 487 }
    ]);
  }

  function removeTurnTimer(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(505, 592);
    ctx.lineTo(780, 592);
    ctx.lineTo(780, 694);
    ctx.lineTo(496, 694);
    ctx.closePath();
    ctx.clip();

    const gradient = ctx.createLinearGradient(0, 592, 0, 694);
    gradient.addColorStop(0, "#3f1f0d");
    gradient.addColorStop(1, "#201006");
    ctx.fillStyle = gradient;
    ctx.fillRect(496, 592, 288, 102);

    ctx.strokeStyle = "rgba(125, 69, 30, .24)";
    ctx.lineWidth = 2;
    for (let x = 520; x < 780; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, 592);
      ctx.lineTo(x - 25, 694);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(10, 5, 2, .42)";
    ctx.lineWidth = 1;
    for (let y = 610; y < 694; y += 28) {
      ctx.beginPath();
      ctx.moveTo(496, y);
      ctx.lineTo(784, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function replaceInstructionText(ctx) {
    ctx.save();
    ctx.fillStyle = "#110d0a";
    ctx.fillRect(96, 602, 202, 34);

    ctx.fillStyle = "#fff";
    ctx.font = "700 18px system-ui";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Vesi lentää kauhasta", 100, 619);
    ctx.restore();
  }

  SaunaTim.render.backgroundCleanup = {
    drawBackgroundCleanup
  };
})(window.SaunaTim = window.SaunaTim || {});
