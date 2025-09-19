//js/bullets.js
import { BULLET } from "./config.js";

export function spawnBasic(bullets, player){
  const h = BULLET.BASE_H;
  bullets.push({
    x: player.x + player.w,
    y: player.y + player.h/2 - h/2,
    w: 12, h,
    vx: 700, vy: 0,
    kind: "basic"
  });
}

export function updateBullets(bullets, dt, canvas){
  for (let i = bullets.length - 1; i >= 0; i--){
    const b = bullets[i];
    b.x += (b.vx ?? 700) * dt;
    b.y += (b.vy ??   0) * dt;
    if (b.x > canvas.width || b.y < -40 || b.y > canvas.height + 40){
      bullets.splice(i, 1);
    }
  }
}

export function handleBulletEnemyHit(bullets, enemies, dropCb){
  for (let bi = bullets.length - 1; bi >= 0; bi--){
    const b = bullets[bi];
    for (let ei = enemies.length - 1; ei >= 0; ei--){
      const e = enemies[ei];
      if (!overlap(b, e)) continue;
      dropCb && dropCb(e);
      enemies.splice(ei, 1);
      bullets.splice(bi, 1);
      break;
    }
  }
}

export function drawBullets(ctx, bullets){
  ctx.fillStyle = "#fff176";
  for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);
}

// --- 幅/高さのキーが w/h でも width/height でも通るように
function getW(o){ return (o.w ?? o.width  ?? 0); }
function getH(o){ return (o.h ?? o.height ?? 0); }

function overlap(a, b){
  const aw = getW(a), ah = getH(a);
  const bw = getW(b), bh = getH(b);
  return a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;
}
