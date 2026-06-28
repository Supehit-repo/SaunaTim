(function (SaunaTim) {
  const { ASSETS, AIM, LAUNCH_POINTS, MAX_HP, PHYSICS, VIEWPORT, WINS_TO_MATCH } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;
  const { createGameState, resetGameState } = SaunaTim.state;
  const { clamp } = SaunaTim.utils;
  const { wireInput, isThrowStrongEnough } = SaunaTim.input;
  const { drawScene } = SaunaTim.render.scene;
  const { addConfetti, addFireBurst, addFloatingText, addSteam, updateEffects } = SaunaTim.systems.effects;
  const { createGameAudio } = SaunaTim.systems.audio;
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
      this.audio = createGameAudio();
      this.npcTimer = null;
      this.roundResultDialog = document.getElementById("roundResultDialog");
      this.roundResultTitle = document.getElementById("roundResultTitle");
      this.roundResultText = document.getElementById("roundResultText");
      this.roundResultOk = document.getElementById("roundResultOk");

      wireInput(this);
      this.wireRoundResultDialog();
    }

    start() {
      this.loop();
    }

    startAudio() {
      this.audio.ensureStarted();
    }

    wireRoundResultDialog() {
      if (!this.roundResultOk) return;
      this.roundResultOk.addEventListener("click", () => {
        this.startAudio();
        this.confirmRoundResult();
      });
    }

    reset() {
      if (this.npcTimer) {
        window.clearTimeout(this.npcTimer);
        this.npcTimer = null;
      }
      this.hideRoundResultDialog();
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
      const aimPenalty = clamp(this.state.aimFrames / 260, 0, 1);

      return {
        vx: -dx * 0.126
          + Math.sin(this.state.phase * 1.25) * this.state.wobble * 0.006
          + Math.sin(this.state.phase * .62) * aimPenalty * .28,
        vy: -dy * 0.126
          + Math.cos(this.state.phase * .95) * this.state.wobble * 0.005
          + Math.cos(this.state.phase * .7) * aimPenalty * .22
      };
    }

    launchPlayerShot() {
      if (!this.state.dragging || this.state.turn !== 0 || this.state.projectile || this.state.gameOver || this.state.roundResultPending) return;

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
        owner: 0
      };
      this.state.ladleSwing[0] = SaunaTim.render.props.SWING_DURATION;
      this.state.msg = "Sinä heität";
    }

    scheduleNpcThrow() {
      if (this.state.projectile || this.state.gameOver || this.state.roundResultPending || this.state.turn !== 1 || this.state.aiThinking) return;

      this.state.aiThinking = true;

      this.npcTimer = window.setTimeout(() => {
        this.npcTimer = null;
        if (this.state.gameOver || this.state.roundResultPending || this.state.turn !== 1 || this.state.projectile) {
          this.state.aiThinking = false;
          return;
        }

        this.state.projectile = createNpcThrow();
        this.state.projectile.owner = 1;
        this.state.msg = "Ivan heittää";
        this.state.ladleSwing[1] = SaunaTim.render.props.SWING_DURATION;
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
        defender.heartPulse = 28;
        attacker.score += score;
        this.state.lastScoreText = `${attacker.name}: +${score} p`;
        this.state.msg = this.state.lastScoreText;
        addFloatingText(this.state, `+${score}`, AIM.x, AIM.y - 85);
        addSteam(this.state, score);
        this.audio.playHiss(score);

        if (score >= 90) {
          this.state.fireBoost = Math.max(this.state.fireBoost, 160);
          addFireBurst(this.state, score);
        }

        if (defenderIndex === 1 && MAX_HP - defender.hp <= 100) {
          this.audio.playIvanGrunt();
        }
      } else {
        this.state.lastScoreText = `${attacker.name}: OHI`;
        this.state.msg = this.state.lastScoreText;
        addFloatingText(this.state, "OHI", AIM.x, AIM.y - 85);
      }

      this.state.scoreFlash = 120;

      if (defender.hp >= MAX_HP) {
        this.finishRound(attackerIndex);
        return;
      }

      this.state.turn = 1 - this.state.turn;

      this.state.aiThinking = false;
      this.scheduleTurnMessage();
    }

    finishRound(winnerIndex) {
      const winner = this.state.players[winnerIndex];
      winner.wins++;
      this.state.msg = winnerIndex === 0 ? "Sinä voitit kierroksen!" : "Ivan voitti kierroksen!";
      this.state.lastScoreText = this.state.msg;
      addConfetti(this.state, winnerIndex);
      this.audio.playFanfare();

      this.state.roundResultPending = true;
      this.state.roundResultWinner = winnerIndex;
      this.state.roundResultEndsMatch = winner.wins >= WINS_TO_MATCH;
      this.showRoundResultDialog(winnerIndex, this.state.roundResultEndsMatch);
    }

    showRoundResultDialog(winnerIndex, endsMatch) {
      if (!this.roundResultDialog) return;

      const playerWon = winnerIndex === 0;
      this.roundResultTitle.textContent = playerWon ? "Sinä voitit kierroksen!" : "Ivan voitti kierroksen!";
      this.roundResultText.textContent = endsMatch
        ? "Paina OK nähdäksesi ottelun tuloksen."
        : "Paina OK aloittaaksesi seuraavan kierroksen.";
      this.roundResultDialog.hidden = false;
      window.setTimeout(() => this.roundResultOk?.focus(), 0);
    }

    hideRoundResultDialog() {
      if (this.roundResultDialog) this.roundResultDialog.hidden = true;
    }

    confirmRoundResult() {
      if (!this.state.roundResultPending) return;

      const endsMatch = this.state.roundResultEndsMatch;
      this.state.roundResultPending = false;
      this.state.roundResultWinner = null;
      this.state.roundResultEndsMatch = false;
      this.hideRoundResultDialog();

      if (endsMatch) {
        this.state.gameOver = true;
        return;
      }

      this.startNextRound();
    }

    startNextRound() {
      if (this.state.gameOver) return;

      const wins = this.state.players.map((player) => player.wins);
      this.state.players.forEach((player) => {
        player.hp = 0;
        player.score = 0;
        player.heartPulse = 0;
      });
      this.state.round++;
      this.state.turn = this.state.round % 2 === 0 ? 1 : 0;
      this.state.projectile = null;
      this.state.dragging = false;
      this.state.dragNow = null;
      this.state.aimFrames = 0;
      this.state.aiThinking = false;
      this.state.roundResultPending = false;
      this.state.roundResultWinner = null;
      this.state.roundResultEndsMatch = false;
      this.state.scoreFlash = 0;
      this.state.fireBoost = 0;
      this.state.ladleSwing = [0, 0];
      this.state.particles = [];
      this.state.texts = [];
      this.state.players.forEach((player, index) => {
        player.wins = wins[index];
      });
      this.state.msg = this.state.turn === 0 ? "Sinun vuorosi" : "Ivan aloittaa";

      if (this.state.turn === 1) this.scheduleNpcThrow();
    }

    scheduleTurnMessage() {
      window.setTimeout(() => {
        if (this.state.gameOver || this.state.roundResultPending) return;
        this.state.msg = this.state.turn === 0 ? "Sinun vuorosi" : "";
        if (this.state.turn === 1) this.scheduleNpcThrow();
      }, 850);
    }

    updateProjectile() {
      const projectile = this.state.projectile;
      if (!projectile) return;

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
        ? clamp(this.state.wobble + .045, 0, 2.4)
        : this.state.wobble * .88;
      if (this.state.dragging) this.state.aimFrames++;

      if (this.state.scoreFlash > 0) this.state.scoreFlash--;
      if (this.state.fireBoost > 0) this.state.fireBoost--;
      this.state.ladleSwing = this.state.ladleSwing.map((swing) => Math.max(0, swing - 1));
      this.state.players.forEach((player) => {
        if (player.heartPulse > 0) player.heartPulse--;
      });

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
