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
    player: { x: 276, y: 430 },
    npc: { x: 1004, y: 430 }
  };

  const ASSETS = {
    background: "./assets/sauna-background.png"
  };

  SaunaTim.config = {
    AIM,
    ASSETS,
    LAUNCH_POINTS,
    MAX_HP,
    PHYSICS,
    TEMPERATURE,
    WINS_TO_MATCH,
    VIEWPORT
  };
})(window.SaunaTim = window.SaunaTim || {});
