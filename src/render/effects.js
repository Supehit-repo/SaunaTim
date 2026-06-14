(function (SaunaTim) {
  function drawEffects(ctx, state) {
    state.particles.forEach((particle) => {
      ctx.globalAlpha = particle.life / particle.max;
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
      } else {
        ctx.fillStyle = "#eef4f7";
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.r, particle.r * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

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
    drawEffects
  };
})(window.SaunaTim = window.SaunaTim || {});
