(function (SaunaTim) {
  const { LAUNCH_POINTS, PHYSICS, VIEWPORT } = SaunaTim.config;
  const { distance } = SaunaTim.utils;

  function wireInput(game) {
    const canvas = game.canvas;
    const unlockAudio = () => game.startAudio();

    // iOS Safari must see AudioContext.resume inside a real touch gesture.
    // Keep both press and release paths because older WebKit builds are picky
    // about which part of the gesture unlocks Web Audio.
    window.addEventListener("pointerdown", unlockAudio, { passive: true, capture: true });
    window.addEventListener("pointerup", unlockAudio, { passive: true, capture: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true, capture: true });
    window.addEventListener("touchend", unlockAudio, { passive: true, capture: true });
    window.addEventListener("click", unlockAudio, { passive: true, capture: true });

    canvas.addEventListener("pointerdown", (event) => {
      game.startAudio();
      if (game.isCanvasInputBlocked?.()) return;

      const pointer = getCanvasPoint(canvas, event);
      if (game.handleCanvasClick?.(pointer)) return;

      if (game.state.roundResultPending) return;

      if (game.state.gameOver) {
        game.reset();
        return;
      }

      if (game.state.turn !== 0 || game.state.projectile || game.state.aiThinking) return;

      if (distance(pointer.x, pointer.y, LAUNCH_POINTS.player.x, LAUNCH_POINTS.player.y) < 190) {
        game.state.dragging = true;
        game.state.dragNow = pointer;
        game.state.aimFrames = 0;
        game.state.wobble = 0;
        canvas.setPointerCapture(event.pointerId);
      }
    });

    canvas.addEventListener("pointermove", (event) => {
      if (game.state.dragging) {
        game.state.dragNow = getCanvasPoint(canvas, event);
      }
    });

    canvas.addEventListener("pointerup", () => {
      game.startAudio();
      if (game.isCanvasInputBlocked?.()) {
        game.cancelDrag();
        return;
      }
      game.launchPlayerShot();
    });

    canvas.addEventListener("pointercancel", () => {
      game.cancelDrag();
    });

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") game.startAudio();
      if ((event.code === "Enter" || event.code === "Space") && game.state.roundResultPending) {
        game.confirmRoundResult();
        return;
      }
      if (event.code === "Space" && game.state.gameOver) game.reset();
    });
  }

  function getCanvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * VIEWPORT.width / rect.width,
      y: (event.clientY - rect.top) * VIEWPORT.height / rect.height
    };
  }

  function isThrowStrongEnough(shot) {
    return Math.hypot(shot.vx, shot.vy) >= PHYSICS.minThrowSpeed;
  }

  SaunaTim.input = {
    isThrowStrongEnough,
    wireInput
  };
})(window.SaunaTim = window.SaunaTim || {});
