// js/input.js
export function createKeys(){
  const keys = {};
  document.addEventListener("keydown", e => { keys[e.code]=true; });
  document.addEventListener("keyup",   e => { keys[e.code]=false; });
  return keys;
}
