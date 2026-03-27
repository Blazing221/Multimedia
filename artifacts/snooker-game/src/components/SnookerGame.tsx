import { useRef, useEffect, useState, useCallback } from 'react';
import {
  TABLE_WIDTH, TABLE_HEIGHT, BALL_RADIUS, CUE_BALL_SPEED_MULTIPLIER,
  BAULK_LINE_X, PLAYFIELD_X,
} from '../game/constants';
import { createInitialState } from '../game/initialState';
import { GameState } from '../game/types';
import { stepPhysics } from '../game/physics';
import { renderTable } from '../game/renderer';
import { processShot } from '../game/rules';
import Scoreboard from './Scoreboard';
import StatsPanel from './StatsPanel';

export default function SnookerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2 });
  const lastTimeRef = useRef<number>(0);
  const firstHitTrackerRef = useRef<string | null>(null);
  const pottedThisShotRef = useRef<string[]>([]);
  const scaleRef = useRef<number>(1);

  const [displayState, setDisplayState] = useState<GameState>(gameStateRef.current);
  const [power, setPower] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: TABLE_WIDTH, h: TABLE_HEIGHT, scale: 1 });
  // live aim angle shown to player in degrees
  const [aimAngleDeg, setAimAngleDeg] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    function updateSize() {
      const hPad = 24;
      const vPad = 260;
      const availW = window.innerWidth - hPad;
      const availH = window.innerHeight - vPad;
      const scaleW = availW / TABLE_WIDTH;
      const scaleH = availH / TABLE_HEIGHT;
      const scale = Math.min(scaleW, scaleH, 1);
      scaleRef.current = scale;
      setCanvasSize({ w: Math.round(TABLE_WIDTH * scale), h: Math.round(TABLE_HEIGHT * scale), scale });
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getCanvasPos = useCallback((e: MouseEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scale = scaleRef.current;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }, []);

  const loop = useCallback((time: number) => {
    const dt = Math.min((time - lastTimeRef.current) / 16.67, 3);
    lastTimeRef.current = time;
    const state = gameStateRef.current;

    if (state.phase === 'rolling') {
      const result = stepPhysics(state.balls, dt);

      if (result.firstHitId && !firstHitTrackerRef.current) {
        firstHitTrackerRef.current = result.firstHitId;
      }
      for (const id of result.pottedIds) {
        if (!pottedThisShotRef.current.includes(id)) {
          pottedThisShotRef.current.push(id);
        }
      }

      if (!result.anyMoving) {
        const processed = processShot(
          state,
          pottedThisShotRef.current,
          firstHitTrackerRef.current
        );
        firstHitTrackerRef.current = null;
        pottedThisShotRef.current = [];

        if (processed.phase !== 'game_over' && processed.phase !== 'placing_cue_ball') {
          processed.phase = 'aiming';
        }
        gameStateRef.current = processed;
        setDisplayState({ ...processed });
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cueBall = state.balls.find(b => b.id === 'cue' && b.onTable && !b.potted);
      const angle = cueBall ? Math.atan2(my - cueBall.y, mx - cueBall.x) : 0;
      const cuePlaceable = state.phase === 'placing_cue_ball' ? isCueBallPlaceable(mx, my, state) : false;

      renderTable(ctx, state.balls, angle, power, state.phase, mx, my, 0, 0, state.phase === 'aiming', cuePlaceable, 1, 1);
    }

    animFrameRef.current = requestAnimationFrame(loop);
  }, [power]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [loop]);

  function isCueBallPlaceable(x: number, y: number, state: GameState): boolean {
    if (x > BAULK_LINE_X) return false;
    if (x < PLAYFIELD_X + BALL_RADIUS || x > PLAYFIELD_X + TABLE_WIDTH - BALL_RADIUS) return false;
    if (y < BALL_RADIUS || y > TABLE_HEIGHT - BALL_RADIUS) return false;
    for (const ball of state.balls) {
      if (!ball.onTable || ball.potted || ball.type === 'cue') continue;
      if (Math.hypot(ball.x - x, ball.y - y) < BALL_RADIUS * 2 + 2) return false;
    }
    return true;
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const pos = getCanvasPos(e);
    mouseRef.current = pos;

    // update live angle display while aiming
    const state = gameStateRef.current;
    if (state.phase === 'aiming') {
      const cueBall = state.balls.find(b => b.id === 'cue' && b.onTable && !b.potted);
      if (cueBall) {
        // convert radians to degrees (0-360, clockwise from right)
        let deg = Math.atan2(pos.y - cueBall.y, pos.x - cueBall.x) * (180 / Math.PI);
        if (deg < 0) deg += 360;
        setAimAngleDeg(Math.round(deg));
      }
    }
  }, [getCanvasPos]);

  const handleMouseDown = useCallback((_e: React.MouseEvent) => {
    const state = gameStateRef.current;
    if (state.phase === 'aiming') {
      setIsDragging(true);
    }
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const state = gameStateRef.current;
    if (state.phase === 'placing_cue_ball') {
      const pos = getCanvasPos(e);
      if (isCueBallPlaceable(pos.x, pos.y, state)) {
        const cueBall = state.balls.find(b => b.id === 'cue')!;
        cueBall.x = pos.x;
        cueBall.y = pos.y;
        cueBall.onTable = true;
        cueBall.potted = false;
        cueBall.vx = 0;
        cueBall.vy = 0;
        gameStateRef.current = { ...state, phase: 'aiming' };
        setDisplayState({ ...gameStateRef.current });
      }
      return;
    }

    if (state.phase === 'aiming' && isDragging) {
      setIsDragging(false);
      const cueBall = state.balls.find(b => b.id === 'cue' && b.onTable && !b.potted);
      if (!cueBall) return;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const angle = Math.atan2(my - cueBall.y, mx - cueBall.x);
      const speed = power * CUE_BALL_SPEED_MULTIPLIER / 100;

      cueBall.vx = Math.cos(angle) * speed;
      cueBall.vy = Math.sin(angle) * speed;

      firstHitTrackerRef.current = null;
      pottedThisShotRef.current = [];

      gameStateRef.current = { ...state, phase: 'rolling', shotPlayed: true };
      setDisplayState({ ...gameStateRef.current });
    }
  }, [isDragging, power, getCanvasPos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleNewGame = () => {
    const fresh = createInitialState();
    gameStateRef.current = fresh;
    firstHitTrackerRef.current = null;
    pottedThisShotRef.current = [];
    setAimAngleDeg(null);
    setDisplayState({ ...fresh });
  };

  // pot % for current player
  const curStats = displayState.stats[displayState.currentPlayer];
  const potPct = curStats.shotsTaken === 0
    ? 0
    : Math.round((curStats.ballsPotted / curStats.shotsTaken) * 100);

  return (
    <div className="snooker-container">
      <div className="game-header">
        <h1 className="game-title">Neal Bhavsar's Snooker</h1>
        <div className="header-actions">
          <button className="stats-btn" onClick={() => setShowStats(s => !s)}>
            {showStats ? 'Hide Stats' : 'Stats'}
          </button>
          <button className="new-game-btn" onClick={handleNewGame}>New Game</button>
        </div>
      </div>

      <Scoreboard state={displayState} />

      <div className="message-bar">
        {displayState.foul && (
          <span className="foul-indicator">FOUL +{displayState.foulPoints}</span>
        )}
        <span className="message-text">{displayState.message}</span>
      </div>

      {displayState.phase === 'aiming' && (
        <div className="power-and-angle">
          <div className="power-control">
            <label>Power: {power}%</label>
            <input
              type="range"
              min="5"
              max="100"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
            />
            <div className="power-bar">
              <div className="power-fill" style={{ width: `${power}%`, backgroundColor: `hsl(${120 - power}, 80%, 45%)` }} />
            </div>
          </div>

          <div className="angle-display">
            <div className="angle-label">Shot Angle</div>
            <div className="angle-value">{aimAngleDeg ?? '--'}°</div>
            <div className="angle-compass">
              <div
                className="angle-needle"
                style={{ transform: `rotate(${aimAngleDeg ?? 0}deg)` }}
              />
            </div>
          </div>

          <div className="pot-rate">
            <div className="angle-label">Pot Rate</div>
            <div className="angle-value">{potPct}%</div>
            <div className="pot-bar">
              <div className="pot-fill" style={{ width: `${potPct}%` }} />
            </div>
          </div>
        </div>
      )}

      {displayState.phase === 'placing_cue_ball' && (
        <div className="placement-hint">
          Click in the D area (behind the baulk line) to place the cue ball
        </div>
      )}

      <div ref={wrapperRef} className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={TABLE_WIDTH}
          height={TABLE_HEIGHT}
          style={{ width: canvasSize.w, height: canvasSize.h }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>

      {showStats && (
        <StatsPanel state={displayState} onClose={() => setShowStats(false)} />
      )}

      {displayState.phase === 'game_over' && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>Frame Over!</h2>
            <p>{displayState.winner === 'Draw' ? "It's a Draw!" : `${displayState.winner} Wins!`}</p>
            <div className="final-scores">
              <span>{displayState.players[0].name}: {displayState.players[0].score}</span>
              <span>{displayState.players[1].name}: {displayState.players[1].score}</span>
            </div>
            <button onClick={handleNewGame}>Play Again</button>
          </div>
        </div>
      )}

      <div className="controls-help">
        <span>Move mouse to aim</span>
        <span>•</span>
        <span>Click to shoot</span>
        <span>•</span>
        <span>Adjust power with the slider</span>
      </div>
    </div>
  );
}
