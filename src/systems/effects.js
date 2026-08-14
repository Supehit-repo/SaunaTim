(function (SaunaTim) {
  const { AIM, MAX_HP } = SaunaTim.config;
  const { isAppleTouchDevice, randomBetween } = SaunaTim.utils;
  const STEAM_PERFORMANCE_SCALE = isAppleTouchDevice ? .45 : 1;
  const STEAM_SIZE_SCALE = isAppleTouchDevice ? .82 : 1;
  const STEAM_LIFE_SCALE = isAppleTouchDevice ? .72 : 1;
  const MAX_PARTICLES = isAppleTouchDevice ? 72 : 132;
  const MAX_BODY_STEAM_PARTICLES = isAppleTouchDevice ? 26 : 64;
  const MAX_STOVE_STEAM_PARTICLES = isAppleTouchDevice ? 36 : 88;

  function addFloatingText(state, text, x, y) {
    state.texts.push({ text, x, y, life: 75, max: 75 });
  }

  function addSteam(state, score) {
    const baseCount = Math.min(42, Math.max(12, Math.round(score * .45)));
    const particleCount = Math.max(5, Math.round(baseCount * STEAM_PERFORMANCE_SCALE));

    for (let i = 0; i < particleCount; i++) {
      addStoveSteamParticle(state, score, 1);
    }
  }

  function addStoveSteamBurst(state, score) {
    const baseCount = Math.min(28, Math.max(8, Math.round(score * .24)));
    const particleCount = Math.max(4, Math.round(baseCount * STEAM_PERFORMANCE_SCALE));

    for (let i = 0; i < particleCount; i++) {
      addStoveSteamParticle(state, score, 1.25);
    }
  }

  function addStoveSteamParticle(state, score, intensity) {
    const life = randomBetween(58 + score * .14, 112 + score * .18) * STEAM_LIFE_SCALE;

    state.particles.push({
      x: AIM.x + randomBetween(-96, 96),
      y: AIM.y - 32 + randomBetween(-10, 18),
      vx: randomBetween(-.72, .72) * intensity,
      vy: randomBetween(-3.05, -1.05) * intensity,
      r: randomBetween(9 + score * .025, 20 + score * .08) * intensity * STEAM_SIZE_SCALE,
      life,
      max: life,
      seed: randomBetween(0, Math.PI * 2),
      curl: randomBetween(.75, 1.35) * (Math.random() < .5 ? -1 : 1),
      stretch: randomBetween(.98, 1.34),
      kind: "stoveSteam"
    });
  }

  function addConfetti(state, winnerIndex) {
    const originX = winnerIndex === 0 ? 335 : 945;
    const palette = ["#ffef6c", "#ff5b4a", "#69d4ff", "#7fd35a", "#ffffff"];

    for (let i = 0; i < 42; i++) {
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

  function updateEffects(state, dt = 1) {
    const step = Math.max(.25, Math.min(2.5, dt || 1));

    addPlayerHeatSteam(state, step);

    state.particles.forEach((particle) => {
      particle.x += particle.vx * step;
      particle.y += particle.vy * step;
      if (particle.kind === "confetti") {
        particle.vy += .075 * step;
        particle.rotation += particle.spin * step;
      } else if (particle.kind === "bodySteam" || particle.kind === "stoveSteam") {
        particle.vx += Math.sin((particle.life + particle.seed) * .035) * .014 * (particle.curl || 1) * step;
        particle.vy -= (particle.kind === "stoveSteam" ? .018 : .009) * step;
        particle.r *= Math.pow(particle.kind === "stoveSteam" ? 1.012 : 1.008, step);
      } else if (particle.kind === "spark") {
        particle.vy += .018 * step;
        particle.r *= Math.pow(.988, step);
      } else {
        particle.vy -= .012 * step;
        particle.r *= Math.pow(1.004, step);
      }
      particle.life -= step;
    });
    state.particles = state.particles.filter((particle) => particle.life > 0);
    capParticleKind(state, "bodySteam", MAX_BODY_STEAM_PARTICLES);
    capParticleKind(state, "stoveSteam", MAX_STOVE_STEAM_PARTICLES);
    if (state.particles.length > MAX_PARTICLES) {
      state.particles.splice(0, state.particles.length - MAX_PARTICLES);
    }

    state.texts.forEach((text) => {
      text.y -= .65 * step;
      text.life -= step;
    });
    state.texts = state.texts.filter((text) => text.life > 0);
  }

  function addPlayerHeatSteam(state, dt = 1) {
    const origins = [
      { x: 230, y: 370, spreadX: 72, spreadY: 84 },
      { x: 1036, y: 372, spreadX: 76, spreadY: 86 }
    ];

    state.players.forEach((player, index) => {
      const heat = player.hp / MAX_HP;
      if (heat < .06) return;

      const chance = (heat - .04) * .22 * STEAM_PERFORMANCE_SCALE;
      const scaledChance = 1 - Math.pow(1 - chance, Math.max(.25, dt));
      if (Math.random() >= scaledChance) return;

      const origin = origins[index];
      const life = randomBetween(60, 96) * STEAM_LIFE_SCALE;

      state.particles.push({
        x: origin.x + randomBetween(-origin.spreadX * .55, origin.spreadX),
        y: origin.y + randomBetween(-origin.spreadY * .5, origin.spreadY * .55),
        vx: randomBetween(-.26, .26),
        vy: randomBetween(-1.35, -.5),
        r: randomBetween(12, 22 + heat * 11) * STEAM_SIZE_SCALE,
        life,
        max: life,
        seed: randomBetween(0, Math.PI * 2),
        curl: randomBetween(.6, 1.25) * (Math.random() < .5 ? -1 : 1),
        stretch: randomBetween(.86, 1.2),
        kind: "bodySteam"
      });
    });
  }

  function capParticleKind(state, kind, maxCount) {
    let kept = 0;

    for (let i = state.particles.length - 1; i >= 0; i--) {
      if (state.particles[i].kind !== kind) continue;
      kept++;
      if (kept > maxCount) state.particles.splice(i, 1);
    }
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.effects = {
    addConfetti,
    addFloatingText,
    addSteam,
    addStoveSteamBurst,
    updateEffects
  };
})(window.SaunaTim = window.SaunaTim || {});
