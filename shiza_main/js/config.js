// js/config.js
export const CANVAS_ID = "gameCanvas";

export const PLAYER_SPEED = 300;
export const ENEMY_SPAWN_INTERVAL = 1.0;





export const BULLET = {
  SPEED_MIN: 600,
  SPEED_MAX: 900,
  BASE_H: 4,
  H_CAP: 14,
};

export const ENERGY = { MAX:100, REGEN:25, COST:15 };
export const SP     = { MAX:100, REGEN:20, COST:{ "貫":10,"拡":10,"時":100,"波":60,"爆":40,"導":5 } };

export const ENEMY_COLORS = { basic:"#69b3ff", scout:"#5af58f", carrier:"#ffcf5a" };

export const HOMING = {
  TURN: Math.PI * 3.0,
  ACC: 1400,
  MAX: 1100,
  RELOCK: 0.12,
};

export const MAGNET = { KEY:"KeyF", ACC:1800, MAX:900, FRICTION:0.9 };
export const TIME_SLOW = { FACTOR:0.2, DUR:2.0 };
export const ITEM_TYPES = { speedUp:"SPEED_UP", bulletUp:"BULLET_UP", bulletThick:"BULLET_THICK" };
export const DROP_TABLE = { basic: ITEM_TYPES.speedUp, scout: ITEM_TYPES.bulletUp, carrier: ITEM_TYPES.bulletThick };
