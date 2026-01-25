import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-player-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    NzTypographyModule,
    NzIconModule
  ],
  template: `
    <nz-card class="player-input-card">
      <h3>Add Players</h3>
      
      <div class="players-list">
        @for (player of players; track $index) {
          <div class="player-input-row">
            <span class="player-number">{{ $index + 1 }}.</span>
            <input 
              nz-input 
              [(ngModel)]="players[$index]"
              [placeholder]="'Player ' + ($index + 1)"
              class="player-input"
              (keyup.enter)="onPlayerInputEnter($index)"
            />
            @if ($index === players.length - 1 && players.length > 1) {
              <button 
                nz-button 
                nzType="text"
                nzDanger
                (click)="removePlayer($index)"
                class="remove-button"
                title="Remove player"
              >
                <span nz-icon nzType="delete" nzTheme="outline"></span>
              </button>
            }
          </div>
        }
      </div>

      <div class="add-player-section">
        <button 
          nz-button 
          nzType="dashed"
          (click)="addPlayer()"
          class="add-button"
        >
          <span nz-icon nzType="plus" nzTheme="outline"></span>
          Add Player
        </button>
        <span class="player-count">{{ players.length }} player{{ players.length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="actions">
        <button 
          nz-button 
          nzType="primary" 
          (click)="startTournament()"
          [disabled]="!canStartTournament()"
          class="start-button"
        >
          Start Tournament
        </button>
      </div>
    </nz-card>
  `,
  styles: [`
    .player-input-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    }

    h3 {
      color: var(--accent-purple);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .players-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .player-input-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .player-number {
      color: var(--accent-cyan);
      font-weight: bold;
      min-width: 30px;
      font-size: 1.1rem;
    }

    .player-input {
      flex: 1;
      background: var(--bg-tertiary);
      border-color: var(--border-color);
      color: var(--text-primary);
    }

    .remove-button {
      color: var(--text-secondary);
      min-width: auto;
      padding: 0 8px;
    }

    .remove-button:hover {
      color: #ff4d4f;
    }

    .add-player-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--bg-tertiary);
      border: 1px dashed var(--border-color);
      border-radius: 4px;
    }

    .add-button {
      flex: 1;
      margin-right: 1rem;
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }

    .add-button:hover {
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    .player-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 1rem;
    }

    .start-button {
      width: 100%;
      height: 45px;
      font-weight: bold;
      background: var(--accent-blue);
      border-color: var(--accent-blue);
    }
  `]
})
export class PlayerInputComponent implements OnInit {
  @Input() tournamentName: string = '';
  @Output() playersSubmitted = new EventEmitter<string[]>();

  players: string[] = [''];

  ngOnInit(): void {
    // Start with one empty player field
    this.players = [''];
  }

  addPlayer(): void {
    this.players.push('');
  }

  removePlayer(index: number): void {
    if (this.players.length > 1) {
      this.players.splice(index, 1);
    }
  }

  onPlayerInputEnter(index: number): void {
    // If current field is filled and it's the last one, add a new player
    if (this.players[index]?.trim() && index === this.players.length - 1) {
      this.addPlayer();
      // Focus on the new input (will be handled by browser)
      setTimeout(() => {
        const inputs = document.querySelectorAll('.player-input');
        if (inputs[this.players.length - 1]) {
          (inputs[this.players.length - 1] as HTMLInputElement).focus();
        }
      }, 0);
    }
  }

  canStartTournament(): boolean {
    // Need at least 2 players with names filled
    const filledPlayers = this.players.filter(p => p.trim().length > 0);
    return filledPlayers.length >= 2;
  }

  startTournament(): void {
    if (this.canStartTournament()) {
      const filledPlayers = this.players
        .map(p => p.trim())
        .filter(p => p.length > 0);
      this.playersSubmitted.emit(filledPlayers);
    }
  }
}
