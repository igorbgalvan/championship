export interface Match {
  id: string;
  round: number;
  player1: string | null;
  player2: string | null;
  winner: string | null;
  isBye: boolean;
  isComplete: boolean;
  parentMatchId?: string;
  childMatchId?: string;
}
