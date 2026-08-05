(function (SaunaTim) {
  const canvas = document.getElementById("game");
  const game = new SaunaTim.SaunaTimGame(canvas);

  wireInstructions();
  wireMenu();

  window.saunaTimGame = game;
  game.start();

  function wireInstructions() {
    const panel = document.getElementById("instructionsPanel");
    const close = document.getElementById("instructionsClose");
    const toggle = document.getElementById("instructionsToggle");
    if (!panel || !close || !toggle) return;

    const setVisible = (visible) => {
      panel.hidden = !visible;
      toggle.hidden = visible;
    };

    close.addEventListener("click", () => {
      game.startAudio();
      setVisible(false);
    });
    toggle.addEventListener("click", () => {
      game.startAudio();
      setVisible(true);
    });
  }

  function wireMenu() {
    const gameMenu = document.getElementById("gameMenu");
    const menuToggle = document.getElementById("menuToggle");
    const menuPanel = document.getElementById("menuPanel");
    const menuHome = document.getElementById("menuHome");
    const settingsPanel = document.getElementById("settingsPanel");
    const settingsOpen = document.getElementById("settingsOpen");
    const settingsBack = document.getElementById("settingsBack");
    const soundsEnabled = document.getElementById("soundsEnabled");
    const legalDialog = document.getElementById("legalDialog");
    const legalTitle = document.getElementById("legalTitle");
    const legalContent = document.getElementById("legalContent");
    const legalClose = document.getElementById("legalClose");
    if (!gameMenu || !menuToggle || !menuPanel || !menuHome || !settingsPanel || !soundsEnabled) return;

    const positionMenu = () => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / canvas.width;
      const scaleY = rect.height / canvas.height;
      const width = menuToggle.offsetWidth || 50;
      const height = menuToggle.offsetHeight || 50;
      const targetLeft = rect.left + 1168 * scaleX;
      const targetTop = rect.top + 60 * scaleY;
      const left = Math.min(Math.max(targetLeft, rect.left + 10), rect.right - width - 10);
      const top = Math.min(Math.max(targetTop, rect.top + 10), rect.bottom - height - 10);

      gameMenu.style.setProperty("--game-menu-left", `${Math.round(left)}px`);
      gameMenu.style.setProperty("--game-menu-top", `${Math.round(top)}px`);
    };

    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("orientationchange", positionMenu);
    window.visualViewport?.addEventListener("resize", positionMenu);

    const soundOn = window.localStorage.getItem("saunaTim:soundsEnabled") !== "false";
    soundsEnabled.checked = soundOn;
    game.audio.setEnabled(soundOn);

    const showSettings = (visible) => {
      menuHome.hidden = visible;
      settingsPanel.hidden = !visible;
    };
    const setMenuVisible = (visible) => {
      menuPanel.hidden = !visible;
      menuToggle.setAttribute("aria-expanded", String(visible));
      if (!visible) showSettings(false);
    };
    const closeLegal = () => { if (legalDialog) legalDialog.hidden = true; };

    menuToggle.addEventListener("click", () => {
      game.startAudio();
      setMenuVisible(menuPanel.hidden);
    });
    document.addEventListener("pointerdown", (event) => {
      if (!menuPanel.hidden && !gameMenu.contains(event.target)) setMenuVisible(false);
    });
    settingsOpen.addEventListener("click", () => showSettings(true));
    settingsBack.addEventListener("click", () => showSettings(false));
    soundsEnabled.addEventListener("change", () => {
      const enabled = soundsEnabled.checked;
      window.localStorage.setItem("saunaTim:soundsEnabled", String(enabled));
      game.audio.setEnabled(enabled);
      if (enabled) game.startAudio();
    });
    document.querySelectorAll("[data-legal]").forEach((button) => {
      button.addEventListener("click", () => {
        const isPrivacy = button.dataset.legal === "privacy";
        legalTitle.textContent = isPrivacy ? "Tietosuojaseloste" : "Käyttöehdot";
        legalContent.innerHTML = isPrivacy
          ? "<p><strong>Luonnos, versio 0.1.0.</strong></p><p>Sauna Tim toimii paikallisesti selaimessasi. Peli ei pyydä käyttäjätiliä eikä lähetä pelitietoja, tunnisteita tai henkilötietoja palvelimelle.</p><p>Asetusvalintasi, kuten äänien tila, tallennetaan vain tämän selaimen paikalliseen tallennustilaan. Tätä tekstiä päivitetään, jos peliin lisätään verkkopalveluita tai analytiikkaa.</p>"
          : "<p><strong>Luonnos, versio 0.1.0.</strong></p><p>Sauna Tim tarjotaan viihdekäyttöön sellaisena kuin se on. Pelin käyttö on omalla vastuulla.</p><p>Pelin sisältöä, nimeä ja visuaalisia materiaaleja ei saa kopioida tai levittää ilman oikeudenhaltijan lupaa. Käyttöehtoja voidaan päivittää myöhemmissä versioissa.</p>";
        setMenuVisible(false);
        legalDialog.hidden = false;
      });
    });
    legalClose?.addEventListener("click", closeLegal);
    legalDialog?.addEventListener("click", (event) => {
      if (event.target === legalDialog) closeLegal();
    });
  }
})(window.SaunaTim = window.SaunaTim || {});
