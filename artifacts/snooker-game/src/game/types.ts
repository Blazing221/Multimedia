export type BallType = 'cue' | 'red' | 'yellow' | 'green' | 'brown' | 'blue' | 'pink' | 'black';

export interface Ball {
  id: string;
  type: BallType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  potted: boolean;
  onTable: boolean;
}

export type GamePhase =
  | 'aiming'
  | 'shooting'
  | 'rolling'
  | 'placing_cue_ball'
  | 'game_over';

export type TargetBall = 'red' | 'colour';

export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  balls: Ball[];
  phase: GamePhase;
  currentPlayer: 0 | 1;
  players: [Player, Player];
  targetBall: TargetBall;
  redsRemaining: number;
  inBreak: boolean;
  breakScore: number;
  lastPottedColour: string | null;
  message: string;
  foul: boolean;
  foulPoints: number;
  winner: string | null;
  frameOver: boolean;
  shotPlayed: boolean;
  firstBallHit: string | null;
  redPottedThisShot: boolean;
  colourPottedThisShot: string | null;
}
