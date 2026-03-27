import { useRef, useEffect, useState, useCallback } from 'react';
import './game.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const TW = 1400, TH = 700;           // table canvas size
const CW = 36;                        // cushion width
const BR = 16;                        // ball radius
const PR = 28;                        // pocket radius
const PX = CW, PY = CW;              // playfield origin
const PW = TW - CW * 2, PH = TH - CW * 2;
const BAULK_X = PX + PW * 0.21;
const D_RAD = PH * 0.16;
const FRICTION = 0.986;
const MIN_SPD = 0.1;

const POCKETS = [
  { x: PX, y: PY }, { x: PX + PW / 2, y: PY - 4 }, { x: PX + PW, y: PY },
  { x: PX, y: PY + PH }, { x: PX + PW / 2, y: PY + PH + 4 }, { x: PX + PW, y: PY + PH },
];

const COLOUR_SPOTS: Record<string, { x: number; y: number }> = {
  yellow: { x: BAULK_X, y: PY + PH / 2 - D_RAD },
  green:  { x: BAULK_X, y: PY + PH / 2 + D_RAD },
  brown:  { x: BAULK_X, y: PY + PH / 2 },
  blue:   { x: PX + PW / 2, y: PY + PH / 2 },
  pink:   { x: PX + PW * 0.74, y: PY + PH / 2 },
  black:  { x: PX + PW * 0.91, y: PY + PH / 2 },
};

const BALL_COLOR: Record<string, string> = {
  cue: '#ffffff', red: '#cc0000', yellow: '#ffd700', green: '#228b22',
  brown: '#8b4513', blue: '#0047ab', pink: '#ff69b4', black: '#222222',
};

const BALL_PTS: Record<string, number> = {
  red: 1, yellow: 2, green: 3, brown: 4, blue: 5, pink: 6, black: 7,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ball { id: string; type: string; x: number; y: number; vx: number; vy: number; out: boolean; }

function ball(id: string, type: string, x: number, y: number): Ball {
  return { id, type, x, y, vx: 0, vy: 0, out: false };
}

// ─── Initial ball layout ─────────────────────────────────────────────────────
function makeBalls(): Ball[] {
  const balls: Ball[] = [];
  balls.push(ball('cue', 'cue', BAULK_X - 80, PY + PH / 2));

  // reds in triangle behind pink spot
  const px = COLOUR_SPOTS.pink.x + BR * 3;
  const py = COLOUR_SPOTS.pink.y;
  let id = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      balls.push(ball(`r${id++}`, 'red',
        px + row * (BR * 2 + 0.5),
        py - row * (BR + 0.25) + col * (BR * 2 + 0.5)
      ));
    }
  }

  for (const [type, spot] of Object.entries(COLOUR_SPOTS)) {
    balls.push(ball(type, type, spot.x, spot.y));
  }
  return balls;
}

// ─── Physics step ────────────────────────────────────────────────────────────
function step(balls: Ball[], firstHitRef: { v: string | null }): string[] {
  const active = balls.filter(b => !b.out);
  const potted: string[] = [];

  for (let s = 0; s < 4; s++) {
    for (const b of active) { b.x += b.vx * 0.25; b.y += b.vy * 0.25; }

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i], b = active[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d < BR * 2 && d > 0.001) {
          // track first ball hit by cue
          if (!firstHitRef.v) {
            if (a.type === 'cue') firstHitRef.v = b.id;
            else if (b.type === 'cue') firstHitRef.v = a.id;
          }
          const nx = dx / d, ny = dy / d;
          const overlap = BR * 2 - d;
          a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
          const dv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (dv < 0) {
            a.vx += dv * nx; a.vy += dv * ny;
            b.vx -= dv * nx; b.vy -= dv * ny;
          }
        }
      }
    }

    // cushion bounces
    for (const b of active) {
      if (b.x < PX + BR) { b.x = PX + BR; b.vx = Math.abs(b.vx) * 0.82; }
      if (b.x > PX + PW - BR) { b.x = PX + PW - BR; b.vx = -Math.abs(b.vx) * 0.82; }
      if (b.y < PY + BR) { b.y = PY + BR; b.vy = Math.abs(b.vy) * 0.82; }
      if (b.y > PY + PH - BR) { b.y = PY + PH - BR; b.vy = -Math.abs(b.vy) * 0.82; }
    }
  }

  for (const b of active) {
    b.vx *= FRICTION; b.vy *= FRICTION;
    if (Math.hypot(b.vx, b.vy) < MIN_SPD) { b.vx = 0; b.vy = 0; }
  }

  for (const b of active) {
    for (const p of POCKETS) {
      if (Math.hypot(b.x - p.x, b.y - p.y) < PR) {
        b.out = true; b.vx = 0; b.vy = 0;
        potted.push(b.id); break;
      }
    }
  }

  return potted;
}

