// js/debug.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 原点マーカー
  ctx.fillStyle = "red";
  ctx.fillRect(5, 5, 4, 4);

  // 仮プレイヤー
  ctx.fillStyle = "white";
  ctx.fillRect(50, canvas.height / 2 - 10, 20, 20);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
