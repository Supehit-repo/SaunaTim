(function (SaunaTim) {
  function createNallemehuState() {
    return {
      phase: "hidden",
      x: 640,
      y: -130,
      age: 0,
      popupOpen: false,
      popupSeen: false,
      shotOwner: null,
      pendingTurn: null,
      adTimer: 0,
      hit: false
    };
  }

  function createGameState() {
    return {
      players: [
        { name: "SINÄ", hp: 0, score: 0, wins: 0, heartPulse: 0 },
        { name: "IVAN", hp: 0, score: 0, wins: 0, heartPulse: 0 }
      ],
      turn: 0,
      round: 1,
      roundThrows: 0,
      projectile: null,
      dragging: false,
      dragNow: null,
      aimFrames: 0,
      wobble: 0,
      phase: 0,
      aiThinking: false,
      gameOver: false,
      roundResultPending: false,
      roundResultWinner: null,
      roundResultEndsMatch: false,
      msg: "Vedä ja päästä",
      fireBoost: 0,
      ladleSwing: [0, 0],
      opponentVariant: "ivan",
      nallemehu: createNallemehuState(),
      particles: [],
      texts: []
    };
  }

  function resetGameState(state) {
    Object.assign(state, createGameState());
  }

  SaunaTim.state = {
    createNallemehuState,
    createGameState,
    resetGameState
  };
})(window.SaunaTim = window.SaunaTim || {});
