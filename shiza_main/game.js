//*データ切り出し用。

// /* =============================
//  * 1) 定数・設定
//  * ============================= */
// // ←最初にこれ
// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false; // ピクセルアートをボケさせない

// // === Player Sprite ===
// const playerImg = {
//   idle: new Image(),
//   boost: new Image(),
// };
// playerImg.idle.src  = "assets/base_idle.png";
// playerImg.boost.src = "assets/base_boost.png";

// let isBoosting = false;   // ブースト中フラグ
// const PLAYER_W = 48;
// const PLAYER_H = 48;

// // === Parallax Background ===
// const bgBack = new Image();
// bgBack.src = "assets/space_back.png";
// const bgFront = new Image();
// bgFront.src = "assets/space_front.png";


// let bgXBack = 0, bgXFront = 0;
// const BG_BACK_SPEED  = 40;   // 奥：ゆっくり
// const BG_FRONT_SPEED = 120;  // 手前：速い

// //キャラ速度
// const PLAYER_SPEED = 300;
// const BULLET_SPEED_MIN = 600;
// const BULLET_SPEED_MAX = 900;
// const ENEMY_SPEED_MIN = 180;
// const ENEMY_SPEED_MAX = 300;
// const ENEMY_SPAWN_INTERVAL = 1.0;

// const BULLET_BASE_HEIGHT = 4;
// const BULLET_HEIGHT_CAP = 14;

// // === Homing（導）調整パラメータ ===
// const HOMING_TURN_RATE = Math.PI * 3.0;   // ぐんぐん曲がる（ラジアン/秒） 例: 540°/s
// const HOMING_ACCEL     = 1400;            // 加速 [px/s^2]
// const HOMING_MAX_SPEED = 1100;            // 最高速度
// const HOMING_RELOCK_DT = 0.12;            // 目標再取得の最短間隔（秒）


// let bulletHeightBonus = 0;

// const ENEMY_COLORS = {
//   basic: "#69b3ff",
//   scout: "#5af58f",
//   carrier: "#ffcf5a",
// };

// const FIRE_RATE_BASE = 6;
// const AUTO_FIRE = true;

// /* アイテム */
// const ITEM_TYPES = { speedUp: "SPEED_UP", bulletUp: "BULLET_UP", bulletThick: "BULLET_THICK" };
// const DROP_TABLE = { basic: ITEM_TYPES.speedUp, scout: ITEM_TYPES.bulletUp, carrier: ITEM_TYPES.bulletThick };

// /* 強化 */
// const PLAYER_SPEED_BONUS_STEP = 50;
// const PLAYER_SPEED_CAP = 500;
// const BULLET_SPEED_BONUS_STEP = 100;
// const BULLET_SPEED_CAP = 1400;
// const BULLET_THICK_BONUS_STEP = 2;
// let bulletSpeedBonus = 0;

// /* マグネット */
// const MAGNET_KEY = "KeyF";
// const MAGNET_ACCEL = 1800;
// const MAGNET_MAX_SPEED = 900;
// const ITEM_FRICTION = 0.9;

// /* エナジー */
// const ENERGY_MAX = 100;
// const ENERGY_REGEN_PER_SEC = 25;
// const ENERGY_COST_PER_SHOT = 15;

// /* 特殊弾 */
// const SPECIAL_AMMO = { 貫: 0, 拡: 0, 時: 0, 波: 0, 爆: 0, 導: 0 };
// const SPECIAL_ORDER = ["BASIC", ...Object.keys(SPECIAL_AMMO)];
// const SP_MAX = 100;
// const SP_REGEN_PER_SEC = 20;
// const SPECIAL_COST = {
//   "貫": 10,
//   "拡": 10,
//   "時": 100,
//   "波": 60,
//   "爆": 40,
//   "導": 5
// };
// let SP = SP_MAX;
// let currentWeapon = "BASIC";

// /* 時止め */
// const TIME_SLOW_FACTOR = 0.2;
// const TIME_SLOW_DURATION = 2.0;
// let timeSlowTimer = 0;

// /* =============================
//  * 2) ステート
//  * ============================= */
// const player = { x: 50, y: canvas.height / 2 - 10, width: 20, height: 20, speed: PLAYER_SPEED };
// const bullets = [];
// const enemies = [];
// const items = [];
// const keys = {};
// let fireTimer = 0;

