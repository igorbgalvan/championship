import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TournamentService } from '../../services/tournament.service';
import { TranslationService } from '../../services/translation.service';
import { PlayerInputComponent } from '../player-input/player-input.component';

@Component({
  selector: 'app-tournament-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    NzTypographyModule,
    PlayerInputComponent
  ],
  template: `
    <div class="setup-container">
      <nz-card class="setup-card">
        <h2>{{ t.get('setup.title') }}</h2>
        
        <div class="form-group">
          <label>{{ t.get('setup.name.label') }}</label>
          <input 
            nz-input 
            [(ngModel)]="tournamentName" 
            [placeholder]="t.get('setup.name.placeholder')"
            class="input-field"
          />
        </div>

        <button 
          nz-button 
          nzType="primary" 
          (click)="proceedToPlayerInput()"
          class="action-button"
        >
          {{ t.get('setup.continue') }}
        </button>
      </nz-card>

      @if (showPlayerInput) {
        <app-player-input 
          [tournamentName]="tournamentName"
          (playersSubmitted)="onPlayersSubmitted($event)"
        ></app-player-input>
      }
    </div>
  `,
  styles: [`
    .setup-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .setup-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    h2 {
      color: var(--accent-blue);
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .input-field {
      width: 100%;
      background: var(--bg-tertiary);
      border-color: var(--border-color);
      color: var(--text-primary);
    }

    .action-button {
      width: 100%;
      margin-top: 1rem;
      height: 45px;
      font-size: 1rem;
      font-weight: bold;
      letter-spacing: 0.05em;
    }

  `]
})
export class TournamentSetupComponent {
  tournamentName: string = '';
  showPlayerInput: boolean = false;

  constructor(
    private tournamentService: TournamentService,
    public t: TranslationService
  ) {}

  proceedToPlayerInput(): void {
    this.showPlayerInput = true;
  }

  onPlayersSubmitted(players: string[]): void {
    this.tournamentService.createTournament(this.tournamentName, players);
  }
}
