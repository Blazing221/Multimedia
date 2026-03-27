import { Ball, GameState } from './types';
import {
  BALL_RADIUS,
  PLAYFIELD_X, PLAYFIELD_Y, PLAYFIELD_W, PLAYFIELD_H,
  BAULK_LINE_X, D_RADIUS,
  COLOURED_BALL_SPOTS,
} from './constants';

function makeBall(id: string, type: Ball['type'], x: number, y: number): Ball {
  return { id, type, x, y, vx: 0, vy: 0, potted: false, onTable: true };
}

export function createInitialBalls(): Ball[] {
  const balls: Ball[] = [];

  const cueX = BAULK_LINE_X - BALL_RADIUS * 2;
  const cueY = PLAYFIELD_Y + PLAYFIELD_H / 2;
  balls.push(makeBall('cue', 'cue', cueX, cueY));

  const pinkSpotX = COLOURED_BALL_SPOTS.pink.x;
  const pinkSpotY = COLOURED_BALL_SPOTS.pink.y;
  const rowSpacing = BALL_RADIUS * 2 + 0.5;
  const colSpacing = BALL_RADIUS * 2 + 0.5;
  const redStart = pinkSpotX + rowSpacing * 1.5;

  let redId = 0;
  const rows = [1, 2, 3, 4, 5];
  for (let row = 0; row < rows.length; row++) {
    const count = rows[row];
    const rx = redStart + row * colSpacing;
    for (let col = 0; col < count; col++) {
      const ry = pinkSpotY - ((count - 1) / 2) * rowSpacing + col * rowSpacing;
      balls.push(makeBall(`red-${redId++}`, 'red', rx, ry));
    }
  }

  for (const [type, spot] of Object.entries(COLOURED_BALL_SPOTS)) {
    balls.push(makeBall(type, type as Ball['type'], spot.x, spot.y));
  }

  return balls;
}

function emptyStats() {
  return { shotsTaken: 0, ballsPotted: 0, highestBreak: 0, fouls: 0 };
}

export function createInitialState(): GameState {
  return {
    balls: createInitialBalls(),
    phase: 'aiming',
    currentPlayer: 0,
    players: [
      { name: 'Neal Bhavsar', score: 0 },
      { name: 'Player 2', score: 0 },
    ],
    targetBall: 'red',
    redsRemaining: 15,
    inBreak: false,
    breakScore: 0,
    lastPottedColour: null,
    message: "Neal Bhavsar's turn — Pot a red ball",
    foul: false,
    foulPoints: 0,
    winner: null,
    frameOver: false,
    shotPlayed: false,
    firstBallHit: null,
    redPottedThisShot: false,
    colourPottedThisShot: null,
    stats: [emptyStats(), emptyStats()],
  };
}