// let lastTime = 0;
// let spawnElapsed = 0;
// let energy = ENERGY_MAX;

// /* =============================
//  * 3) ユーティリティ
//  * ============================= */
// function randRange(min, max){ return min + Math.random() * (max - min); }
// function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
// function rectsOverlap(a, b) {
//   return a.x < b.x + b.width && a.x + a.width > b.x &&
//          a.y < b.y + b.height && a.y + a.height > b.y;
// }
// function findNearestEnemy(x, y){
//   let best = null, bestD2 = Infinity;
//   for (const e of enemies){
//     const cx = e.x + e.width/2, cy = e.y + e.height/2;
//     const d2 = (cx - x)*(cx - x) + (cy - y)*(cy - y);
//     if (d2 < bestD2){ bestD2 = d2; best = e; }
//   }
//   return best;
// }
// /* =============================
//  * 4) 入力
//  * ============================= */
// /* =============================
//  * 4) 入力（統合・重複削除）
//  * ============================= */
// document.addEventListener("keydown", (e) => {
//   keys[e.code] = true;

//   if (e.code === "KeyQ" || e.code === "KeyE") {
//     e.preventDefault();
//     const dir = e.code === "KeyQ" ? -1 : 1;
//     const idx = SPECIAL_ORDER.indexOf(currentWeapon);
//     currentWeapon = SPECIAL_ORDER[(idx + dir + SPECIAL_ORDER.length) % SPECIAL_ORDER.length];
//     updateHudPanel();
//   }

//   if (e.code === "Space") {
//     e.preventDefault();
//     isBoosting = true;            // 押してる間ブースト絵
//     if (!AUTO_FIRE) shoot();
//   }
// });

// document.addEventListener("keyup", (e) => {
//   keys[e.code] = false;
//   if (e.code === "Space") isBoosting = false;
// });


// function rotateWeapon(dir){
//   const idx = SPECIAL_ORDER.indexOf(currentWeapon);
//   currentWeapon = SPECIAL_ORDER[(idx + dir + SPECIAL_ORDER.length) % SPECIAL_ORDER.length];
//   updateHudPanel();
// }

// const btnPrev = document.getElementById('btnPrevW');
// const btnNext = document.getElementById('btnNextW');

// btnPrev && btnPrev.addEventListener('click', (e)=>{ e.preventDefault(); rotateWeapon(-1); });
// btnNext && btnNext.addEventListener('click', (e)=>{ e.preventDefault(); rotateWeapon(1); });

// /* =============================
//  * 5) 発射処理
//  * ============================= */
// function canFireSpecial(kind){
//   const stock = SPECIAL_AMMO[kind] || 0;
//   const cost  = SPECIAL_COST[kind] || Infinity;
//   return stock > 0 || SP >= cost;
// }
// function consumeSpecial(kind){
//   if ((SPECIAL_AMMO[kind] || 0) > 0){ SPECIAL_AMMO[kind]--; return true; }
//   const cost = SPECIAL_COST[kind] || Infinity;
//   if (SP >= cost){ SP -= cost; return true; }
//   return false;
// }

// function shoot() {
//   if (fireTimer > 0) return;
//   if (currentWeapon !== "BASIC") {
//     if (consumeSpecial(currentWeapon)) {
//       fireSpecial(currentWeapon);
//     } else {
//       if (energy < ENERGY_COST_PER_SHOT) return;
//       fireBasic();
//     }
//   } else {
//     if (energy < ENERGY_COST_PER_SHOT) return;
//     fireBasic();
//   }
//   fireTimer = 1 / FIRE_RATE_BASE;
//   updateHudPanel();
// }

// function fireBasic(){
//   energy -= ENERGY_COST_PER_SHOT;
//   const h = Math.min(BULLET_BASE_HEIGHT + bulletHeightBonus, BULLET_HEIGHT_CAP);
//   bullets.push({
//     x: player.x + player.width, y: player.y + player.height/2 - h/2,
//     width: 12, height: h, speed: randRange(BULLET_SPEED_MIN, BULLET_SPEED_MAX),
//     kind: "basic"
//   });
// }

