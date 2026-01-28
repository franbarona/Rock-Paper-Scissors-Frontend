export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';
export type Result = 'WIN' | 'LOSS' | 'DRAW';

export interface GameRequest {
  move: Move;
}

export interface GameResponse {
  id: number;
  playerMove: Move;
  computerMove: Move;
  result: Result;
}
