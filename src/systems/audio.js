(function (SaunaTim) {
  const { ASSETS } = SaunaTim.config;

  function createGameAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return createSilentAudio();

    let ctx = null;
    let master = null;
    let crackleTimer = null;
    let started = false;
    let startPromise = null;
    let enabled = true;
    let loylyBuffer = null;
    let loylyLoadPromise = null;
    let primed = false;
    const lowPowerAudio = shouldUseLowPowerAudio();
    const continuousAmbientAudio = shouldUseContinuousAmbientAudio();

    function ensureStarted() {
      if (!ctx) {
        ctx = new AudioContext();
        master = ctx.createGain();
        master.gain.value = enabled ? .22 : 0;
        master.connect(ctx.destination);
      }

      // Safari only allows Web Audio to start from a real user gesture. Prime
      // it synchronously here, then wait for resume before scheduling sounds.
      primeMobileAudio();
      if (ctx.state === "running") {
        finishStarting();
        return Promise.resolve();
      }

      if (startPromise) return startPromise;
      let resume = null;
      try {
        resume = ctx.resume();
      } catch (error) {
        return Promise.resolve();
      }
      if (!resume || typeof resume.then !== "function") {
        window.setTimeout(() => {
          if (ctx && ctx.state === "running") finishStarting();
        }, 0);
        return Promise.resolve();
      }

      startPromise = resume
        .then(() => {
          if (ctx && ctx.state === "running") finishStarting();
        })
        .catch(() => {})
        .finally(() => { startPromise = null; });
      return startPromise;
    }

    function finishStarting() {
      if (started) return;
      started = true;
      if (continuousAmbientAudio) {
        startFireCrackle();
      }
    }

    function disconnectNodes(...nodes) {
      nodes.forEach((node) => {
        try {
          node.disconnect();
        } catch (error) {
          // Already disconnected; Web Audio throws on some browsers.
        }
      });
    }

    function scheduleDisconnect(when, ...nodes) {
      if (!ctx) return;
      const delayMs = Math.max(0, (when - ctx.currentTime + .08) * 1000);
      window.setTimeout(() => disconnectNodes(...nodes), delayMs);
    }

    function loadLoylySample() {
      if (!ctx || !ASSETS.loylySound) return Promise.resolve(null);
      if (typeof fetch !== "function") return Promise.resolve(null);
      if (loylyBuffer) return Promise.resolve(loylyBuffer);
      if (loylyLoadPromise) return loylyLoadPromise;

      loylyLoadPromise = fetch(ASSETS.loylySound)
        .then((response) => {
          if (!response.ok) throw new Error(`Löyly audio ${response.status}`);
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          loylyBuffer = audioBuffer;
          return loylyBuffer;
        })
        .catch(() => null)
        .finally(() => {
          loylyLoadPromise = null;
        });

      return loylyLoadPromise;
    }

    function primeMobileAudio() {
      if (!ctx || !master) return;
      if (primed) return;
      primed = true;

      const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(master);
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + .01);
      scheduleDisconnect(ctx.currentTime + .03, source, gain);
    }

    function startFireCrackle() {
      if (!continuousAmbientAudio) return;
      if (crackleTimer) return;

      crackleTimer = window.setInterval(() => {
        if (!canPlay()) return;
        if (Math.random() < .42) playNoiseBurst(.014, .02, 260, 1350);
      }, 420);
    }

    function canPlay() {
      if (!ctx || !master || ctx.state !== "running") return false;
      if (!started) finishStarting();
      return true;
    }

    function playNoiseBurst(volume, duration, lowpass, highpass) {
      if (!canPlay()) return;
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
      const now = ctx.currentTime;
      source.start(now);
      source.stop(now + duration + .02);
      scheduleDisconnect(now + duration + .04, source, high, low, gain);
    }

    function playHiss(score) {
      if (!canPlay()) return;
      if (lowPowerAudio) {
        playLoylySizzle(score);
        return;
      }
      if (playLoylySample(score)) return;

      loadLoylySample();
      playLoylySizzle(score);
    }

    function playLoylySample(score) {
      if (!loylyBuffer || !canPlay()) return false;

      const now = ctx.currentTime;
      const duration = Math.min(3.8, 1.9 + score / 130);
      const startOffset = loylyBuffer.duration > duration + .16 ? .08 : 0;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      const low = ctx.createBiquadFilter();
      const high = ctx.createBiquadFilter();
      const volume = Math.min(.44, .18 + score / 520);

      source.buffer = loylyBuffer;
      source.playbackRate.setValueAtTime(.96 + Math.random() * .08, now);

      high.type = "highpass";
      high.frequency.value = 95;
      high.Q.value = .25;

      low.type = "lowpass";
      low.frequency.setValueAtTime(6800, now);
      low.frequency.exponentialRampToValueAtTime(1600, now + duration);
      low.Q.value = .35;

      gain.gain.setValueAtTime(.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + .012);
      gain.gain.setValueAtTime(volume * .88, now + Math.min(.6, duration * .32));
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);

      playSteamAttack(score, now);
      source.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(master);
      source.start(now, startOffset, duration);
      source.stop(now + duration + .04);
      scheduleDisconnect(now + duration + .08, source, high, low, gain);
      return true;
    }

    function playLoylySizzle(score) {
      const now = ctx.currentTime;
      const volume = Math.min(.5, .2 + score / 520);
      const duration = Math.min(4.1, 2.1 + score / 150);

      playSteamAttack(score, now);
      playSoftNoiseBurst(volume, duration, 3900, 260);
    }

    function playSteamAttack(score, start = ctx.currentTime) {
      if (!canPlay()) return;

      const duration = .38;
      const sampleRate = ctx.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      const volume = Math.min(.42, .18 + score / 560);

      for (let i = 0; i < length; i++) {
        const t = i / length;
        const bite = Math.pow(1 - t, 2.1);
        data[i] = (Math.random() * 2 - 1) * bite;
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      const low = ctx.createBiquadFilter();
      const high = ctx.createBiquadFilter();

      low.type = "lowpass";
      low.frequency.setValueAtTime(7800, start);
      low.frequency.exponentialRampToValueAtTime(2600, start + duration);
      low.Q.value = .25;

      high.type = "highpass";
      high.frequency.value = 420;
      high.Q.value = .25;

      gain.gain.setValueAtTime(.0001, start);
      gain.gain.linearRampToValueAtTime(volume, start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);

      source.buffer = buffer;
      source.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(master);
      source.start(start);
      source.stop(start + duration + .03);
      scheduleDisconnect(start + duration + .08, source, high, low, gain);
    }

    function playIvanGrunt() {
      if (!canPlay()) return;

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
      scheduleDisconnect(now + .34, osc, filter, gain);
    }

    function playFanfare() {
      if (!canPlay()) return;

      const now = ctx.currentTime + .02;
      const phrase = [
        { frequency: 392.00, at: 0, duration: .2, volume: .05 },
        { frequency: 523.25, at: .16, duration: .22, volume: .062 },
        { frequency: 659.25, at: .32, duration: .24, volume: .066 },
        { frequency: 783.99, at: .52, duration: .38, volume: .074 }
      ];
      const finalChord = [523.25, 659.25, 783.99, 1046.50];

      phrase.forEach((note) => {
        playBrassTone(note.frequency, now + note.at, note.duration, note.volume);
        playBrassTone(note.frequency / 2, now + note.at, note.duration * 1.08, note.volume * .34);
      });

      finalChord.forEach((frequency, index) => {
        playBrassTone(frequency, now + .82, .58, .043 - index * .004);
      });

      playFanfareTail(now + .78);
    }

    function playSoftNoiseBurst(volume, duration, lowpass, highpass) {
      if (!canPlay()) return;

      const sampleRate = ctx.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      let smoothed = 0;

      for (let i = 0; i < length; i++) {
        const bright = Math.random() * 2 - 1;
        smoothed = smoothed * .82 + bright * .18;
        const t = i / length;
        const fadeOut = 1 - i / length;
        const attack = Math.max(0, 1 - t / .16);
        const envelope = Math.min(1, t / .028) * Math.pow(fadeOut, .38);
        data[i] = (smoothed * .84 + bright * .16 * attack) * envelope;
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      const low = ctx.createBiquadFilter();
      const high = ctx.createBiquadFilter();
      const now = ctx.currentTime;

      low.type = "lowpass";
      low.frequency.setValueAtTime(lowpass, now);
      low.frequency.exponentialRampToValueAtTime(Math.max(900, lowpass * .42), now + duration);
      low.Q.value = .45;

      high.type = "highpass";
      high.frequency.value = highpass;
      high.Q.value = .35;

      gain.gain.setValueAtTime(.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + .028);
      gain.gain.setValueAtTime(volume * .76, now + Math.min(.75, duration * .38));
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);

      source.buffer = buffer;
      source.connect(high);
      high.connect(low);
      low.connect(gain);
      gain.connect(master);
      source.start(now);
      source.stop(now + duration + .03);
      scheduleDisconnect(now + duration + .08, source, high, low, gain);
    }

    function playBrassTone(frequency, start, duration, volume) {
      const osc = ctx.createOscillator();
      const detuned = ctx.createOscillator();
      const toneGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      detuned.type = "triangle";
      osc.frequency.setValueAtTime(frequency, start);
      detuned.frequency.setValueAtTime(frequency * 1.006, start);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(720, start);
      filter.frequency.exponentialRampToValueAtTime(2600, start + .045);
      filter.frequency.exponentialRampToValueAtTime(1250, start + duration);
      filter.Q.value = 2.2;

      toneGain.gain.setValueAtTime(.0001, start);
      toneGain.gain.exponentialRampToValueAtTime(volume, start + .025);
      toneGain.gain.setValueAtTime(volume * .72, start + duration * .55);
      toneGain.gain.exponentialRampToValueAtTime(.0001, start + duration);

      osc.connect(filter);
      detuned.connect(filter);
      filter.connect(toneGain);
      toneGain.connect(master);
      osc.start(start);
      detuned.start(start);
      osc.stop(start + duration + .04);
      detuned.stop(start + duration + .04);
      scheduleDisconnect(start + duration + .1, osc, detuned, filter, toneGain);
    }

    function playFanfareTail(start) {
      const gain = ctx.createGain();
      const delay = ctx.createDelay();
      const feedback = ctx.createGain();
      const oscillators = [];

      delay.delayTime.setValueAtTime(.11, start);
      feedback.gain.setValueAtTime(.18, start);
      feedback.gain.exponentialRampToValueAtTime(.0001, start + .5);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.036, start + .018);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .42);

      [156.00, 196.00].forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, start + index * .03);
        osc.frequency.exponentialRampToValueAtTime(frequency * .86, start + .32);
        osc.connect(gain);
        osc.start(start + index * .03);
        osc.stop(start + .36);
        oscillators.push(osc);
      });

      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(master);
      scheduleDisconnect(start + .72, ...oscillators, gain, delay, feedback);
    }

    function setEnabled(value) {
      enabled = Boolean(value);
      if (master) master.gain.setValueAtTime(enabled ? .22 : 0, ctx.currentTime);
    }

    return {
      ensureStarted,
      getState() { return ctx ? ctx.state : "idle"; },
      isEnabled() { return enabled; },
      setEnabled,
      playFanfare,
      playHiss,
      playIvanGrunt
    };
  }

  function shouldUseLowPowerAudio() {
    const nav = window.navigator || {};
    const userAgent = nav.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);

    return isAndroid;
  }

  function shouldUseContinuousAmbientAudio() {
    const nav = window.navigator || {};
    const userAgent = nav.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);
    const isAppleMobile = /iPad|iPhone|iPod/i.test(userAgent)
      || (/\bMacintosh\b/i.test(userAgent) && nav.maxTouchPoints > 1);
    const isCoarsePointer = typeof window.matchMedia === "function"
      && window.matchMedia("(pointer: coarse)").matches;

    return !isAndroid && !(isAppleMobile && isCoarsePointer);
  }

  function createSilentAudio() {
    let enabled = true;

    return {
      ensureStarted() {},
      getState() { return "unsupported"; },
      isEnabled() { return enabled; },
      setEnabled(value) { enabled = Boolean(value); },
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