// function fireSpecial(kind){
//   const h = Math.min(BULLET_BASE_HEIGHT + bulletHeightBonus, BULLET_HEIGHT_CAP);

//   if (kind === "貫"){
//     bullets.push({
//       x: player.x + player.width,
//       y: player.y + player.height/2 - h/2,
//       width: 16, height: h, speed: 800, pierce: 3, kind: "貫"
//     });

//   } else if (kind === "拡"){
//     [-140, 0, 140].forEach(vy => {
//       bullets.push({
//         x: player.x + player.width,
//         y: player.y + player.height/2 - h/2,
//         width: 12, height: h, speed: 800, vy, kind: "拡"
//       });
//     });

//   } else if (kind === "波"){
//     bullets.push({
//       x: player.x + player.width,
//       y: player.y + player.height/2 - 56/2,
//       width: 42, height: 56, speed: 700, pierce: 9999, kind: "波"
//     });

//   } else if (kind === "時"){
//     timeSlowTimer = TIME_SLOW_DURATION;

//   } else if (kind === "爆"){
//     bullets.push({
//       x: player.x + player.width,
//       y: player.y + player.height/2 - 20/2,
//       width: 20, height: 20, speed: 600, kind: "爆"
//     });

//   } else if (kind === "導"){
//     const v0 = 700 + bulletSpeedBonus;
//     bullets.push({
//       x: player.x + player.width,
//       y: player.y + player.height/2 - 14/2,
//       width: 14, height: 14,
//       vx: v0, vy: 0,
//       speed: v0,        // 互換用
//       kind: "導",
//       target: null,
//       relockCD: 0
//     });
//   }
// } // ←←← これが無かった。必ず閉じる！

// /* =============================
//  * 6) 敵・衝突
//  * ============================= */
// function spawnEnemy() {
//   const r = Math.random();
//   const kind = r < 0.45 ? "basic" : (r < 0.8 ? "scout" : "carrier");
//   const size = kind === "carrier" ? 24 : 20;
//   enemies.push({ x: canvas.width, y: Math.random()*(canvas.height-size),
//     width:size, height:size, speed:randRange(ENEMY_SPEED_MIN,ENEMY_SPEED_MAX), kind });
// }

// // アイテム生成
// function spawnItem(x, y, type) {
//   const SIZE = 14;
//   items.push({
//     x: x - SIZE / 2,
//     y: y - SIZE / 2,
//     width: SIZE,
//     height: SIZE,
//     type,
//     vx: 0,
//     vy: 0,
//   });
// }

// // 敵を倒したときのドロップ処理
// function dropFromEnemy(e) {
//   const dropType = DROP_TABLE[e.kind];
//   if (dropType) {
//     const cx = e.x + e.width / 2;
//     const cy = e.y + e.height / 2;
//     spawnItem(cx, cy, dropType);
//   }
// }


// function handleCollisions() {
//   for (let bi = bullets.length - 1; bi >= 0; bi--) {
//     const b = bullets[bi];
//     let bulletRemoved = false; // ★ 弾を消したかどうかフラグ

//     for (let ei = enemies.length - 1; ei >= 0; ei--) {
//       const e = enemies[ei];
//       if (!rectsOverlap(b, e)) continue;

//       if (b.kind === "爆") {
//         // 爆風
//         const R = 60;
//         const cx = b.x + b.width / 2;
//         const cy = b.y + b.height / 2;
//         for (let j = enemies.length - 1; j >= 0; j--) {
//           const t = enemies[j];
//           const tx = t.x + t.width / 2;
//           const ty = t.y + t.height / 2;
//           if (Math.hypot(tx - cx, ty - cy) < R) {
//             dropFromEnemy(t);
//             enemies.splice(j, 1);
//           }
//         }
//         bullets.splice(bi, 1);
//         bulletRemoved = true;
//         break;

//       } else if (b.kind === "導") {
//         // ホーミング：1体倒したら弾消滅
//         dropFromEnemy(e);
//         enemies.splice(ei, 1);
//         bullets.splice(bi, 1);
//         bulletRemoved = true;
//         break;

