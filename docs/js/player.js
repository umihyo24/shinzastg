// js/player.js
import { PLAYER_SPEED } from "./config.js";

const playerImg = { idle:new Image(), boost:new Image() };
playerImg.idle.src  = "assets/base_idle.png";
playerImg.boost.src = "assets/base_boost.png";

export function createPlayer(canvas){
  return { x:50, y:canvas.height/2-10, w:48, h:48, speed:PLAYER_SPEED, boosting:false };
}

export function updatePlayer(p, dt, keys, canvas){
  if (keys["ArrowUp"])    p.y -= p.speed*dt;
  if (keys["ArrowDown"])  p.y += p.speed*dt;
  if (keys["ArrowLeft"])  p.x -= p.speed*dt;
  if (keys["ArrowRight"]) p.x += p.speed*dt;
  p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));
  p.y = Math.max(0, Math.min(canvas.height - p.h, p.y));
  p.boosting = !!keys["Space"];
}

export function drawPlayer(ctx, p){
  const img = p.boosting ? playerImg.boost : playerImg.idle;
  if (img.complete && img.naturalWidth>0) 
    ctx.drawImage(img, p.x|0, p.y|0, p.w, p.h);
  else { 
    ctx.fillStyle="#ff4d6d"; 
    ctx.fillRect(p.x, p.y, p.w, p.h); }
}
