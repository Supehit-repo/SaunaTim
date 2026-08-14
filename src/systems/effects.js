(function (SaunaTim) {
  const { AIM, MAX_HP } = SaunaTim.config;
  const { randomBetween } = SaunaTim.utils;
  const MAX_PARTICLES = 180;

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

  function addFireBurst(state, score) {
    const particleCount = Math.max(12, Math.round(score * .35));

    for (let i = 0; i < particleCount; i++) {
      state.particles.push({
        x: AIM.x + randomBetween(-48, 48),
        y: 546 + randomBetween(-20, 22),
        vx: randomBetween(-.8, .8),
        vy: randomBetween(-2.8, -1),
        r: randomBetween(3, 7),
        life: randomBetween(35, 62),
        max: 62,
        color: Math.random() < .55 ? "#ffdd4a" : "#ff7124",
        kind: "spark"
      });
    }
  }

  function addConfetti(state, winnerIndex) {
    const originX = winnerIndex === 0 ? 335 : 945;
    const palette = ["#ffef6c", "#ff5b4a", "#69d4ff", "#7fd35a", "#ffffff"];

    for (let i = 0; i < 56; i++) {
      state.particles.push({
        x: originX + randomBetween(-80, 80),
        y: 190 + randomBetween(-24, 24),
        vx: randomBetween(-2.8, 2.8),
        vy: randomBetween(-4.8, -1.3),
        r: randomBetween(4, 8),
        rotation: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-.16, .16),
        color: palette[i % palette.length],
        life: randomBetween(78, 130),
        max: 130,
        kind: "confetti"
      });
    }
  }

  function updateEffects(state) {
    addPlayerHeatSteam(state);

    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.kind === "confetti") {
        particle.vy += .075;
        particle.rotation += particle.spin;
      } else if (particle.kind === "bodySteam") {
        particle.vx += Math.sin((particle.life + particle.seed) * .035) * .014 * (particle.curl || 1);
        particle.vy -= .009;
        particle.r *= 1.008;
      } else if (particle.kind === "spark") {
        particle.vy += .018;
        particle.r *= .988;
      } else {
        particle.vy -= .012;
        particle.r *= 1.004;
      }
      particle.life--;
    });
    state.particles = state.particles.filter((particle) => particle.life > 0);
    if (state.particles.length > MAX_PARTICLES) {
      state.particles.splice(0, state.particles.length - MAX_PARTICLES);
    }

    state.texts.forEach((text) => {
      text.y -= .65;
      text.life--;
    });
    state.texts = state.texts.filter((text) => text.life > 0);
  }

  function addPlayerHeatSteam(state) {
    const origins = [
      { x: 230, y: 370, spreadX: 72, spreadY: 84 },
      { x: 1036, y: 372, spreadX: 76, spreadY: 86 }
    ];

    state.players.forEach((player, index) => {
      const heat = player.hp / MAX_HP;
      if (heat < .14) return;

      const chance = (heat - .14) * .28;
      if (Math.random() >= chance) return;

      const origin = origins[index];
      const burstCount = Math.random() < heat * .55 ? 2 : 1;

      for (let i = 0; i < burstCount; i++) {
        state.particles.push({
          x: origin.x + randomBetween(-origin.spreadX * .55, origin.spreadX),
          y: origin.y + randomBetween(-origin.spreadY * .5, origin.spreadY * .55),
          vx: randomBetween(-.38, .38),
          vy: randomBetween(-1.7, -.58),
          r: randomBetween(8, 18 + heat * 14),
          life: randomBetween(96, 168),
          max: 168,
          seed: randomBetween(0, Math.PI * 2),
          curl: randomBetween(.65, 1.35) * (Math.random() < .5 ? -1 : 1),
          stretch: randomBetween(.85, 1.35),
          kind: "bodySteam"
        });
      }
    });
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.effects = {
    addConfetti,
    addFireBurst,
    addFloatingText,
    addSteam,
    updateEffects
  };
})(window.SaunaTim = window.SaunaTim || {});