//       } else if (b.pierce && b.pierce > 0) {
//         // 貫通：弾は残す
//         dropFromEnemy(e);
//         enemies.splice(ei, 1);
//         b.pierce -= 1;
//         // ★ この場合は弾を残すので bulletRemoved=false のまま
//         break;

//       } else {
//         // 通常弾
//         dropFromEnemy(e);
//         enemies.splice(ei, 1);
//         bullets.splice(bi, 1);
//         bulletRemoved = true;
//         break;
//       }
//     }

//     // 弾が消えた場合は外側ループを続けずに次の弾へ
//     if (bulletRemoved) continue;
//   }
// }

// // =============================
// // 7) アイテム処理
// // =============================
// function itemColor(type){
//   if (type === ITEM_TYPES.speedUp)     return "#69b3ff"; // プレイヤー速度
//   if (type === ITEM_TYPES.bulletUp)    return "#5af58f"; // 弾速
//   if (type === ITEM_TYPES.bulletThick) return "#ffcf5a"; // 弾太さ
//   return "#ff9f1c";
// }

// function updateItems(dt){
//   const magnet = !!keys[MAGNET_KEY];
//   const pcx = player.x + player.width/2, pcy = player.y + player.height/2;

//   for (let i = items.length - 1; i >= 0; i--){
//     const it = items[i];

//     // 吸引
//     if (magnet){
//       const icx = it.x + it.width/2, icy = it.y + it.height/2;
//       let dx = pcx - icx, dy = pcy - icy;
//       const dist = Math.hypot(dx, dy) || 1;
//       dx/=dist; dy/=dist;
//       it.vx = (it.vx||0) + dx * MAGNET_ACCEL * dt;
//       it.vy = (it.vy||0) + dy * MAGNET_ACCEL * dt;
//       const sp = Math.hypot(it.vx, it.vy);
//       if (sp > MAGNET_MAX_SPEED){
//         it.vx = it.vx / sp * MAGNET_MAX_SPEED;
//         it.vy = it.vy / sp * MAGNET_MAX_SPEED;
//       }
//     }else{
//       it.vx = (it.vx||0) * ITEM_FRICTION;
//       it.vy = (it.vy||0) * ITEM_FRICTION;
//       if (Math.abs(it.vx) < 1) it.vx = 0;
//       if (Math.abs(it.vy) < 1) it.vy = 0;
//     }

//     // 位置更新＋画面内に留める
//     it.x += (it.vx||0) * dt;
//     it.y += (it.vy||0) * dt;
//     if (it.x < 0) it.x = 0;
//     if (it.y < 0) it.y = 0;
//     if (it.x + it.width  > canvas.width)  it.x = canvas.width  - it.width;
//     if (it.y + it.height > canvas.height) it.y = canvas.height - it.height;

//     // 取得判定
//     if (rectsOverlap(player, it)){
//       if (it.type === ITEM_TYPES.speedUp){
//         player.speed = Math.min(player.speed + PLAYER_SPEED_BONUS_STEP, PLAYER_SPEED_CAP);
//       }else if (it.type === ITEM_TYPES.bulletUp){
//         bulletSpeedBonus = Math.min(
//           bulletSpeedBonus + BULLET_SPEED_BONUS_STEP,
//           Math.max(0, BULLET_SPEED_CAP - BULLET_SPEED_MAX)
//         );
//       }else if (it.type === ITEM_TYPES.bulletThick){
//         bulletHeightBonus = Math.min(
//           bulletHeightBonus + BULLET_THICK_BONUS_STEP,
//           Math.max(0, BULLET_HEIGHT_CAP - BULLET_BASE_HEIGHT)
//         );
//       }
//       items.splice(i, 1);
//       updateHudPanel && updateHudPanel();
//     }
//   }
// }

// function drawItems(){
//   for (const it of items){
//     ctx.fillStyle = itemColor(it.type);
//     // シンプルな丸で描画（見やすい）
//     const cx = it.x + it.width/2;
//     const cy = it.y + it.height/2;
//     const r  = Math.min(it.width, it.height) * 0.5;
//     ctx.beginPath();
//     ctx.arc(cx, cy, r, 0, Math.PI*2);
//     ctx.fill();
//   }
// }








