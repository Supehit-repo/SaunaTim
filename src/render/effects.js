(function (SaunaTim) {
  function drawEffects(ctx, state) {
    state.particles.forEach((particle) => {
      const alpha = particle.life / particle.max;
      ctx.globalAlpha = alpha;
      if (particle.kind === "confetti") {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.r * .7, -particle.r * .34, particle.r * 1.4, particle.r * .68);
        ctx.restore();
      } else if (particle.kind === "spark") {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.r * .7, particle.r * 1.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.kind === "bodySteam") {
        drawBodySteam(ctx, particle, alpha);
      } else {
        ctx.fillStyle = "#eef4f7";
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.r, particle.r * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }

  function drawBodySteam(ctx, particle, alpha) {
    const age = 1 - alpha;
    const seed = particle.seed || 0;
    const stretch = particle.stretch || 1;
    const sway = Math.sin(seed + age * 7.4) * particle.r * .62;
    const baseX = particle.x + sway;
    const baseY = particle.y;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 4; i++) {
      const t = i / 3;
      const puffX = baseX + Math.sin(seed * 1.7 + age * 8 + i) * particle.r * .86;
      const puffY = baseY - particle.r * (i * .76 + age * 2.05);
      const radius = particle.r * (1.12 + i * .3 + age * .78);
      const gradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, radius * 1.72);
      gradient.addColorStop(0, `rgba(255,255,255,${alpha * (.2 - t * .035)})`);
      gradient.addColorStop(.36, `rgba(241,247,250,${alpha * (.13 - t * .018)})`);
      gradient.addColorStop(1, "rgba(241,247,250,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(puffX, puffY, radius * 1.05, radius * (1.55 + stretch * .28), Math.sin(seed + i) * .18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawFloatingTexts(ctx, state) {
    state.texts.forEach((floatingText) => {
      ctx.globalAlpha = floatingText.life / floatingText.max;
      ctx.font = "900 52px system-ui";
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,.85)";
      ctx.lineWidth = 8;
      ctx.strokeText(floatingText.text, floatingText.x, floatingText.y);
      ctx.fillStyle = "#fff1a8";
      ctx.fillText(floatingText.text, floatingText.x, floatingText.y);
    });
    ctx.globalAlpha = 1;
  }

  SaunaTim.render.effects = {
    drawEffects,
    drawFloatingTexts
  };
})(window.SaunaTim = window.SaunaTim || {});
