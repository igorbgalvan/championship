import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentSetupComponent } from './components/tournament-setup/tournament-setup.component';
import { BracketTreeComponent } from './components/bracket-tree/bracket-tree.component';
import { TournamentService } from './services/tournament.service';
import { Observable } from 'rxjs';
import { Tournament } from './models/tournament.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TournamentSetupComponent, BracketTreeComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">🏆 CHAMPIONSHIP</h1>
        <p class="app-subtitle">Single-Elimination Tournament Bracket</p>
      </header>
      
      <main class="app-main">
        @if (tournament$ | async; as tournament) {
          <app-bracket-tree [tournament]="tournament"></app-bracket-tree>
        } @else {
          <app-tournament-setup></app-tournament-setup>
        }
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .app-header {
      text-align: center;
      padding: 2rem 1rem;
      border-bottom: 2px solid var(--border-color);
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--accent-cyan);
      text-shadow: 0 0 10px var(--accent-cyan);
      margin-bottom: 0.5rem;
      letter-spacing: 0.2em;
    }

    .app-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      letter-spacing: 0.1em;
    }

    .app-main {
      padding: 2rem 1rem;
      max-width: 100%;
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 1.8rem;
      }
      
      .app-header {
        padding: 1.5rem 1rem;
      }

      .app-main {
        padding: 1rem 0;
        overflow-x: hidden;
      }
    }
  `]
})
export class AppComponent {
  tournament$: Observable<Tournament | null>;

  constructor(private tournamentService: TournamentService) {
    this.tournament$ = this.tournamentService.tournament$;
  }
}
