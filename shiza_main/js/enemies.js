// js/enemies.js
import { ENEMY_COLORS, ENEMY_SPAWN_INTERVAL } from "./config.js";

export function spawnEnemy(arr, canvas){
  const r=Math.random(); const kind = r<0.45?"basic":(r<0.8?"scout":"carrier");
  const size = kind==="carrier"?24:20;
  arr.push({ x:canvas.width, y:Math.random()*(canvas.height-size), w:size, h:size, speed:180+120*Math.random(), kind });
}

export function updateEnemies(enemies, dt){
  for (let i=enemies.length-1;i>=0;i--){
    const e=enemies[i]; e.x -= e.speed*dt; if (e.x+e.w<0) enemies.splice(i,1);
  }
}

export function drawEnemies(ctx, enemies){
  for (const e of enemies){ ctx.fillStyle = ENEMY_COLORS[e.kind]||"#fff"; ctx.fillRect(e.x,e.y,e.w,e.h); }
}
