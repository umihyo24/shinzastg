// js/background.js
import { CANVAS_ID } from "./config.js";

const bgBack = new Image(); bgBack.src = "assets/space_back.png";
const bgFront = new Image(); bgFront.src = "assets/space_front.png";

const state = { xBack:0, xFront:0, speedBack:40, speedFront:120 };

export function drawBackground(ctx, dt) {  
  const canvas = ctx.canvas;   // これで十分
  state.xBack  -= state.speedBack  * dt;
  state.xFront -= state.speedFront * dt;
  if (state.xBack  <= -canvas.width)  state.xBack  = 0;
  if (state.xFront <= -canvas.width)  state.xFront = 0;

  if (bgBack.complete) {
    ctx.drawImage(bgBack,  state.xBack, 0, canvas.width, canvas.height);
    ctx.drawImage(bgBack,  state.xBack + canvas.width, 0, canvas.width, canvas.height);
  }
  if (bgFront.complete) {
    ctx.drawImage(bgFront, state.xFront, 0, canvas.width, canvas.height);
    ctx.drawImage(bgFront, state.xFront + canvas.width, 0, canvas.width, canvas.height);
  }
}