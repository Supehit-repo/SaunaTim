(function (SaunaTim) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

  SaunaTim.utils = {
    clamp,
    distance,
    randomBetween
  };
})(window.SaunaTim = window.SaunaTim || {});
