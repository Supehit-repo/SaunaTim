(function (SaunaTim) {
  const canvas = document.getElementById("game");
  const game = new SaunaTim.SaunaTimGame(canvas);

  wireInstructions();

  window.saunaTimGame = game;
  game.start();

  function wireInstructions() {
    const panel = document.getElementById("instructionsPanel");
    const close = document.getElementById("instructionsClose");
    const toggle = document.getElementById("instructionsToggle");
    if (!panel || !close || !toggle) return;

    const setVisible = (visible) => {
      panel.hidden = !visible;
      toggle.hidden = visible;
    };

    close.addEventListener("click", () => {
      game.startAudio();
      setVisible(false);
    });
    toggle.addEventListener("click", () => {
      game.startAudio();
      setVisible(true);
    });
  }
})(window.SaunaTim = window.SaunaTim || {});
