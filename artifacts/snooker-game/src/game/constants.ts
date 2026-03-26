export const TABLE_WIDTH = 1800;
export const TABLE_HEIGHT = 900;
export const BALL_RADIUS = 18;
export const POCKET_RADIUS = 32;
export const CUSHION_WIDTH = 40;

export const FRICTION = 0.985;
export const SPIN_FRICTION = 0.92;
export const MIN_SPEED = 0.08;
export const CUE_BALL_SPEED_MULTIPLIER = 14;

export const PLAYFIELD_X = CUSHION_WIDTH;
export const PLAYFIELD_Y = CUSHION_WIDTH;
export const PLAYFIELD_W = TABLE_WIDTH - 2 * CUSHION_WIDTH;
export const PLAYFIELD_H = TABLE_HEIGHT - 2 * CUSHION_WIDTH;

export const BAULK_LINE_X = PLAYFIELD_X + PLAYFIELD_W * 0.206;
export const D_RADIUS = PLAYFIELD_H * 0.163;

export const POCKET_POSITIONS = [
  { x: PLAYFIELD_X, y: PLAYFIELD_Y },
  { x: PLAYFIELD_X + PLAYFIELD_W / 2, y: PLAYFIELD_Y - 6 },
  { x: PLAYFIELD_X + PLAYFIELD_W, y: PLAYFIELD_Y },
  { x: PLAYFIELD_X, y: PLAYFIELD_Y + PLAYFIELD_H },
  { x: PLAYFIELD_X + PLAYFIELD_W / 2, y: PLAYFIELD_Y + PLAYFIELD_H + 6 },
  { x: PLAYFIELD_X + PLAYFIELD_W, y: PLAYFIELD_Y + PLAYFIELD_H },
];

export const BALL_COLORS: Record<string, string> = {
  cue: '#FFFFFF',
  red: '#CC0000',
  yellow: '#FFD700',
  green: '#228B22',
  brown: '#8B4513',
  blue: '#0047AB',
  pink: '#FF69B4',
  black: '#1a1a1a',
};

export const BALL_POINTS: Record<string, number> = {
  red: 1,
  yellow: 2,
  green: 3,
  brown: 4,
  blue: 5,
  pink: 6,
  black: 7,
};

export const COLOURED_BALL_SPOTS: Record<string, { x: number; y: number }> = {
  yellow: { x: BAULK_LINE_X, y: PLAYFIELD_Y + PLAYFIELD_H / 2 - D_RADIUS },
  green: { x: BAULK_LINE_X, y: PLAYFIELD_Y + PLAYFIELD_H / 2 + D_RADIUS },
  brown: { x: BAULK_LINE_X, y: PLAYFIELD_Y + PLAYFIELD_H / 2 },
  blue: { x: PLAYFIELD_X + PLAYFIELD_W / 2, y: PLAYFIELD_Y + PLAYFIELD_H / 2 },
  pink: { x: PLAYFIELD_X + PLAYFIELD_W * 0.745, y: PLAYFIELD_Y + PLAYFIELD_H / 2 },
  black: { x: PLAYFIELD_X + PLAYFIELD_W * 0.909, y: PLAYFIELD_Y + PLAYFIELD_H / 2 },
};
