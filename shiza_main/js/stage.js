// js/stage.js
export function createStage(def){ return { def, t:0, cursor:0, waveTick:0, spawned:0 }; }

export function updateStage(stage, dt, env){
  stage.t += dt;
  const tl = stage.def.timeline;
  while (stage.cursor < tl.length && stage.t >= tl[stage.cursor].t){
    const ev = tl[stage.cursor];
    if (ev.type==="wave"){
      // 1体ずつ time-sliced spawn
      stage.wave = { ...ev, left: ev.count, timer:0 };
    }
    stage.cursor++;
  }
  // 進行中のwave
  if (stage.wave){
    stage.wave.timer += dt;
    if (stage.wave.timer >= stage.wave.every && stage.wave.left>0){
      stage.wave.timer = 0; stage.wave.left--;
      env.spawnEnemy(evKind(stage.wave.kind));
      if (stage.wave.left===0) stage.wave = null;
    }
  }
}
function evKind(k){ return k; }
