(function (SaunaTim) {
  const { ASSETS } = SaunaTim.config;
  const { loadImage } = SaunaTim.assets;
  const sponsorImages = Object.entries(ASSETS.sponsors || {}).reduce((images, [name, src]) => {
    images[name] = loadImage(src);
    return images;
  }, {});

  const KYLASAUNA_BANNER = {
    x: 499,
    y: 207,
    width: 282,
    height: 107,
    sag: 10
  };

  function drawSponsors(ctx) {
    drawKylasaunaBanner(ctx);
  }

  function drawKylasaunaBanner(ctx) {
    const banner = KYLASAUNA_BANNER;
    const image = sponsorImages.kylasauna;

    ctx.save();
    ctx.translate(banner.x + banner.width / 2, banner.y + banner.height / 2);
    ctx.rotate(-.014);
    ctx.translate(-banner.width / 2, -banner.height / 2);

    drawBannerShadow(ctx, banner);
    drawSponsorImage(ctx, image, banner);
    drawFabricTexture(ctx, banner);
    drawBannerEdge(ctx, banner);
    drawCornerNails(ctx, banner);

    ctx.restore();
  }

  function drawBannerShadow(ctx, banner) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, .26)";
    drawBannerPath(ctx, banner, 6, 7);
    ctx.fill();
    ctx.restore();
  }

  function drawSponsorImage(ctx, image, banner) {
    ctx.save();
    drawBannerPath(ctx, banner);
    ctx.clip();

    if (image && image.complete && image.naturalWidth > 0) {
      drawSaggingImage(ctx, image, banner);
    } else {
      ctx.fillStyle = "rgba(36, 32, 25, .92)";
      ctx.fillRect(0, 0, banner.width, banner.height + banner.sag);
      ctx.fillStyle = "#fff7df";
      ctx.font = "700 25px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Kyläsauna", banner.width / 2, banner.height / 2 + banner.sag / 2);
    }

    ctx.restore();
  }

  function drawSaggingImage(ctx, image, banner) {
    const strips = 72;
    const sourceStep = image.naturalWidth / strips;
    const destStep = banner.width / strips;

    for (let i = 0; i < strips; i++) {
      const x = i * destStep;
      const t = (i + .5) / strips;
      const top = topSag(banner, t);
      const bottom = banner.height + bottomSag(banner, t);

      ctx.drawImage(
        image,
        i * sourceStep,
        0,
        sourceStep + .8,
        image.naturalHeight,
        x,
        top,
        destStep + .8,
        bottom - top
      );
    }
  }

  function drawFabricTexture(ctx, banner) {
    ctx.save();
    drawBannerPath(ctx, banner);
    ctx.clip();

    const shade = ctx.createLinearGradient(0, 0, 0, banner.height + banner.sag);
    shade.addColorStop(0, "rgba(255, 255, 255, .14)");
    shade.addColorStop(.26, "rgba(255, 255, 255, .02)");
    shade.addColorStop(.62, "rgba(0, 0, 0, .12)");
    shade.addColorStop(1, "rgba(0, 0, 0, .22)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, banner.width, banner.height + banner.sag);

    for (let i = 0; i < 6; i++) {
      const t = (i + 1) / 7;
      const x = banner.width * t;
      const fold = Math.sin(t * Math.PI * 2.6) * 4;

      ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.16)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x, topSag(banner, t) + 4);
      ctx.bezierCurveTo(
        x + fold,
        banner.height * .32,
        x - fold,
        banner.height * .68,
        x + fold * .5,
        banner.height + bottomSag(banner, t) - 4
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawBannerEdge(ctx, banner) {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, .72)";
    ctx.lineWidth = 2.4;
    drawBannerPath(ctx, banner);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 238, 185, .18)";
    ctx.lineWidth = 1.2;
    drawBannerPath(ctx, banner, 1, 1);
    ctx.stroke();
    ctx.restore();
  }

  function drawCornerNails(ctx, banner) {
    ctx.save();
    [8, banner.width - 8].forEach((x) => {
      ctx.fillStyle = "rgba(0, 0, 0, .32)";
      ctx.beginPath();
      ctx.arc(x + 2, 8, 5.5, 0, Math.PI * 2);
      ctx.fill();

      const nail = ctx.createRadialGradient(x - 1, 5, 1, x, 7, 5.2);
      nail.addColorStop(0, "#fff0bd");
      nail.addColorStop(.42, "#c8964f");
      nail.addColorStop(1, "#5a3217");
      ctx.fillStyle = nail;
      ctx.beginPath();
      ctx.arc(x, 7, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(33, 16, 6, .88)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawBannerPath(ctx, banner, offsetX = 0, offsetY = 0) {
    const x = offsetX;
    const y = offsetY;
    const width = banner.width;
    const height = banner.height;
    const sag = banner.sag;

    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.bezierCurveTo(x + width * .25, y + sag * 1.25, x + width * .75, y + sag * 1.25, x + width, y + 2);
    ctx.lineTo(x + width, y + height + 1);
    ctx.bezierCurveTo(
      x + width * .75,
      y + height + sag * .95,
      x + width * .25,
      y + height + sag * .95,
      x,
      y + height + 1
    );
    ctx.closePath();
  }

  function topSag(banner, t) {
    return Math.sin(t * Math.PI) * banner.sag;
  }

  function bottomSag(banner, t) {
    return Math.sin(t * Math.PI) * banner.sag * .72;
  }

  SaunaTim.render.sponsors = {
    drawSponsors
  };
})(window.SaunaTim = window.SaunaTim || {});
