import { GameState } from '../game/types';

interface Props {
  state: GameState;
  onClose: () => void;
}

// simple stat row
function StatRow({ label, val1, val2 }: { label: string; val1: string | number; val2: string | number }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-val">{val1}</span>
      <span className="stat-val">{val2}</span>
    </div>
  );
}

export default function StatsPanel({ state, onClose }: Props) {
  const [s0, s1] = state.stats;
  const [p0, p1] = state.players;

  const acc0 = s0.shotsTaken === 0 ? 0 : Math.round((s0.ballsPotted / s0.shotsTaken) * 100);
  const acc1 = s1.shotsTaken === 0 ? 0 : Math.round((s1.ballsPotted / s1.shotsTaken) * 100);

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div className="stats-panel" onClick={e => e.stopPropagation()}>
        <div className="stats-header">
          <h3>Match Statistics</h3>
          <button className="stats-close" onClick={onClose}>✕</button>
        </div>

        <div className="stats-players-header">
          <span />
          <span className="stats-player-name">{p0.name}</span>
          <span className="stats-player-name">{p1.name}</span>
        </div>

        <StatRow label="Score" val1={p0.score} val2={p1.score} />
        <StatRow label="Shots Taken" val1={s0.shotsTaken} val2={s1.shotsTaken} />
        <StatRow label="Balls Potted" val1={s0.ballsPotted} val2={s1.ballsPotted} />
        <StatRow label="Pot Accuracy" val1={`${acc0}%`} val2={`${acc1}%`} />
        <StatRow label="Highest Break" val1={s0.highestBreak} val2={s1.highestBreak} />
        <StatRow label="Fouls" val1={s0.fouls} val2={s1.fouls} />

        <div className="stats-math-note">
          <span>📐</span>
          <span>Pot accuracy = balls potted ÷ shots taken × 100</span>
        </div>
      </div>
    </div>
  );
}
