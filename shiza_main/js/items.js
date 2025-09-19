// js/items.js
import { ITEM_TYPES, MAGNET } from "./config.js";

export function spawnItem(items, x, y, type){
  const s=14; items.push({ x:x-s/2, y:y-s/2, w:s, h:s, type, vx:0, vy:0 });
}

export function updateItems(items, dt, player, keys, onPickup){
  const magnet = !!keys[MAGNET.KEY];
  const pcx = player.x + player.w/2, pcy = player.y + player.h/2;
  for (let i=items.length-1;i>=0;i--){
    const it=items[i];
    if (magnet){
      const icx=it.x+it.w/2, icy=it.y+it.h/2;
      let dx=pcx-icx, dy=pcy-icy; const d=Math.hypot(dx,dy)||1; dx/=d; dy/=d;
      it.vx += dx*MAGNET.ACC*dt; it.vy += dy*MAGNET.ACC*dt;
      const sp=Math.hypot(it.vx,it.vy); if (sp>MAGNET.MAX){ it.vx=it.vx/sp*MAGNET.MAX; it.vy=it.vy/sp*MAGNET.MAX; }
    }else{ it.vx*=MAGNET.FRICTION; it.vy*=MAGNET.FRICTION; }
    it.x += it.vx*dt; it.y += it.vy*dt;

    // 取得
    if (rectsOverlap(player,it)){ onPickup(it.type); items.splice(i,1); }
  }
}
export function drawItems(ctx, items){
  for (const it of items){
    ctx.fillStyle = it.type===ITEM_TYPES.speedUp?"#69b3ff":it.type===ITEM_TYPES.bulletUp?"#5af58f":it.type===ITEM_TYPES.bulletThick?"#ffcf5a":"#ff9f1c";
    const cx=it.x+it.w/2, cy=it.y+it.h/2, r=Math.min(it.w,it.h)/2;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }
}
function rectsOverlap(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
