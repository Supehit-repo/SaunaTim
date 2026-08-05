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
    player: { x: 360, y: 456 },
    npc: { x: 920, y: 456 }
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
      dropFrames: 76
    },
    popup: {
      x: 314,
      y: 168,
      width: 652,
      height: 292
    },
    adDuration: 210
  };

  const ASSETS = {
    background: "./src/images/defaultbackground.png?v=clean-background-20260805",
    loylySound: "./assets/audio/loyly-reference.mp3",
    playerCharacters: {
      default: "./src/Characters/Player1.png?v=player1-normalized-20260805"
    },
    opponentCharacters: {
      default: "./src/Characters/DefaultOpponent.png?v=balanced-launch-20260805",
      vladimir: "./src/Characters/VladimirOpponent.png?v=balanced-launch-20260805"
    },
    saunaLogo: "./src/images/SaunaTimLogo.png",
    sponsors: {
      kylasauna: "./src/Sponsors/Kylasauna.jpg?v=sponsor-fabric-20260805"
    },
    vladimirFace: "./src/images/VP.jpg"
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
