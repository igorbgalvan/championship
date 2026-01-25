import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private readonly STORAGE_KEY = 'championship_tournament';
  private tournamentSubject = new BehaviorSubject<Tournament | null>(null);
  public tournament$: Observable<Tournament | null> = this.tournamentSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  createTournament(name: string, players: string[]): Tournament {
    if (players.length < 2) {
      throw new Error('At least 2 players are required');
    }

    // Handle odd number of players with random bye
    const processedPlayers = [...players];
    if (players.length % 2 !== 0) {
      const byeIndex = Math.floor(Math.random() * processedPlayers.length);
      // Mark the bye player (we'll handle this in match generation)
    }

    // Calculate total rounds needed
    // For n players, we need ceil(log2(n)) rounds
    const totalRounds = Math.ceil(Math.log2(players.length));
    const matches: Match[] = [];
    
    // Generate first round matches
    const firstRoundMatches = this.generateFirstRound(processedPlayers);
    matches.push(...firstRoundMatches);

    // Generate subsequent rounds
    let currentRound = 1;
    let previousRoundMatches = firstRoundMatches;
    
    while (currentRound < totalRounds) {
      const nextRound = currentRound + 1;
      const nextRoundMatches = this.generateNextRound(nextRound, previousRoundMatches);
      matches.push(...nextRoundMatches);
      previousRoundMatches = nextRoundMatches;
      currentRound = nextRound;
    }

    const tournament: Tournament = {
      id: Date.now().toString(),
      name: name || 'Untitled Tournament',
      players: processedPlayers,
      matches,
      currentRound: 1,
      totalRounds,
      isComplete: false,
      createdAt: Date.now()
    };

    // Advance any completed matches (like bye matches) to next rounds
    this.advanceCompletedMatches(tournament);

    this.tournamentSubject.next(tournament);
    this.saveToStorage(tournament);
    return tournament;
  }

  private generateFirstRound(players: string[]): Match[] {
    const matches: Match[] = [];
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    
    // Handle odd number
    if (shuffled.length % 2 !== 0) {
      const byeIndex = Math.floor(Math.random() * shuffled.length);
      const byePlayer = shuffled[byeIndex];
      shuffled.splice(byeIndex, 1);
      
      // Create a bye match (single player advances)
      const byeMatch: Match = {
        id: `match-${Date.now()}-bye-${Math.random()}`,
        round: 1,
        player1: byePlayer,
        player2: null,
        winner: byePlayer,
        isBye: true,
        isComplete: true
      };
      matches.push(byeMatch);
    }

    // Create pairs
    for (let i = 0; i < shuffled.length; i += 2) {
      const match: Match = {
        id: `match-${Date.now()}-r1-${i}-${Math.random()}`,
        round: 1,
        player1: shuffled[i],
        player2: shuffled[i + 1] || null,
        winner: null,
        isBye: false,
        isComplete: false
      };
      matches.push(match);
    }

    return matches;
  }

  private generateNextRound(round: number, previousRoundMatches: Match[]): Match[] {
    const matches: Match[] = [];
    const numMatches = Math.ceil(previousRoundMatches.length / 2);

    for (let i = 0; i < numMatches; i++) {
      const match: Match = {
        id: `match-${Date.now()}-r${round}-${i}-${Math.random()}`,
        round,
        player1: null,
        player2: null,
        winner: null,
        isBye: false,
        isComplete: false
      };
      matches.push(match);
    }

    // Link matches - each next round match gets winners from two previous matches
    let prevIndex = 0;
    matches.forEach((match) => {
      const match1 = previousRoundMatches[prevIndex];
      const match2 = previousRoundMatches[prevIndex + 1];
      
      if (match1) {
        match1.childMatchId = match.id;
        // Store which position this match feeds (player1)
        (match1 as any).childPosition = 'player1';
      }
      if (match2) {
        match2.childMatchId = match.id;
        // Store which position this match feeds (player2)
        (match2 as any).childPosition = 'player2';
      }
      
      prevIndex += 2;
    });

    return matches;
  }

  selectWinner(matchId: string, winner: string): void {
    const tournament = this.tournamentSubject.value;
    if (!tournament) return;

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match || match.isComplete) return;

    // Validate winner is one of the players
    if (winner !== match.player1 && winner !== match.player2) {
      return;
    }

    match.winner = winner;
    match.isComplete = true;

    // Advance winner to next round
    if (match.childMatchId) {
      const nextMatch = tournament.matches.find(m => m.id === match.childMatchId);
      if (nextMatch) {
        // Use stored position or determine from parent matches
        const childPosition = (match as any).childPosition;
        if (childPosition === 'player1') {
          nextMatch.player1 = winner;
        } else if (childPosition === 'player2') {
          nextMatch.player2 = winner;
        } else {
          // Fallback: find which position by checking parent matches
          const parentMatches = tournament.matches.filter(m => m.childMatchId === nextMatch.id);
          const isFirstParent = parentMatches[0]?.id === matchId;
          if (isFirstParent) {
            nextMatch.player1 = winner;
          } else {
            nextMatch.player2 = winner;
          }
        }
      }
    }

    // Check if current round is complete and handle odd number of winners
    this.handleRoundCompletion(tournament, match.round);

    // Check if tournament is complete
    const finalMatch = tournament.matches.find(m => m.round === tournament.totalRounds);
    if (finalMatch?.isComplete) {
      tournament.isComplete = true;
    }

    this.tournamentSubject.next(tournament);
    this.saveToStorage(tournament);
  }

  private handleRoundCompletion(tournament: Tournament, completedRound: number): void {
    // Get all matches from the completed round (excluding byes)
    const roundMatches = tournament.matches.filter(m => m.round === completedRound && !m.isBye);
    
    // Check if all non-bye matches in this round are complete
    const allComplete = roundMatches.every(m => m.isComplete);
    if (!allComplete) return;

    // Get all winners from this round (including byes)
    const allRoundMatches = tournament.matches.filter(m => m.round === completedRound);
    const winners = allRoundMatches
      .filter(m => m.winner)
      .map(m => m.winner!);

    // If odd number of winners, create a bye for the next round
    if (winners.length % 2 !== 0 && completedRound < tournament.totalRounds) {
      // Randomly select one winner to get a bye
      const byeWinner = winners[Math.floor(Math.random() * winners.length)];
      
      // Find the next round matches
      const nextRoundMatches = tournament.matches.filter(m => m.round === completedRound + 1);
      
      // Check if there's already a bye in the next round
      const hasByeInNextRound = nextRoundMatches.some(m => m.isBye);
      if (hasByeInNextRound) return; // Already has a bye
      
      // Find a match in the next round that doesn't have both players filled yet
      let byeMatch = nextRoundMatches.find(m => (!m.player1 || !m.player2) && !m.isBye);
      
      if (byeMatch) {
        // Fill the empty slot with the bye winner
        if (!byeMatch.player1) {
          byeMatch.player1 = byeWinner;
        } else if (!byeMatch.player2) {
          byeMatch.player2 = byeWinner;
        }
        
        // Mark as bye and complete
        byeMatch.isBye = true;
        byeMatch.winner = byeWinner;
        byeMatch.isComplete = true;
        
        // Advance to next round if exists
        if (byeMatch.childMatchId) {
          const nextMatch = tournament.matches.find(m => m.id === byeMatch!.childMatchId);
          if (nextMatch) {
            const childPosition = (byeMatch as any).childPosition;
            if (childPosition === 'player1') {
              nextMatch.player1 = byeWinner;
            } else if (childPosition === 'player2') {
              nextMatch.player2 = byeWinner;
            } else {
              // Fallback
              if (!nextMatch.player1) {
                nextMatch.player1 = byeWinner;
              } else {
                nextMatch.player2 = byeWinner;
              }
            }
          }
        }
      } else {
        // All matches are filled, need to create a new bye match
        // This shouldn't happen in normal flow, but handle it anyway
        const byeMatchId = `match-${Date.now()}-bye-r${completedRound + 1}-${Math.random()}`;
        byeMatch = {
          id: byeMatchId,
          round: completedRound + 1,
          player1: byeWinner,
          player2: null,
          winner: byeWinner,
          isBye: true,
          isComplete: true
        };
        tournament.matches.push(byeMatch);
        
        // Link this bye match to the next round match if needed
        if (completedRound + 1 < tournament.totalRounds && byeMatch) {
          const nextRound = completedRound + 2;
          const nextRoundMatches = tournament.matches.filter(m => m.round === nextRound);
          if (nextRoundMatches.length > 0) {
            const targetMatch = nextRoundMatches.find(m => !m.player1 || !m.player2);
            if (targetMatch && byeMatch) {
              byeMatch.childMatchId = targetMatch.id;
              (byeMatch as any).childPosition = targetMatch.player1 ? 'player2' : 'player1';
              if (!targetMatch.player1) {
                targetMatch.player1 = byeWinner;
              } else {
                targetMatch.player2 = byeWinner;
              }
            }
          }
        }
      }
    }
  }

  editMatch(matchId: string): void {
    const tournament = this.tournamentSubject.value;
    if (!tournament) return;

    const match = tournament.matches.find(m => m.id === matchId);
    if (!match) return;

    // Reopen match
    match.winner = null;
    match.isComplete = false;

    // Clear and recalculate subsequent rounds
    this.clearSubsequentRounds(tournament, match);

    this.tournamentSubject.next(tournament);
    this.saveToStorage(tournament);
  }

  private advanceCompletedMatches(tournament: Tournament): void {
    // Find all completed matches and advance their winners
    tournament.matches.forEach(match => {
      if (match.isComplete && match.winner && match.childMatchId) {
        const nextMatch = tournament.matches.find(m => m.id === match.childMatchId);
        if (nextMatch) {
          const childPosition = (match as any).childPosition;
          if (childPosition === 'player1') {
            nextMatch.player1 = match.winner;
          } else if (childPosition === 'player2') {
            nextMatch.player2 = match.winner;
          } else {
            // Fallback
            const parentMatches = tournament.matches.filter(m => m.childMatchId === nextMatch.id);
            const isFirstParent = parentMatches[0]?.id === match.id;
            if (isFirstParent) {
              nextMatch.player1 = match.winner;
            } else {
              nextMatch.player2 = match.winner;
            }
          }
        }
      }
    });
  }

  private clearSubsequentRounds(tournament: Tournament, editedMatch: Match): void {
    const editedRound = editedMatch.round;
    
    // Clear all matches in rounds after the edited match
    tournament.matches.forEach(m => {
      if (m.round > editedRound) {
        m.winner = null;
        m.isComplete = false;
        m.player1 = null;
        m.player2 = null;
      }
    });

    // Recalculate player positions in next round
    if (editedMatch.childMatchId) {
      const nextMatch = tournament.matches.find(m => m.id === editedMatch.childMatchId);
      if (nextMatch) {
        // Find which position this match feeds into
        const parentMatches = tournament.matches.filter(m => m.childMatchId === nextMatch.id);
        nextMatch.player1 = parentMatches[0]?.winner || null;
        nextMatch.player2 = parentMatches[1]?.winner || null;
      }
    }
  }

  getMatchesByRound(round: number): Match[] {
    const tournament = this.tournamentSubject.value;
    if (!tournament) return [];
    return tournament.matches.filter(m => m.round === round);
  }

  exportTournament(): string {
    const tournament = this.tournamentSubject.value;
    if (!tournament) return '';
    return JSON.stringify(tournament, null, 2);
  }

  importTournament(json: string): void {
    try {
      const tournament: Tournament = JSON.parse(json);
      this.tournamentSubject.next(tournament);
      this.saveToStorage(tournament);
    } catch (error) {
      throw new Error('Invalid tournament JSON');
    }
  }

  clearTournament(): void {
    this.tournamentSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveToStorage(tournament: Tournament): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tournament));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const tournament: Tournament = JSON.parse(stored);
        this.tournamentSubject.next(tournament);
      } catch (error) {
        console.error('Failed to load tournament from storage', error);
      }
    }
  }
}
