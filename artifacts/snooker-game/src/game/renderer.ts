import { Ball } from './types';
import {
  TABLE_WIDTH, TABLE_HEIGHT, BALL_RADIUS, POCKET_RADIUS,
  CUSHION_WIDTH, PLAYFIELD_X, PLAYFIELD_Y, PLAYFIELD_W, PLAYFIELD_H,
  POCKET_POSITIONS, BALL_COLORS, BAULK_LINE_X, D_RADIUS,
  COLOURED_BALL_SPOTS,
} from './constants';

export function renderTable(
  ctx: CanvasRenderingContext2D,
  balls: Ball[],
  aimAngle: number,
  power: number,
  phase: string,
  mouseX: number,
  mouseY: number,
  ghostBallX: number,
  ghostBallY: number,
  showAimLine: boolean,
  cueBallPlaceable: boolean,
  scaleX: number,
  scaleY: number
) {
  ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

  ctx.fillStyle = '#1a472a';
  ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

  ctx.fillStyle = '#2d6a3f';
  ctx.fillRect(PLAYFIELD_X, PLAYFIELD_Y, PLAYFIELD_W, PLAYFIELD_H);

  ctx.strokeStyle = '#1a8c45';
  ctx.lineWidth = 1;
  for (let x = PLAYFIELD_X; x <= PLAYFIELD_X + PLAYFIELD_W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, PLAYFIELD_Y);
    ctx.lineTo(x, PLAYFIELD_Y + PLAYFIELD_H);
    ctx.stroke();
  }
  for (let y = PLAYFIELD_Y; y <= PLAYFIELD_Y + PLAYFIELD_H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(PLAYFIELD_X, y);
    ctx.lineTo(PLAYFIELD_X + PLAYFIELD_W, y);
    ctx.stroke();
  }

  drawCushions(ctx);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(BAULK_LINE_X, PLAYFIELD_Y);
  ctx.lineTo(BAULK_LINE_X, PLAYFIELD_Y + PLAYFIELD_H);
  ctx.stroke();
  ctx.setLineDash([]);

  const cy = PLAYFIELD_Y + PLAYFIELD_H / 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(BAULK_LINE_X, cy, D_RADIUS, -Math.PI / 2, Math.PI / 2, false);
  ctx.stroke();

  for (const id of Object.keys(COLOURED_BALL_SPOTS)) {
    const spot = COLOURED_BALL_SPOTS[id];
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const pocket of POCKET_POSITIONS) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, POCKET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, POCKET_RADIUS + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  const cueBall = balls.find(b => b.id === 'cue' && b.onTable && !b.potted);

  if (phase === 'aiming' && cueBall && showAimLine) {
    drawAimLine(ctx, cueBall.x, cueBall.y, aimAngle, power, balls);
  }

  if (phase === 'placing_cue_ball') {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(BAULK_LINE_X, PLAYFIELD_Y);
    ctx.lineTo(BAULK_LINE_X, PLAYFIELD_Y + PLAYFIELD_H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = cueBallPlaceable ? 'rgba(255,255,255,0.4)' : 'rgba(255,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const ball of balls) {
    if (!ball.onTable || ball.potted) continue;
    drawBall(ctx, ball);
  }

  if (phase === 'aiming' && cueBall) {
    drawCue(ctx, cueBall.x, cueBall.y, aimAngle, power);
  }
}

