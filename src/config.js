(function (SaunaTim) {
  const VIEWPORT = {
    width: 1280,
    height: 720
  };

  const PHYSICS = {
    gravity: 0.34,
    minThrowSpeed: 1.6
  };

  const MAX_HP = 350;
  const WINS_TO_MATCH = 2;
  const TEMPERATURE = {
    base: 65,
    max: 100
  };

  const AIM = {
    x1: 525,
    x2: 755,
    y: 440,
    get x() {
      return (this.x1 + this.x2) / 2;
    }
  };

  const LAUNCH_POINTS = {
    player: { x: 333, y: 399 },
    npc: { x: 945, y: 399 }
  };

  const NALLEMEHU = {
    bottle: {
      x: 640,
      anchorX: 640,
      anchorY: 118,
      startY: 152,
      targetY: 284,
      rotation: -0.28,
      scale: 0.52,
      dropFrames: 76,
      floatAmplitude: 58,
      floatSpeed: 0.06
    },
    popup: {
      x: 314,
      y: 168,
      width: 652,
      height: 292
    }
  };

  const ASSETS = {
    background: "./src/images/defaultbackground.png?v=background-update-20260911",
    loylySound: "./assets/audio/loyly-reference.mp3",
    playerCharacters: {
      default: "./src/Characters/Player1.png?v=player1-normalized-20260805"
    },
    opponentCharacters: {
      default: "./src/Characters/DefaultOpponent.png?v=balanced-launch-20260805"
    },
    saunaLogo: "./src/images/SaunaTimLogo.png",
    sponsors: {
      kylasauna: "./src/Sponsors/Kylasauna.jpg?v=sponsor-fabric-20260805"
    }
  };

  SaunaTim.config = {
    AIM,
    ASSETS,
    LAUNCH_POINTS,
    MAX_HP,
    NALLEMEHU,
    PHYSICS,
    TEMPERATURE,
    WINS_TO_MATCH,
    VIEWPORT
  };
})(window.SaunaTim = window.SaunaTim || {});
