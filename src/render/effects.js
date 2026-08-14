(function (SaunaTim) {
  let bodySteamMistSprite = null;

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
    const stretch = particle.stretch || 1.08;
    const sway = Math.sin(seed + age * 5.2) * particle.r * .55;
    const mistSprite = getBodySteamMistSprite();
    const width = particle.r * (3.2 + age * .75);
    const height = width * (1.65 + stretch * .2);

    ctx.globalAlpha = alpha * .36;
    ctx.drawImage(mistSprite, particle.x + sway - width / 2, particle.y - height * .62, width, height);
  }

  function getBodySteamMistSprite() {
    if (bodySteamMistSprite) return bodySteamMistSprite;

    const size = 96;
    const center = size / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const spriteCtx = canvas.getContext("2d");

    [
      { x: center, y: center, radius: 42, alpha: .34 },
      { x: center - 13, y: center + 6, radius: 34, alpha: .2 },
      { x: center + 14, y: center - 7, radius: 31, alpha: .18 },
      { x: center + 1, y: center - 18, radius: 28, alpha: .13 }
    ].forEach((puff) => {
      const gradient = spriteCtx.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.radius);
      gradient.addColorStop(0, `rgba(255,255,255,${puff.alpha})`);
      gradient.addColorStop(.34, `rgba(241,247,250,${puff.alpha * .58})`);
      gradient.addColorStop(1, "rgba(241,247,250,0)");
      spriteCtx.fillStyle = gradient;
      spriteCtx.beginPath();
      spriteCtx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
      spriteCtx.fill();
    });

    bodySteamMistSprite = canvas;
    return bodySteamMistSprite;
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
