(function (SaunaTim) {
  const { ASSETS, AIM, LAUNCH_POINTS, MAX_HP, PHYSICS, VIEWPORT } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;
  const { createGameState, resetGameState } = SaunaTim.state;
  const { clamp } = SaunaTim.utils;
  const { wireInput, isThrowStrongEnough } = SaunaTim.input;
  const { drawScene } = SaunaTim.render.scene;
  const { addFloatingText, addSteam, updateEffects } = SaunaTim.systems.effects;
  const { createNpcThrow } = SaunaTim.systems.npc;
  const { createProgressionTracker, recordThrowResult } = SaunaTim.systems.progression;
  const { scoreAt } = SaunaTim.systems.scoring;

  class SaunaTimGame {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.background = loadImage(ASSETS.background);
      this.state = createGameState();
      this.progression = createProgressionTracker();
      this.npcTimer = null;

      wireInput(this);
    }

    start() {
      this.loop();
    }

    reset() {
      if (this.npcTimer) {
        window.clearTimeout(this.npcTimer);
        this.npcTimer = null;
      }
      resetGameState(this.state);
    }

    cancelDrag() {
      this.state.dragging = false;
      this.state.dragNow = null;
    }

    shotFromDrag() {
      const dragNow = this.state.dragNow;
      const launch = LAUNCH_POINTS.player;
      const dx = clamp(dragNow.x - launch.x, -150, 150);
      const dy = clamp(dragNow.y - launch.y, -150, 150);

      return {
        vx: -dx * 0.126 + Math.sin(this.state.phase * 1.5) * this.state.wobble * 0.035,
        vy: -dy * 0.126 + Math.cos(this.state.phase * 1.1) * this.state.wobble * 0.028
      };
    }

    launchPlayerShot() {
      if (!this.state.dragging || this.state.turn !== 0 || this.state.projectile || this.state.gameOver) return;

      const shot = this.shotFromDrag();
      this.cancelDrag();

      if (!isThrowStrongEnough(shot)) {
        this.state.msg = "Vedä enemmän";
        return;
      }

      this.state.projectile = {
        x: LAUNCH_POINTS.player.x,
        y: LAUNCH_POINTS.player.y,
        vx: shot.vx,
        vy: shot.vy,
        trail: []
      };
      this.state.msg = "Sinä heität";
    }

    scheduleNpcThrow() {
      if (this.state.projectile || this.state.gameOver || this.state.turn !== 1 || this.state.aiThinking) return;

      this.state.aiThinking = true;
      this.state.msg = "Ivan tähtää";

      this.npcTimer = window.setTimeout(() => {
        this.npcTimer = null;
        if (this.state.gameOver || this.state.turn !== 1 || this.state.projectile) {
          this.state.aiThinking = false;
          return;
        }

        this.state.projectile = createNpcThrow();
        this.state.msg = "Ivan heittää";
        this.state.aiThinking = false;
      }, 700);
    }

    resolve(score) {
      const attackerIndex = this.state.turn;
      const defenderIndex = 1 - this.state.turn;
      const attacker = this.state.players[attackerIndex];
      const defender = this.state.players[defenderIndex];

      recordThrowResult(this.progression, attacker.name, score);

      if (score > 0) {
        defender.hp = clamp(defender.hp + score, 0, MAX_HP);
        attacker.score += score;
        this.state.lastScoreText = `${attacker.name}: +${score} p`;
        this.state.msg = this.state.lastScoreText;
        addFloatingText(this.state, `+${score}`, AIM.x, AIM.y - 85);
        addSteam(this.state, score);
      } else {
        this.state.lastScoreText = `${attacker.name}: OHI`;
        this.state.msg = this.state.lastScoreText;
        addFloatingText(this.state, "OHI", AIM.x, AIM.y - 85);
      }

      this.state.scoreFlash = 120;

      if (defender.hp >= MAX_HP) {
        this.state.gameOver = true;
        return;
      }

      this.state.turn = 1 - this.state.turn;
      if (this.state.turn === 0) this.state.round++;

      this.state.aiThinking = false;
      this.scheduleTurnMessage();
    }

    scheduleTurnMessage() {
      window.setTimeout(() => {
        if (this.state.gameOver) return;
        this.state.msg = this.state.turn === 0 ? "Sinun vuoro" : "Ivan tähtää";
        if (this.state.turn === 1) this.scheduleNpcThrow();
      }, 850);
    }

    updateProjectile() {
      const projectile = this.state.projectile;
      if (!projectile) return;

      projectile.trail.unshift({ x: projectile.x, y: projectile.y });
      projectile.trail = projectile.trail.slice(0, 26);

      const previousX = projectile.x;
      const previousY = projectile.y;

      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      projectile.vy += PHYSICS.gravity;

      const crossedLine = previousY <= AIM.y && projectile.y >= AIM.y;
      const closeToLine = Math.abs(projectile.y - AIM.y) <= 7 && projectile.vy > 0;

      if (crossedLine || closeToLine) {
        const denominator = projectile.y - previousY || 1;
        const progress = crossedLine ? (AIM.y - previousY) / denominator : 1;
        const hitX = previousX + (projectile.x - previousX) * clamp(progress, 0, 1);
        const score = scoreAt(hitX, AIM.y);
        this.resolve(score);
        this.state.projectile = null;
        return;
      }

      if (projectile.x < -100 || projectile.x > VIEWPORT.width + 100 || projectile.y > VIEWPORT.height + 100) {
        this.resolve(0);
        this.state.projectile = null;
      }
    }

    update() {
      this.state.phase += 0.16;
      this.state.wobble = this.state.dragging
        ? clamp(this.state.wobble + .16, 0, 11)
        : this.state.wobble * .88;

      if (this.state.scoreFlash > 0) this.state.scoreFlash--;

      this.updateProjectile();
      updateEffects(this.state);
    }

    draw() {
      drawScene(this.ctx, this.background, this.state, () => this.shotFromDrag());
    }

    loop() {
      this.update();
      this.draw();
      window.requestAnimationFrame(() => this.loop());
    }
  }

  SaunaTim.SaunaTimGame = SaunaTimGame;
})(window.SaunaTim = window.SaunaTim || {});
