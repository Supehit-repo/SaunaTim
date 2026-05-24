(function (SaunaTim) {
  const STORAGE_KEY = "sauna-tim.progression";

  function createProgressionTracker() {
    return {
      bestThrow: readBestThrow()
    };
  }

  function recordThrowResult(progression, playerName, score) {
    if (score <= progression.bestThrow.score) return;

    progression.bestThrow = {
      playerName,
      score,
      at: new Date().toISOString()
    };
    writeBestThrow(progression.bestThrow);
  }

  function readBestThrow() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return { playerName: null, score: 0, at: null };

      const parsed = JSON.parse(saved);
      return {
        playerName: parsed.playerName ?? null,
        score: Number(parsed.score) || 0,
        at: parsed.at ?? null
      };
    } catch {
      return { playerName: null, score: 0, at: null };
    }
  }

  function writeBestThrow(bestThrow) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bestThrow));
    } catch {
      // Browsers can deny localStorage in private or embedded contexts.
    }
  }

  SaunaTim.systems = SaunaTim.systems || {};
  SaunaTim.systems.progression = {
    createProgressionTracker,
    recordThrowResult
  };
})(window.SaunaTim = window.SaunaTim || {});
