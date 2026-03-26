import { GameState } from '../game/types';
import { BALL_COLORS } from '../game/constants';

interface Props {
  state: GameState;
}

const COLOUR_ORDER = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
const COLOUR_POINTS: Record<string, number> = {
  yellow: 2, green: 3, brown: 4, blue: 5, pink: 6, black: 7,
};

export default function Scoreboard({ state }: Props) {
  const { players, currentPlayer, targetBall, redsRemaining, breakScore, balls } = state;

  const reds = balls.filter(b => b.type === 'red');
  const redsOnTable = reds.filter(b => b.onTable && !b.potted).length;

  return (
    <div className="scoreboard">
      <div className={`player-panel ${currentPlayer === 0 ? 'active' : ''}`}>
        <div className="player-name">{players[0].name}</div>
        <div className="player-score">{players[0].score}</div>
        {currentPlayer === 0 && breakScore > 0 && (
          <div className="break-score">Break: {breakScore}</div>
        )}
        {currentPlayer === 0 && <div className="turn-indicator">●</div>}
      </div>

      <div className="game-info">
        <div className="reds-remaining">
          <span className="label">Reds Left</span>
          <div className="reds-dots">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`red-dot ${i < redsOnTable ? 'active' : 'potted'}`}
              />
            ))}
          </div>
        </div>

        <div className="target-info">
          <span className="label">Target</span>
          <div className={`target-badge ${targetBall}`}>
            {targetBall === 'red' ? '🔴 Red' : '🎱 Colour'}
          </div>
        </div>

        <div className="colours-status">
          {COLOUR_ORDER.map(c => {
            const ball = balls.find(b => b.id === c);
            const isOnTable = ball?.onTable && !ball?.potted;
            return (
              <div key={c} className={`colour-ball ${isOnTable ? 'on-table' : 'potted'}`}
                style={{ backgroundColor: isOnTable ? BALL_COLORS[c] : '#333' }}
                title={`${c} (${COLOUR_POINTS[c]} pts)`}
              />
            );
          })}
        </div>
      </div>

      <div className={`player-panel ${currentPlayer === 1 ? 'active' : ''}`}>
        {currentPlayer === 1 && <div className="turn-indicator">●</div>}
        {currentPlayer === 1 && breakScore > 0 && (
          <div className="break-score">Break: {breakScore}</div>
        )}
        <div className="player-score">{players[1].score}</div>
        <div className="player-name">{players[1].name}</div>
      </div>
    </div>
  );
}