function anyMoving(balls: Ball[]) {
  return balls.some(b => !b.out && (Math.abs(b.vx) > MIN_SPD || Math.abs(b.vy) > MIN_SPD));
}

// ─── Renderer ─────────────────────────────────────────────────────────────────
function draw(
  ctx: CanvasRenderingContext2D,
  balls: Ball[],
  phase: string,
  mx: number, my: number,
  power: number
) {
  ctx.clearRect(0, 0, TW, TH);

  // table felt
  ctx.fillStyle = '#1a472a';
  ctx.fillRect(0, 0, TW, TH);
  ctx.fillStyle = '#2d6a3f';
  ctx.fillRect(PX, PY, PW, PH);

  // cushions
  ctx.fillStyle = '#4a2e10';
  const cr = PR + 6;
  [[cr, 0, TW / 2 - PR, CW], [TW / 2 + PR, 0, TW - cr, CW],
   [cr, TH - CW, TW / 2 - PR, TH], [TW / 2 + PR, TH - CW, TW - cr, TH],
   [0, cr, CW, TH - cr], [TW - CW, cr, TW, TH - cr]
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  });

  // pockets
  for (const p of POCKETS) {
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(p.x, p.y, PR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, PR + 2, 0, Math.PI * 2); ctx.stroke();
  }

  // baulk line & D
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(BAULK_X, PY); ctx.lineTo(BAULK_X, PY + PH); ctx.stroke();
  ctx.beginPath(); ctx.arc(BAULK_X, PY + PH / 2, D_RAD, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.setLineDash([]);

  const cue = balls.find(b => b.id === 'cue' && !b.out);

  // aim line
  if (phase === 'aiming' && cue) {
    const angle = Math.atan2(my - cue.y, mx - cue.x);
    const dx = Math.cos(angle), dy = Math.sin(angle);
    ctx.strokeStyle = 'rgba(255,255,200,0.5)'; ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(cue.x, cue.y);
    ctx.lineTo(cue.x + dx * 500, cue.y + dy * 500); ctx.stroke();
    ctx.setLineDash([]);

    // cue stick
    const pullBack = 25 + power * 0.4;
    const sx = cue.x - dx * (BR + pullBack), sy = cue.y - dy * (BR + pullBack);
    const ex = sx - dx * 200, ey = sy - dy * 200;
    const g = ctx.createLinearGradient(sx, sy, ex, ey);
    g.addColorStop(0, '#f0c87a'); g.addColorStop(1, '#7a4a10');
    ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  }

  // cue ball placement ghost
  if (phase === 'placing') {
    const ok = mx < BAULK_X && mx > PX + BR && my > PY + BR && my < PY + PH - BR;
    ctx.fillStyle = ok ? 'rgba(255,255,255,0.4)' : 'rgba(255,0,0,0.4)';
    ctx.beginPath(); ctx.arc(mx, my, BR, 0, Math.PI * 2); ctx.fill();
  }

  // balls
  for (const b of balls) {
    if (b.out) continue;
    const c = BALL_COLOR[b.type] || '#888';
    const g = ctx.createRadialGradient(b.x - BR * 0.3, b.y - BR * 0.3, 1, b.x, b.y, BR);
    g.addColorStop(0, lighten(c, 60)); g.addColorStop(0.7, c); g.addColorStop(1, darken(c, 40));
    ctx.beginPath(); ctx.arc(b.x, b.y, BR, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    // shine
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.arc(b.x - BR * 0.3, b.y - BR * 0.3, BR * 0.22, 0, Math.PI * 2); ctx.fill();
  }
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [parseInt(full.slice(0, 2), 16) || 0, parseInt(full.slice(2, 4), 16) || 0, parseInt(full.slice(4, 6), 16) || 0];
}
function lighten(hex: string, a: number) {
  const [r, g, b] = parseHex(hex);
  return `rgb(${Math.min(255, r + a)},${Math.min(255, g + a)},${Math.min(255, b + a)})`;
}
function darken(hex: string, a: number) {
  const [r, g, b] = parseHex(hex);
  return `rgb(${Math.max(0, r - a)},${Math.max(0, g - a)},${Math.max(0, b - a)})`;
}

// ─── Rules ────────────────────────────────────────────────────────────────────
interface GS {
  balls: Ball[];
  scores: [number, number];
  turn: 0 | 1;
  target: 'red' | 'colour';
  redsLeft: number;
  breakPts: number;
  msg: string;
  phase: 'aiming' | 'rolling' | 'placing' | 'over';
  foul: number;
  winner: string | null;
  shots: [number, number];
  potted: [number, number];
  bestBreak: [number, number];
  fouls: [number, number];
}

function reseat(balls: Ball[], id: string) {
  const s = COLOUR_SPOTS[id];
  if (!s) return;
  const b = balls.find(x => x.id === id)!;
  const busy = balls.some(o => !o.out && o.id !== id && Math.hypot(o.x - s.x, o.y - s.y) < BR * 2 + 2);
  b.out = false; b.vx = 0; b.vy = 0;
  b.x = busy ? s.x + 40 : s.x;
  b.y = s.y;
}

function applyShot(gs: GS, pottedIds: string[], firstHit: string | null): GS {
  const s = { ...gs };
  s.balls = gs.balls.map(b => ({ ...b }));
  s.scores = [...gs.scores] as [number, number];
  s.shots = [...gs.shots] as [number, number];
  s.potted = [...gs.potted] as [number, number];
  s.bestBreak = [...gs.bestBreak] as [number, number];
  s.fouls = [...gs.fouls] as [number, number];
  s.shots[gs.turn]++;

  const hitBall = firstHit ? s.balls.find(b => b.id === firstHit) : null;
  const cuePotted = pottedIds.includes('cue');
  const redsPotted = pottedIds.filter(id => s.balls.find(b => b.id === id)?.type === 'red');
  const coloursPotted = pottedIds.filter(id => {
    const b = s.balls.find(x => x.id === id);
    return b && b.type !== 'red' && b.type !== 'cue';
  });

  let isFoul = false, foulVal = 0, scored = 0, swap = false;

  if (cuePotted) { isFoul = true; foulVal = 4; s.msg = 'Foul! Cue ball in pocket. '; }
  else if (!firstHit) { isFoul = true; foulVal = 4; s.msg = 'Foul! No ball hit. '; }
  else if (s.target === 'red' && hitBall?.type !== 'red') {
    isFoul = true; foulVal = Math.max(4, BALL_PTS[hitBall?.type || ''] || 4);
    s.msg = 'Foul! Must hit a red first. ';
  } else if (s.target === 'colour' && hitBall?.type === 'red') {
    isFoul = true; foulVal = 4; s.msg = 'Foul! Must hit a colour first. ';
  }

  if (!isFoul) {
    if (s.target === 'red') {
      if (redsPotted.length > 0) {
        scored = redsPotted.length;
        s.redsLeft = Math.max(0, s.redsLeft - redsPotted.length);
        s.target = 'colour';
        s.msg = `Potted ${redsPotted.length} red(s)! Now pot a colour.`;
        // foul if a colour was also potted on a red shot
        for (const id of coloursPotted) {
          isFoul = true; foulVal = Math.max(4, BALL_PTS[s.balls.find(b => b.id === id)?.type || ''] || 4);
          s.msg = 'Foul! Potted colour on red shot. '; scored = 0;
          reseat(s.balls, id);
        }
      } else {
        swap = true; s.msg = 'Missed. ';
      }
    } else {
      if (coloursPotted.length > 0) {
        const id = coloursPotted[0];
        const type = s.balls.find(b => b.id === id)?.type || '';
        scored = BALL_PTS[type] || 0;
        s.msg = `Potted ${type} for ${scored} pts! `;
        if (s.redsLeft > 0) {
          s.target = 'red';
          s.msg += 'Now pot a red.';
          reseat(s.balls, id);
        } else {
          s.msg += 'Continue with colours.';
        }
      } else { swap = true; s.msg = 'Missed. '; }
    }
  }

  if (isFoul) {
    const other = gs.turn === 0 ? 1 : 0;
    s.scores[other] += foulVal;
    s.foul = foulVal;
    s.fouls[gs.turn]++;
    s.target = 'red';
    swap = true;
    s.msg += `${foulVal} pts to opponent.`;
    if (cuePotted) { s.phase = 'placing'; }
  } else {
    s.foul = 0;
    if (scored > 0) {
      s.scores[gs.turn] += scored;
      s.breakPts += scored;
      s.potted[gs.turn]++;
    }
  }

  if (swap) {
    if (s.breakPts > s.bestBreak[gs.turn]) s.bestBreak[gs.turn] = s.breakPts;
    s.turn = gs.turn === 0 ? 1 : 0;
    s.breakPts = 0;
  } else {
    if (s.breakPts > s.bestBreak[gs.turn]) s.bestBreak[gs.turn] = s.breakPts;
  }

  // check frame over
  const allOut = s.balls.filter(b => b.type !== 'cue').every(b => b.out);
  if (allOut) {
    s.phase = 'over';
    s.winner = s.scores[0] > s.scores[1] ? 'Neal Bhavsar' : s.scores[1] > s.scores[0] ? 'Player 2' : 'Draw';
    s.msg = `Frame over! ${s.winner === 'Draw' ? "It's a draw!" : s.winner + ' wins!'}`;
  } else if (s.phase !== 'placing') {
    s.phase = 'aiming';
    const name = ['Neal Bhavsar', 'Player 2'][s.turn];
    const tgt = s.target === 'red' ? 'a red' : 'a colour';
    s.msg = s.msg || `${name}'s turn — pot ${tgt}`;
  }

  return s;
}

function newGame(): GS {
  return {
    balls: makeBalls(), scores: [0, 0], turn: 0,
    target: 'red', redsLeft: 15, breakPts: 0,
    msg: "Neal Bhavsar's turn — pot a red",
    phase: 'aiming', foul: 0, winner: null,
    shots: [0, 0], potted: [0, 0], bestBreak: [0, 0], fouls: [0, 0],
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(newGame());
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: TW / 2, y: TH / 2 });
  const lastRef = useRef(0);
  const firstHitRef = useRef<{ v: string | null }>({ v: null });
  const pottedRef = useRef<string[]>([]);
  const scaleRef = useRef(1);

  const [gs, setGs] = useState<GS>(gsRef.current);
  const [power, setPower] = useState(55);
  const [canvSize, setCanvSize] = useState({ w: TW, h: TH });
  const [showStats, setShowStats] = useState(false);
  const [dragging, setDragging] = useState(false);

  // responsive scaling
  useEffect(() => {
    const resize = () => {
      const scale = Math.min((window.innerWidth - 20) / TW, (window.innerHeight - 240) / TH, 1);
      scaleRef.current = scale;
      setCanvSize({ w: Math.round(TW * scale), h: Math.round(TH * scale) });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const pos = useCallback((e: MouseEvent | React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scaleRef.current, y: (e.clientY - r.top) / scaleRef.current };
  }, []);

  // game loop
  const loop = useCallback((t: number) => {
    const dt = Math.min((t - lastRef.current) / 16.67, 3);
    lastRef.current = t;
    const g = gsRef.current;

    if (g.phase === 'rolling') {
      const p = step(g.balls, firstHitRef.current);
      for (const id of p) if (!pottedRef.current.includes(id)) pottedRef.current.push(id);

      if (!anyMoving(g.balls)) {
        const next = applyShot(g, pottedRef.current, firstHitRef.current.v);
        firstHitRef.current = { v: null };
        pottedRef.current = [];
        gsRef.current = next;
        setGs({ ...next });
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      draw(ctx, g.balls, g.phase, mouseRef.current.x, mouseRef.current.y, power);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [power]);

  useEffect(() => {
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  const onMouseMove = useCallback((e: MouseEvent) => { mouseRef.current = pos(e); }, [pos]);
  useEffect(() => {
    const c = canvasRef.current!;
    c.addEventListener('mousemove', onMouseMove);
    return () => c.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  const shoot = useCallback((e: React.MouseEvent) => {
    const g = gsRef.current;
    if (g.phase === 'placing') {
      const { x, y } = pos(e);
      const ok = x < BAULK_X && x > PX + BR && y > PY + BR && y < PY + PH - BR;
      if (!ok) return;
      const cue = g.balls.find(b => b.id === 'cue')!;
      cue.x = x; cue.y = y; cue.out = false; cue.vx = 0; cue.vy = 0;
      gsRef.current = { ...g, phase: 'aiming' };
      setGs({ ...gsRef.current });
      return;
    }
    if (g.phase === 'aiming' && dragging) {
      setDragging(false);
      const cue = g.balls.find(b => b.id === 'cue' && !b.out);
      if (!cue) return;
      const { x, y } = mouseRef.current;
      const angle = Math.atan2(y - cue.y, x - cue.x);
      const spd = (power / 100) * 14;
      cue.vx = Math.cos(angle) * spd; cue.vy = Math.sin(angle) * spd;
      firstHitRef.current = { v: null };
      pottedRef.current = [];
      gsRef.current = { ...g, phase: 'rolling' };
      setGs({ ...gsRef.current });
    }
  }, [dragging, power, pos]);

  const restart = () => { const g = newGame(); gsRef.current = g; firstHitRef.current = { v: null }; pottedRef.current = []; setGs({ ...g }); };
  const names = ['Neal Bhavsar', 'Player 2'];
  const acc = (i: number) => gs.shots[i] === 0 ? 0 : Math.round((gs.potted[i] / gs.shots[i]) * 100);

  return (
    <div className="app">
      <div className="header">
        <h1>Neal Bhavsar's Snooker</h1>
        <div className="hbtns">
          <button className="btn-outline" onClick={() => setShowStats(s => !s)}>Stats</button>
          <button className="btn-gold" onClick={restart}>New Game</button>
        </div>
      </div>

      {/* scoreboard */}
      <div className="scoreboard">
        {[0, 1].map(i => (
          <div key={i} className={`player ${gs.turn === i ? 'active' : ''}`}>
            <span className="pname">{names[i]}</span>
            <span className="pscore">{gs.scores[i]}</span>
            {gs.turn === i && gs.breakPts > 0 && <span className="break">Break: {gs.breakPts}</span>}
          </div>
        ))}
        <div className="midinfo">
          <div className="reds-row">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className={`rdot ${i < gs.balls.filter(b => b.type === 'red' && !b.out).length ? 'on' : 'off'}`} />
            ))}
          </div>
          <div className={`target-pill ${gs.target}`}>{gs.target === 'red' ? '🔴 Pot Red' : '🎱 Pot Colour'}</div>
        </div>
      </div>

      <div className="msgbar">
        {gs.foul > 0 && <span className="foul">FOUL +{gs.foul}</span>}
        <span>{gs.msg}</span>
      </div>

      {gs.phase === 'aiming' && (
        <div className="powerbar">
          <label>Power: {power}%</label>
          <input type="range" min="5" max="100" value={power} onChange={e => setPower(+e.target.value)} />
          <div className="pbar"><div className="pfill" style={{ width: `${power}%`, background: `hsl(${120 - power},75%,42%)` }} /></div>
        </div>
      )}

      {gs.phase === 'placing' && (
        <div className="hint">Click in the D-zone (behind baulk line) to place the cue ball</div>
      )}

      <div className="canvas-wrap">
        <canvas ref={canvasRef} width={TW} height={TH}
          style={{ width: canvSize.w, height: canvSize.h }}
          onMouseDown={() => gs.phase === 'aiming' && setDragging(true)}
          onMouseUp={shoot}
        />
      </div>

      {gs.phase === 'over' && (
        <div className="overlay">
          <div className="overcard">
            <h2>Frame Over</h2>
            <p>{gs.winner === 'Draw' ? "It's a draw!" : `${gs.winner} wins!`}</p>
            <div className="finalscores">
              <span>Neal Bhavsar: {gs.scores[0]}</span>
              <span>Player 2: {gs.scores[1]}</span>
            </div>
            <button className="btn-gold" onClick={restart}>Play Again</button>
          </div>
        </div>
      )}

      {showStats && (
        <div className="overlay" onClick={() => setShowStats(false)}>
          <div className="statscard" onClick={e => e.stopPropagation()}>
            <div className="stath">
              <h3>Match Stats</h3>
              <button onClick={() => setShowStats(false)}>✕</button>
            </div>
            <table className="stattable">
              <thead><tr><th /><th>Neal Bhavsar</th><th>Player 2</th></tr></thead>
              <tbody>
                <tr><td>Score</td><td>{gs.scores[0]}</td><td>{gs.scores[1]}</td></tr>
                <tr><td>Shots</td><td>{gs.shots[0]}</td><td>{gs.shots[1]}</td></tr>
                <tr><td>Balls Potted</td><td>{gs.potted[0]}</td><td>{gs.potted[1]}</td></tr>
                <tr><td>Pot Accuracy</td><td>{acc(0)}%</td><td>{acc(1)}%</td></tr>
                <tr><td>Best Break</td><td>{gs.bestBreak[0]}</td><td>{gs.bestBreak[1]}</td></tr>
                <tr><td>Fouls</td><td>{gs.fouls[0]}</td><td>{gs.fouls[1]}</td></tr>
              </tbody>
            </table>
            <p className="statfooter">Pot accuracy = balls potted ÷ shots × 100</p>
          </div>
        </div>
      )}

      <div className="hint-row">Move mouse to aim • Click to shoot • Slider = power</div>
    </div>
  );
}
