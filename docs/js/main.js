// js/main.js — コメント付き解説版

import { CANVAS_ID, ENERGY, SP, DROP_TABLE } from "./config.js";
import { initHudRefs, updateHudPanel } from "./hud.js";
import { drawBackground } from "./background.js";

import { createKeys } from "./input.js";
import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { spawnEnemy, updateEnemies, drawEnemies } from "./enemies.js";
import { spawnItem, updateItems, drawItems } from "./items.js";
import { spawnBasic, updateBullets, drawBullets, handleBulletEnemyHit } from "./bullets.js";
import { createStage, updateStage } from "./stage.js";
import { STAGE1 } from "./stages/stage1.js";

console.log("[main] loaded");

const canvas = document.getElementById(CANVAS_ID);
if (!canvas) {
  console.error("[main] canvas not found:", CANVAS_ID);
} else {
  // 2Dコンテキスト取得（alpha: false で背景透明を無効化 → 黒塗り背景を前提に）
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false; // ドット絵をぼかさない設定

  // CSSサイズに追従してキャンバス内部のピクセルサイズを更新
  function fitCanvas() {
    canvas.width  = canvas.clientWidth  || 800;
    canvas.height = canvas.clientHeight || 600;
  }
  window.addEventListener("resize", fitCanvas);
  fitCanvas();

  // ===== ゲームの状態管理 =====
  const keys = createKeys();       // キー入力管理
  const player  = createPlayer(canvas); // プレイヤー生成
  const bullets = [];              // 弾リスト
  const enemies = [];              // 敵リスト
  const items   = [];              // アイテムリスト

  let energy = ENERGY.MAX; // エネルギー（MPみたいなリソース）
  let sp     = SP.MAX;     // SP（スキルポイント的リソース）

  // ===== 武器切り替え =====
  let currentWeapon = "BASIC";
  function rotateWeapon(dir){
    const list = ["BASIC","貫","拡","波","爆","導","時"]; // 武器一覧
    const i = list.indexOf(currentWeapon);
    currentWeapon = list[(i + dir + list.length) % list.length];
  }
  // HUD初期化（←ボタンで前武器, →ボタンで次武器）
  const hud = initHudRefs(
    () => rotateWeapon(-1),
    () => rotateWeapon(+1)
  );

  // ===== ステージ管理 =====
  const stage = createStage(STAGE1);

  // ===== アイテムドロップ処理 =====
  function onPickupItem(type) {
    // TODO: アイテム取得時の実際の効果（移動速度/弾速度/太さなど）を反映する
  }
  function dropFromEnemy(e) {
    const type = DROP_TABLE[e.kind];
    if (!type) return; // ドロップテーブルにない敵なら終了
    const cx = e.x + e.w / 2;
    const cy = e.y + e.h / 2;
    spawnItem(items, cx, cy, type); // 敵の中心座標にアイテム生成
  }

  // ===== メインループ =====
  let last = 0; // 前フレームのタイムスタンプ
  function loop(t) {
    if (!last) last = t;
    const dt = Math.min((t - last) / 1000, 0.05); // 経過時間 (秒)
    last = t;

    // 毎フレームの副作用をリセット
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 画面初期化（黒塗り） + 背景描画
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, dt);

    // --- 更新処理 ---
    updateStage(stage, dt, { spawnEnemy: (k) => spawnEnemy(enemies, canvas, k) });
    updatePlayer(player, dt, keys, canvas);
    updateBullets(bullets, dt, canvas);
    updateEnemies(enemies, dt);
    handleBulletEnemyHit(bullets, enemies, dropFromEnemy);
    updateItems(items, dt, player, keys, onPickupItem);

    // --- 描画処理（重なり順に注意）---
    drawPlayer(ctx, player);
    drawBullets(ctx, bullets);
    drawEnemies(ctx, enemies);
    drawItems(ctx, items);

    // HUD更新（リソース自動回復込み）
    energy = Math.min(ENERGY.MAX, energy + ENERGY.REGEN * dt);
    sp     = Math.min(SP.MAX,     sp     + SP.REGEN     * dt);
    updateHudPanel(hud, {
      energy, ENERGY_MAX: ENERGY.MAX,
      SP: sp, SP_MAX: SP.MAX,
      weapon: currentWeapon, spReady: true,
      buffs: { spd: 0, bspd: 0, thick: 0 },
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // ===== 一時操作: スペースキーで通常弾を撃つ =====
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") spawnBasic(bullets, player);
  });
}