function drawCushions(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#4a2e10';
  const w = CUSHION_WIDTH;
  const corners = POCKET_RADIUS + 8;

  ctx.beginPath();
  ctx.moveTo(corners, 0);
  ctx.lineTo(TABLE_WIDTH / 2 - POCKET_RADIUS, 0);
  ctx.lineTo(TABLE_WIDTH / 2 - POCKET_RADIUS, w);
  ctx.lineTo(corners, w);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(TABLE_WIDTH / 2 + POCKET_RADIUS, 0);
  ctx.lineTo(TABLE_WIDTH - corners, 0);
  ctx.lineTo(TABLE_WIDTH - corners, w);
  ctx.lineTo(TABLE_WIDTH / 2 + POCKET_RADIUS, w);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(corners, TABLE_HEIGHT);
  ctx.lineTo(TABLE_WIDTH / 2 - POCKET_RADIUS, TABLE_HEIGHT);
  ctx.lineTo(TABLE_WIDTH / 2 - POCKET_RADIUS, TABLE_HEIGHT - w);
  ctx.lineTo(corners, TABLE_HEIGHT - w);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(TABLE_WIDTH / 2 + POCKET_RADIUS, TABLE_HEIGHT);
  ctx.lineTo(TABLE_WIDTH - corners, TABLE_HEIGHT);
  ctx.lineTo(TABLE_WIDTH - corners, TABLE_HEIGHT - w);
  ctx.lineTo(TABLE_WIDTH / 2 + POCKET_RADIUS, TABLE_HEIGHT - w);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, corners);
  ctx.lineTo(w, corners);
  ctx.lineTo(w, TABLE_HEIGHT - corners);
  ctx.lineTo(0, TABLE_HEIGHT - corners);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(TABLE_WIDTH, corners);
  ctx.lineTo(TABLE_WIDTH - w, corners);
  ctx.lineTo(TABLE_WIDTH - w, TABLE_HEIGHT - corners);
  ctx.lineTo(TABLE_WIDTH, TABLE_HEIGHT - corners);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#3a1e08';
  ctx.lineWidth = 2;
  const outer = 6;
  ctx.strokeRect(outer, outer, TABLE_WIDTH - outer * 2, TABLE_HEIGHT - outer * 2);
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  const color = BALL_COLORS[ball.type] || '#888';

  const gradient = ctx.createRadialGradient(
    ball.x - BALL_RADIUS * 0.3, ball.y - BALL_RADIUS * 0.3, BALL_RADIUS * 0.1,
    ball.x, ball.y, BALL_RADIUS
  );
  gradient.addColorStop(0, lightenColor(color, 60));
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, darkenColor(color, 40));

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(ball.x - BALL_RADIUS * 0.3, ball.y - BALL_RADIUS * 0.3, BALL_RADIUS * 0.25, 0, Math.PI * 2);
  ctx.fill();

  if (ball.type !== 'cue') {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `bold ${BALL_RADIUS * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = ball.type === 'red' ? '' : ball.type[0].toUpperCase();
    ctx.fillText(label, ball.x, ball.y + 1);
  }
}

function drawAimLine(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  power: number,
  balls: Ball[]
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  let hitX = cx;
  let hitY = cy;
  let hitDist = Infinity;

  for (const ball of balls) {
    if (!ball.onTable || ball.potted || ball.type === 'cue') continue;
    const ex = ball.x - cx;
    const ey = ball.y - cy;
    const proj = ex * dx + ey * dy;
    if (proj <= 0) continue;
    const perpSq = (ex * ex + ey * ey) - proj * proj;
    const minDist = BALL_RADIUS * 2;
    if (perpSq > minDist * minDist) continue;
    const dist = proj - Math.sqrt(minDist * minDist - perpSq);
    if (dist < hitDist && dist > 0) {
      hitDist = dist;
      hitX = cx + dx * dist;
      hitY = cy + dy * dist;
    }
  }

  const maxLineDist = Math.min(hitDist, 500);

  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = 'rgba(255, 255, 200, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + dx * maxLineDist, cy + dy * maxLineDist);
  ctx.stroke();
  ctx.setLineDash([]);

  if (hitDist < 500) {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    const nx = (hitY - cy) / hitDist;
    const ny = -(hitX - cx) / hitDist;
    const ballDx = hitX - balls.find(b => b.onTable && !b.potted && b.type !== 'cue' &&
      Math.hypot(b.x - hitX, b.y - hitY) < BALL_RADIUS * 2 + 1)?.x!;
    ctx.beginPath();
    ctx.arc(hitX, hitY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawCue(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  power: number
) {
  const pullBack = 30 + power * 0.5;
  const cueLength = 220;
  const startX = cx - Math.cos(angle) * (BALL_RADIUS + pullBack);
  const startY = cy - Math.sin(angle) * (BALL_RADIUS + pullBack);
  const endX = startX - Math.cos(angle) * cueLength;
  const endY = startY - Math.sin(angle) * cueLength;

  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, '#f0c87a');
  gradient.addColorStop(0.3, '#c8922a');
  gradient.addColorStop(1, '#7a4a10');

  ctx.save();
  ctx.lineWidth = 6;
  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX - Math.cos(angle) * 30, startY - Math.sin(angle) * 30);
  ctx.stroke();
  ctx.restore();
}

function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
}

function darkenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
}
