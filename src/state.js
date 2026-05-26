(function (SaunaTim) {
  function createGameState() {
    return {
      players: [
        { name: "SINÄ", hp: 0, score: 0, wins: 0 },
        { name: "IVAN", hp: 0, score: 0, wins: 0 }
      ],
      turn: 0,
      round: 1,
      projectile: null,
      dragging: false,
      dragNow: null,
      aimFrames: 0,
      wobble: 0,
      phase: 0,
      aiThinking: false,
      gameOver: false,
      msg: "Vedä ja päästä",
      lastScoreText: "",
      scoreFlash: 0,
      particles: [],
      texts: []
    };
  }

  function resetGameState(state) {
    Object.assign(state, createGameState());
  }

  SaunaTim.state = {
    createGameState,
    resetGameState
  };
})(window.SaunaTim = window.SaunaTim || {});
