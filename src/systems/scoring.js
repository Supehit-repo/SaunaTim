(function (SaunaTim) {
  const { AIM } = SaunaTim.config;

  function scoreAt(x, y) {
    if (Math.abs(y - AIM.y) > 34) return 0;
    if (x < AIM.x1 || x > AIM.x2) return 0;

    const distanceFromCenter = Math.abs(x - AIM.x);
    const maxDistance = (AIM.x2 - AIM.x1) / 2;

    return Math.max(1, Math.round(100 - (99 * distanceFromCenter / maxDistance)));
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.scoring = {
    scoreAt
  };
})(window.SaunaTim = window.SaunaTim || {});
