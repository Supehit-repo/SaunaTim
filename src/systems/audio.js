(function (SaunaTim) {
  function createGameAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return createSilentAudio();

    let ctx = null;
    let master = null;
    let crackleTimer = null;
    let started = false;
    let unlocked = false;

    function ensureStarted() {
      if (!ctx) {
        ctx = new AudioContext();
        master = ctx.createGain();
        master.gain.value = .22;
        master.connect(ctx.destination);
      }

      if (ctx.state === "suspended") {
        const resume = ctx.resume();
        if (resume && typeof resume.catch === "function") resume.catch(() => {});
      }
      unlockMobileAudio();
      if (!started) {
        started = true;
        startFireCrackle();
      }
    }

    function unlockMobileAudio() {
      if (unlocked || !ctx || !master) return;
      unlocked = true;

      const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(master);
      source.start(0);
    }

    function startFireCrackle() {
      if (crackleTimer) return;

      crackleTimer = window.setInterval(() => {
        if (!ctx || ctx.state !== "running") return;
        if (Math.random() < .72) playNoiseBurst(.018, .025, 280, 1200);
      }, 180);
    }

    function playNoiseBurst(volume, duration, lowpass, highpass) {
      const sampleRate = ctx.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      const low = ctx.createBiquadFilter();
      const high = ctx.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = lowpass;
      high.type = "highpass";
      high.frequency.value = highpass;
      gain.gain.value = volume;

      source.buffer = buffer;
      source.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(master);
      source.start();
    }

    function playHiss(score) {
      if (!started || !ctx || ctx.state !== "running") return;
      const volume = Math.min(.24, .075 + score / 650);
      const duration = Math.min(1.1, .42 + score / 260);
      playNoiseBurst(volume, duration, 4200, 900);
    }

    function playIvanGrunt() {
      if (!started || !ctx || ctx.state !== "running") return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(128, now);
      osc.frequency.exponentialRampToValueAtTime(76, now + .2);
      filter.type = "lowpass";
      filter.frequency.value = 420;
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.16, now + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .25);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + .28);
    }

    function playFanfare() {
      if (!started || !ctx || ctx.state !== "running") return;

      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const now = ctx.currentTime + index * .08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.08, now + .015);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .22);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + .24);
      });
    }

    return {
      ensureStarted,
      getState() { return ctx ? ctx.state : "idle"; },
      playFanfare,
      playHiss,
      playIvanGrunt
    };
  }

  function createSilentAudio() {
    return {
      ensureStarted() {},
      getState() { return "unsupported"; },
      playFanfare() {},
      playHiss() {},
      playIvanGrunt() {}
    };
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.audio = {
    createGameAudio
  };
})(window.SaunaTim = window.SaunaTim || {});
