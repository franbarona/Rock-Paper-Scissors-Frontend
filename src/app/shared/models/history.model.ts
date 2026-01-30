import { Result } from "./game.model";

export interface GameHistoryItemResponse {
  id: number;
  playerMove: string;
  computerMove: string;
  result: Result;
  playedAt: string;
}