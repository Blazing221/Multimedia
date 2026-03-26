import { Ball } from './types';
import { BALL_RADIUS, POCKET_POSITIONS, POCKET_RADIUS, CUSHION_WIDTH, TABLE_WIDTH, TABLE_HEIGHT, PLAYFIELD_X, PLAYFIELD_Y, PLAYFIELD_W, PLAYFIELD_H, FRICTION, MIN_SPEED } from './constants';

export function stepPhysics(balls: Ball[], dt: number): {
  pottedIds: string[];
  anyMoving: boolean;
  firstHitId: string | null;
} {
  const activeBalls = balls.filter(b => b.onTable && !b.potted);
  let pottedIds: string[] = [];
  let firstHitId: string | null = null;

  for (let step = 0; step < 4; step++) {
    for (const ball of activeBalls) {
      ball.x += ball.vx * dt * 0.25;
      ball.y += ball.vy * dt * 0.25;
    }

    for (let i = 0; i < activeBalls.length; i++) {
      for (let j = i + 1; j < activeBalls.length; j++) {
        const a = activeBalls[i];
        const b = activeBalls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = BALL_RADIUS * 2;

        if (dist < minDist && dist > 0.001) {
          const cueBallId = a.type === 'cue' ? a.id : b.type === 'cue' ? b.id : null;
          const otherId = cueBallId === a.id ? b.id : a.id;
          if (cueBallId && !firstHitId) {
            firstHitId = otherId;
          }

          const nx = dx / dist;
          const ny = dy / dist;

          const overlap = minDist - dist;
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;

          const dvx = b.vx - a.vx;
          const dvy = b.vy - a.vy;
          const dot = dvx * nx + dvy * ny;

          if (dot < 0) {
            const impulse = dot;
            a.vx += impulse * nx;
            a.vy += impulse * ny;
            b.vx -= impulse * nx;
            b.vy -= impulse * ny;
          }
        }
      }
    }

    for (const ball of activeBalls) {
      const left = PLAYFIELD_X + BALL_RADIUS;
      const right = PLAYFIELD_X + PLAYFIELD_W - BALL_RADIUS;
      const top = PLAYFIELD_Y + BALL_RADIUS;
      const bottom = PLAYFIELD_Y + PLAYFIELD_H - BALL_RADIUS;

      let bounced = false;
      if (ball.x < left) {
        ball.x = left;
        ball.vx = Math.abs(ball.vx) * 0.82;
        bounced = true;
      } else if (ball.x > right) {
        ball.x = right;
        ball.vx = -Math.abs(ball.vx) * 0.82;
        bounced = true;
      }
      if (ball.y < top) {
        ball.y = top;
        ball.vy = Math.abs(ball.vy) * 0.82;
        bounced = true;
      } else if (ball.y > bottom) {
        ball.y = bottom;
        ball.vy = -Math.abs(ball.vy) * 0.82;
        bounced = true;
      }
      void bounced;
    }
  }

  for (const ball of activeBalls) {
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;

    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (speed < MIN_SPEED) {
      ball.vx = 0;
      ball.vy = 0;
    }
  }

  for (const ball of activeBalls) {
    for (const pocket of POCKET_POSITIONS) {
      const dx = ball.x - pocket.x;
      const dy = ball.y - pocket.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < POCKET_RADIUS - 4) {
        ball.potted = true;
        ball.onTable = false;
        ball.vx = 0;
        ball.vy = 0;
        pottedIds.push(ball.id);
        break;
      }
    }
  }

  const anyMoving = activeBalls.some(b => !b.potted && (Math.abs(b.vx) > MIN_SPEED || Math.abs(b.vy) > MIN_SPEED));

  return { pottedIds, anyMoving, firstHitId };
}

export function isMoving(balls: Ball[]): boolean {
  return balls.some(b => b.onTable && !b.potted && (Math.abs(b.vx) > MIN_SPEED || Math.abs(b.vy) > MIN_SPEED));
}
