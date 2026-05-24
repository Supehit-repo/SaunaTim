(function (SaunaTim) {
  const { AIM } = SaunaTim.config;
  const { randomBetween } = SaunaTim.utils;

  function addFloatingText(state, text, x, y) {
    state.texts.push({ text, x, y, life: 75, max: 75 });
  }

  function addSteam(state, score) {
    const particleCount = Math.max(18, Math.round(score * .7));

    for (let i = 0; i < particleCount; i++) {
      state.particles.push({
        x: AIM.x + randomBetween(-85, 85),
        y: AIM.y + randomBetween(-50, 45),
        vx: randomBetween(-1.4, 1.4),
        vy: randomBetween(-4.6, -1.1),
        r: randomBetween(4, 13),
        life: randomBetween(60, 110),
        max: 110,
        kind: "steam"
      });
    }
  }

  function updateEffects(state) {
    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy -= .012;
      particle.r *= 1.004;
      particle.life--;
    });
    state.particles = state.particles.filter((particle) => particle.life > 0);

    state.texts.forEach((text) => {
      text.y -= .65;
      text.life--;
    });
    state.texts = state.texts.filter((text) => text.life > 0);
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.effects = {
    addFloatingText,
    addSteam,
    updateEffects
  };
})(window.SaunaTim = window.SaunaTim || {});