// /* =============================
//  * 8) 更新 & 描画
//  * ============================= */
// function update(dt){
//   // プレイヤー移動
//   if (keys["ArrowUp"]) player.y -= player.speed*dt;
//   if (keys["ArrowDown"]) player.y += player.speed*dt;
//   if (keys["ArrowLeft"]) player.x -= player.speed*dt;
//   if (keys["ArrowRight"]) player.x += player.speed*dt;
//   player.x = clamp(player.x,0,canvas.width-player.width);
//   player.y = clamp(player.y,0,canvas.height-player.height);

//   // 発射
//   if (fireTimer>0) fireTimer=Math.max(0,fireTimer-dt);
//   if (AUTO_FIRE && keys["Space"] && fireTimer===0) shoot();

//   // 弾移動
//   for (let i=bullets.length-1;i>=0;i--){
//     const b=bullets[i];
// // --- 導（ホーミング） ステアリング ---
// if (b.kind === "導"){
//   const cx = b.x + b.width/2;
//   const cy = b.y + b.height/2;

//   // 目標再取得（一定間隔ごと）
//   b.relockCD = Math.max(0, (b.relockCD || 0) - dt);
//   if (!b.target || b.relockCD === 0) {
//     b.target = findNearestEnemy(cx, cy) || null;
//     b.relockCD = HOMING_RELOCK_DT;
//   }

//   // 現在速度ベクトル
//   let curVx = (b.vx !== undefined) ? b.vx : (b.speed || 700);
//   let curVy = b.vy || 0;
//   let spd   = Math.hypot(curVx, curVy) || 1;
//   let dirX  = curVx / spd, dirY = curVy / spd;

//   if (b.target){
//     const tx = b.target.x + b.target.width/2;
//     const ty = b.target.y + b.target.height/2;
//     let dx = tx - cx, dy = ty - cy;
//     const dist = Math.hypot(dx, dy) || 1;
//     dx /= dist; dy /= dist; // 目標方向の単位ベクトル

//     // いまの方向と目標方向の角度差
//     const dot = clamp(dirX*dx + dirY*dy, -1, 1);
//     const ang = Math.acos(dot);                 // [0..π]
//     const maxTurn = HOMING_TURN_RATE * dt;      // このフレームで回せる最大角

//     // 角度差が大きくても maxTurn まででスムーズに回す（“ぐん”と曲がる）
//     const t = (ang > 0) ? Math.min(1, maxTurn / ang) : 1;
//     const newDirX = dirX * (1 - t) + dx * t;
//     const newDirY = dirY * (1 - t) + dy * t;
//     const nd = Math.hypot(newDirX, newDirY) || 1;
//     dirX = newDirX / nd; dirY = newDirY / nd;

//     // 加速して最高速まで伸ばす
//     spd = Math.min(HOMING_MAX_SPEED, spd + HOMING_ACCEL * dt);
//   } else {
//     // 目標がいなければ慣性で直進、でも速度は少し伸ばす
//     spd = Math.min(HOMING_MAX_SPEED, spd + (HOMING_ACCEL*0.5) * dt);
//   }

//   b.vx = dirX * spd;
//   b.vy = dirY * spd;
// }



//     const vx=(b.vx!==undefined)?b.vx:b.speed;
//     const vy=b.vy||0;
//     b.x+=vx*dt; b.y+=vy*dt;
//     if (b.x>canvas.width||b.y<-40||b.y>canvas.height+40) bullets.splice(i,1);
//   }

//   // 敵
//   let edt=dt;
//   if (timeSlowTimer>0){ timeSlowTimer=Math.max(0,timeSlowTimer-dt); edt=dt*TIME_SLOW_FACTOR; }
//   spawnElapsed+=edt;
//   if (spawnElapsed>=ENEMY_SPAWN_INTERVAL){ spawnEnemy(); spawnElapsed=0; }
//   for (let i=enemies.length-1;i>=0;i--){ enemies[i].x-=enemies[i].speed*edt; if (enemies[i].x+enemies[i].width<0) enemies.splice(i,1); }

//   // 衝突
//   handleCollisions();
//   updateItems(dt);
//   // エナジー/SP回復
//   energy=Math.min(ENERGY_MAX,energy+ENERGY_REGEN_PER_SEC*dt);
//   SP=Math.min(SP_MAX,SP+SP_REGEN_PER_SEC*dt);

