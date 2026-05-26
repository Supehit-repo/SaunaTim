(function (SaunaTim) {
  function drawProps(ctx) {
    drawHandLadle(ctx, 200, 454, 253, 419, -0.36);
    drawHandLadle(ctx, 1052, 454, 995, 419, 0.36);
  }

  function drawHandLadle(ctx, handX, handY, bowlX, bowlY, rotation) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(31,15,7,.75)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(handX + 2, handY + 2);
    ctx.lineTo(bowlX + 2, bowlY + 2);
    ctx.stroke();

    ctx.strokeStyle = "#b97736";
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(bowlX, bowlY);
    ctx.stroke();

    ctx.translate(bowlX, bowlY);
    ctx.rotate(rotation);
    ctx.fillStyle = "#b46b31";
    ctx.strokeStyle = "#27140a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#7bdfff";
    ctx.beginPath();
    ctx.ellipse(0, -2, 12, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  SaunaTim.render.props = {
    drawProps
  };
})(window.SaunaTim = window.SaunaTim || {});
