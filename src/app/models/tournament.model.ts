import { Match } from './match.model';

export interface Tournament {
  id: string;
  name: string;
  players: string[];
  matches: Match[];
  currentRound: number;
  totalRounds: number;
  isComplete: boolean;
  createdAt: number;
}
