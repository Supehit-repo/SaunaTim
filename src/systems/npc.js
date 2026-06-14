(function (SaunaTim) {
  const { AIM, LAUNCH_POINTS, PHYSICS } = SaunaTim.config;
  const { randomBetween } = SaunaTim.utils;

  function createNpcThrow() {
    const launch = LAUNCH_POINTS.npc;
    const roll = Math.random();
    let targetX;

    if (roll < 0.18) {
      targetX = AIM.x + randomBetween(-18, 18);
    } else if (roll < 0.74) {
      targetX = randomBetween(AIM.x1 + 15, AIM.x2 - 15);
    } else {
      targetX = Math.random() < 0.5
        ? randomBetween(AIM.x1 - 85, AIM.x1 - 15)
        : randomBetween(AIM.x2 + 15, AIM.x2 + 85);
    }

    const frames = 58;

    return {
      x: launch.x,
      y: launch.y,
      vx: (targetX - launch.x) / frames,
      vy: (AIM.y - launch.y - 0.5 * PHYSICS.gravity * frames * frames) / frames
    };
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.npc = {
    createNpcThrow
  };
})(window.SaunaTim = window.SaunaTim || {});
