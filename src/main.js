(function (SaunaTim) {
  const canvas = document.getElementById("game");
  const game = new SaunaTim.SaunaTimGame(canvas);

  window.saunaTimGame = game;
  game.start();
})(window.SaunaTim = window.SaunaTim || {});
