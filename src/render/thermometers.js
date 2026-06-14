(function (SaunaTim) {
  const { MAX_HP, TEMPERATURE } = SaunaTim.config;
  const { roundedRect } = SaunaTim.render.primitives;

  function drawThermometers(ctx, state) {
    const temperature = currentTemperature(state);
    drawThermometer(ctx, 170, 154, temperature);
    drawThermometer(ctx, 1090, 154, temperature);
  }

  function currentTemperature(state) {
    const hottest = Math.max(...state.players.map((player) => player.hp));
    return Math.round(TEMPERATURE.base + (TEMPERATURE.max - TEMPERATURE.base) * hottest / MAX_HP);
  }

  function drawThermometer(ctx, x, y, temperature) {
    const fill = (temperature - TEMPERATURE.base) / (TEMPERATURE.max - TEMPERATURE.base);
    const clampedFill = Math.max(0, Math.min(1, fill));

    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "rgba(34, 17, 7, .9)";
    ctx.strokeStyle = "rgba(12, 6, 3, .85)";
    ctx.lineWidth = 2;
    roundedRect(ctx, -28, -8, 56, 116, 8, true, true);

    ctx.fillStyle = "#8a4b20";
    roundedRect(ctx, -19, 1, 38, 98, 7, true, false);

    ctx.strokeStyle = "rgba(255, 218, 132, .42)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const yy = 12 + i * 16;
      ctx.beginPath();
      ctx.moveTo(7, yy);
      ctx.lineTo(16, yy);
      ctx.stroke();
    }

    ctx.fillStyle = "#2a160b";
    roundedRect(ctx, -5, 11, 10, 66, 5, true, false);

    const mercuryHeight = 10 + clampedFill * 56;
    const mercury = ctx.createLinearGradient(0, 76 - mercuryHeight, 0, 78);
    mercury.addColorStop(0, "#ffef6c");
    mercury.addColorStop(.45, "#ff7b23");
    mercury.addColorStop(1, "#d8211b");
    ctx.fillStyle = mercury;
    roundedRect(ctx, -4, 77 - mercuryHeight, 8, mercuryHeight, 4, true, false);

    ctx.beginPath();
    ctx.arc(0, 83, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff1a8";
    ctx.strokeStyle = "rgba(0,0,0,.8)";
    ctx.lineWidth = 3;
    ctx.font = "900 17px system-ui";
    ctx.textAlign = "center";
    ctx.strokeText(`${temperature}°`, 0, 123);
    ctx.fillText(`${temperature}°`, 0, 123);

    ctx.restore();
  }

  SaunaTim.render.thermometers = {
    drawThermometers
  };
})(window.SaunaTim = window.SaunaTim || {});
