(function (SaunaTim) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const platform = typeof navigator !== "undefined" ? navigator.platform : "";
  const isAppleTouchDevice = typeof navigator !== "undefined"
    && (/iP(hone|ad|od)/.test(userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1));

  SaunaTim.utils = {
    clamp,
    distance,
    isAppleTouchDevice,
    randomBetween
  };
})(window.SaunaTim = window.SaunaTim || {});
