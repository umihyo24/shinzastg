// js/hud.js
export function initHudRefs(onPrev, onNext){
  const g = (id)=>document.getElementById(id);
  const refs = {
    weapon: g("hudWeapon"),
    energy: g("hudEnergy"),
    energyText: g("hudEnergyText"),
    sp: g("hudSP"),
    spText: g("hudSPText"),
    buffSPD: g("buffSPD"),
    buffBSPD: g("buffBSPD"),
    buffTHICK: g("buffTHICK"),
  };
  const prev = g("btnPrevW"), next = g("btnNextW");
  if (prev) prev.addEventListener("click", onPrev);
  if (next) next.addEventListener("click", onNext);
  return refs;
}

export function updateHudPanel(hud, s){
  // s: {energy, ENERGY_MAX, SP, SP_MAX, weapon, spReady, buffs:{spd,bspd,thick}}
  hud.energy.style.width = `${(s.energy/s.ENERGY_MAX)*100}%`;
  hud.energyText.textContent = `${Math.round(s.energy)}/${s.ENERGY_MAX}`;
  hud.sp.style.width = `${(s.SP/s.SP_MAX)*100}%`;
  hud.spText.textContent = `${Math.round(s.SP)}/${s.SP_MAX}`;
  hud.weapon.textContent = s.weapon;
  hud.buffSPD.textContent   = `x${s.buffs.spd}`;
  hud.buffBSPD.textContent  = `x${s.buffs.bspd}`;
  hud.buffTHICK.textContent = `x${s.buffs.thick}`;
}
