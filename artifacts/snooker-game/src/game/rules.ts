import { GameState, Ball, TargetBall } from './types';
import { COLOURED_BALL_SPOTS, BALL_POINTS } from './constants';

function getColourSpotName(ballId: string): string {
  const colourNames = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
  return colourNames.find(c => c === ballId) || ballId;
}

export function processShot(
  state: GameState,
  pottedIds: string[],
  firstHitId: string | null
): GameState {
  const next = { ...state };
  next.players = [{ ...state.players[0] }, { ...state.players[1] }];
  next.balls = state.balls.map(b => ({ ...b }));
  next.stats = [{ ...state.stats[0] }, { ...state.stats[1] }];
  // count shot for current player
  next.stats[state.currentPlayer].shotsTaken += 1;

  const cueBall = next.balls.find(b => b.id === 'cue')!;

  const pottedBalls = pottedIds.map(id => next.balls.find(b => b.id === id)!).filter(Boolean);
  const cuePotted = pottedIds.includes('cue');
  const redsPotted = pottedBalls.filter(b => b.type === 'red');
  const coloursPotted = pottedBalls.filter(b => b.type !== 'red' && b.type !== 'cue');

  let isFoul = false;
  let foulValue = 0;
  let scored = 0;
  let switchPlayer = false;
  let message = '';
  let nextTarget: TargetBall = next.targetBall;
  let redsLeft = next.redsRemaining;

  if (cuePotted) {
    isFoul = true;
    foulValue = Math.max(4, foulValue);
    message = 'Foul! Cue ball potted! ';
    cueBall.potted = false;
    cueBall.onTable = true;
  }

  if (!firstHitId && !cuePotted) {
    isFoul = true;
    foulValue = Math.max(4, foulValue);
    message += 'Foul! No ball was hit! ';
  } else if (firstHitId && !cuePotted) {
    const hitBall = next.balls.find(b => b.id === firstHitId);
    if (hitBall) {
      if (next.targetBall === 'red' && hitBall.type !== 'red') {
        isFoul = true;
        const hitPoints = BALL_POINTS[hitBall.type] || 4;
        foulValue = Math.max(4, hitPoints);
        message += `Foul! Must hit a red ball first! `;
      } else if (next.targetBall === 'colour' && hitBall.type === 'red') {
        isFoul = true;
        foulValue = Math.max(4, foulValue);
        message += `Foul! Must hit a colour first! `;
      }
    }
  }

  if (!isFoul) {
    if (next.targetBall === 'red') {
      if (redsPotted.length > 0) {
        scored += redsPotted.length;
        redsLeft = Math.max(0, redsLeft - redsPotted.length);
        nextTarget = 'colour';
        message = `Potted ${redsPotted.length} red(s) for ${redsPotted.length} point(s)! Now pot a colour. `;

        for (const b of coloursPotted) {
          isFoul = true;
          const ballPoints = BALL_POINTS[b.type] || 4;
          foulValue = Math.max(4, ballPoints);
          message = `Foul! Potted a colour when targeting red! `;
          b.onTable = true;
          b.potted = false;
          b.x = COLOURED_BALL_SPOTS[b.id]?.x || 400;
          b.y = COLOURED_BALL_SPOTS[b.id]?.y || 450;
        }
      } else if (coloursPotted.length > 0) {
        isFoul = true;
        const maxPoints = Math.max(...coloursPotted.map(b => BALL_POINTS[b.type] || 4));
        foulValue = Math.max(4, maxPoints);
        message = `Foul! Potted colour when targeting red! `;
        for (const b of coloursPotted) {
          b.onTable = true;
          b.potted = false;
          b.x = COLOURED_BALL_SPOTS[b.id]?.x || 400;
          b.y = COLOURED_BALL_SPOTS[b.id]?.y || 450;
        }
      } else {
        switchPlayer = true;
        const p = next.players[next.currentPlayer];
        message = `No red potted. ${p.name} scored ${next.breakScore} this break. `;
      }
    } else {
      if (coloursPotted.length > 0) {
        const ball = coloursPotted[0];
        scored += BALL_POINTS[ball.type] || 0;
        message = `Potted ${ball.type} for ${BALL_POINTS[ball.type]} points! `;

        if (redsPotted.length > 0) {
          isFoul = true;
          foulValue = Math.max(4, BALL_POINTS[ball.type]);
          message = `Foul! Potted red when targeting colour! `;
          scored = 0;
          for (const rb of redsPotted) {
            rb.onTable = true;
            rb.potted = false;
          }
        } else {
          if (redsLeft > 0) {
            if (redsLeft <= redsPotted.length) {
              nextTarget = 'colour';
            } else {
              nextTarget = 'red';
            }

            if (ball.id !== 'black' || redsLeft > 0) {
              ball.onTable = true;
              ball.potted = false;
              const spot = COLOURED_BALL_SPOTS[ball.id];
              if (spot) {
                const occupied = next.balls.some(ob =>
                  ob.onTable && !ob.potted && ob.id !== ball.id &&
                  Math.hypot(ob.x - spot.x, ob.y - spot.y) < 36
                );
                if (!occupied) {
                  ball.x = spot.x;
                  ball.y = spot.y;
                } else {
                  ball.x = spot.x + 40;
                  ball.y = spot.y;
                }
              }
            }
          } else {
            const colourOrder = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
            const remaining = colourOrder.filter(c => {
              const cb = next.balls.find(b => b.id === c);
              return cb && (cb.onTable || cb.potted);
            });
            const nextColourIdx = remaining.indexOf(ball.id) + 1;
            if (nextColourIdx < remaining.length) {
              nextTarget = 'colour';
            }
          }
          message += redsLeft > 0 ? 'Now pot a red. ' : 'Continue potting colours in order. ';
        }
      } else if (redsPotted.length > 0) {
        isFoul = true;
        foulValue = 4;
        message = `Foul! Must pot a colour! `;
        for (const b of redsPotted) {
          b.onTable = true;
          b.potted = false;
        }
      } else {
        switchPlayer = true;
        message = `Missed. `;
      }
    }
  }

  if (isFoul) {
    const victim = next.currentPlayer === 0 ? 1 : 0;
    next.players[victim].score += foulValue;
    next.foul = true;
    next.foulPoints = foulValue;
    next.stats[state.currentPlayer].fouls += 1;
    switchPlayer = true;
    message += `${foulValue} points to opponent. `;
    nextTarget = 'red';
    if (cuePotted) {
      next.phase = 'placing_cue_ball';
    }
  } else {
    next.foul = false;
    next.foulPoints = 0;
    if (scored > 0) {
      next.players[next.currentPlayer].score += scored;
      next.breakScore += scored;
      // track balls potted (non-cue balls potted legitimately)
      const legitPotted = pottedIds.filter(id => id !== 'cue').length;
      next.stats[state.currentPlayer].ballsPotted += legitPotted;
    }
  }

  next.redsRemaining = redsLeft;
  next.targetBall = nextTarget;

  if (switchPlayer) {
    // update highest break before resetting it
    if (next.breakScore > next.stats[state.currentPlayer].highestBreak) {
      next.stats[state.currentPlayer].highestBreak = next.breakScore;
    }
    next.currentPlayer = next.currentPlayer === 0 ? 1 : 0;
    next.breakScore = 0;
  } else if (next.breakScore > next.stats[state.currentPlayer].highestBreak) {
    next.stats[state.currentPlayer].highestBreak = next.breakScore;
  }

  const allRedsPotted = next.balls.filter(b => b.type === 'red').every(b => !b.onTable || b.potted);
  const coloursOnTable = next.balls.filter(b =>
    b.type !== 'red' && b.type !== 'cue' && b.onTable && !b.potted
  );

  if (allRedsPotted && redsLeft === 0 && coloursOnTable.length === 0) {
    next.frameOver = true;
    const p0 = next.players[0];
    const p1 = next.players[1];
    if (p0.score > p1.score) {
      next.winner = p0.name;
    } else if (p1.score > p0.score) {
      next.winner = p1.name;
    } else {
      next.winner = 'Draw';
    }
    next.phase = 'game_over';
    message = `Frame over! ${next.winner} wins!`;
  } else {
    const curPlayer = next.players[next.currentPlayer];
    if (next.phase !== 'placing_cue_ball') {
      const target = next.targetBall === 'red' ? 'a red ball' : 'a colour ball';
      message += `${curPlayer.name}'s turn — Pot ${target}`;
    }
  }

  next.message = message;
  return next;
}

export function respotColours(balls: Ball[]): Ball[] {
  const updated = balls.map(b => ({ ...b }));
  const colourIds = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
  for (const id of colourIds) {
    const ball = updated.find(b => b.id === id);
    if (ball && ball.potted) {
      const spot = COLOURED_BALL_SPOTS[id];
      if (spot) {
        ball.potted = false;
        ball.onTable = true;
        ball.x = spot.x;
        ball.y = spot.y;
        ball.vx = 0;
        ball.vy = 0;
      }
    }
  }
  return updated;
}
