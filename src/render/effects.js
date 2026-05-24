(function (SaunaTim) {
  function drawEffects(ctx, state) {
    state.particles.forEach((particle) => {
      ctx.globalAlpha = particle.life / particle.max;
      ctx.fillStyle = "#eef4f7";
      ctx.beginPath();
      ctx.ellipse(particle.x, particle.y, particle.r, particle.r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
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