//   updateHudPanel();
// }

// //背景描画関数
// function drawBackground(dt) {
//   // 位置更新
//   bgXBack  -= BG_BACK_SPEED  * dt;
//   bgXFront -= BG_FRONT_SPEED * dt;

//   // ループ（キャンバス幅でループさせる）
//   if (bgXBack  <= -canvas.width) bgXBack  = 0;
//   if (bgXFront <= -canvas.width) bgXFront = 0;

//   // 背景（奥→手前の順で描画）
//   // 奥
//   ctx.drawImage(bgBack,  bgXBack,  0, canvas.width, canvas.height);
//   ctx.drawImage(bgBack,  bgXBack + canvas.width, 0, canvas.width, canvas.height);
//   // 手前
//   ctx.drawImage(bgFront, bgXFront, 0, canvas.width, canvas.height);
//   ctx.drawImage(bgFront, bgXFront + canvas.width, 0, canvas.width, canvas.height);
// }


// function draw(){
// //   ctx.clearRect(0,0,canvas.width,canvas.height);

// //   // 背景を先に描画
// //   drawBackground(1/60); //  
// //  // ← ここでは背景もクリアもしない

// /* draw() の自機描画を置き換え */
//   // 自機
// const img = isBoosting ? playerImg.boost : playerImg.idle;
// if (img.complete && img.naturalWidth > 0) {
//   ctx.drawImage(img, Math.round(player.x), Math.round(player.y), PLAYER_W, PLAYER_H);
// } else {
//   ctx.fillStyle = "#ff4d6d";
//   ctx.fillRect(player.x, player.y, player.width, player.height);
// }

//   // 弾
//   for (const b of bullets){
//     let color="#fff176", sym="•", r=6;
//     if (b.kind==="貫"){ color="#ffa24d"; sym="◆"; }
//     else if (b.kind==="拡"){ color="#ffff66"; sym="✦"; }
//     else if (b.kind==="波"){ color="#66ccff"; sym="⬤"; r=18; }
//     else if (b.kind==="時"){ color="#cc66ff"; sym="✹"; }
//     else if (b.kind==="爆"){ color="#ff3333"; sym="✸"; }
//     else if (b.kind==="導"){ color="#5af58f"; sym="◎"; }

//     ctx.fillStyle=color;
//     ctx.font=`bold ${r*2}px sans-serif`;
//     ctx.textAlign="center"; ctx.textBaseline="middle";
//     ctx.fillText(sym, b.x+b.width/2, b.y+b.height/2);
//   }

//   // 敵
//   for (const e of enemies){ ctx.fillStyle=ENEMY_COLORS[e.kind]||"#fff"; ctx.fillRect(e.x,e.y,e.width,e.height); }

//  // ★追加：アイテムを描画
//   drawItems();

// }

// /* =============================
//  * 9) メインループ
//  * ============================= */
// function gameLoop(time){
//   if (lastTime===0) lastTime=time;
//   let dt=(time-lastTime)/1000; lastTime=time;
//   dt=Math.min(dt,0.05);

//   update(dt);

//   // 背景 → その上にゲームオブジェクト
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   drawBackground(dt);
//   draw();

//   requestAnimationFrame(gameLoop);
// }




// /* =============================
//  * 10) HUD更新
//  * ============================= */
// const hud={
//   weapon:document.getElementById("hudWeapon"),
//   energy:document.getElementById("hudEnergy"),
//   energyText:document.getElementById("hudEnergyText"),
//   sp:document.getElementById("hudSP"),
//   spText:document.getElementById("hudSPText"),
// };
// function updateHudPanel(){
//   hud.energy.style.width=`${(energy/ENERGY_MAX)*100}%`;
//   hud.energyText.textContent=`${Math.round(energy)}/${ENERGY_MAX}`;
//   hud.sp.style.width=`${(SP/SP_MAX)*100}%`;
//   hud.spText.textContent=`${Math.round(SP)}/${SP_MAX}`;
//   hud.weapon.textContent=currentWeapon;
// }

// /* =============================
//  * 11) 起動
//  * ============================= */
// requestAnimationFrame(gameLoop);
