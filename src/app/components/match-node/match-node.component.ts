import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Match } from '../../models/match.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-match-node',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, NzIconModule],
  template: `
    <div class="match-node" [class.complete]="match.isComplete" [class.final]="isFinal">
      <nz-card class="match-card">
        @if (match.isBye) {
          <div class="bye-match">
            <div class="player-slot bye-player">
              {{ match.player1 }}
            </div>
            <div class="bye-label">BYE</div>
          </div>
        } @else {
          <div class="match-players">
            <button 
              class="player-button"
              [class.winner]="match.winner === match.player1"
              [class.disabled]="match.isComplete && match.winner !== match.player1"
              [disabled]="!match.player1 || (match.isComplete && match.winner !== match.player1)"
              (click)="selectWinner(match.player1!)"
            >
              <span class="player-name">{{ match.player1 || t.get('bracket.tbd') }}</span>
            </button>
            
            <div class="vs-divider">{{ t.get('bracket.vs') }}</div>
            
            <button 
              class="player-button"
              [class.winner]="match.winner === match.player2"
              [class.disabled]="match.isComplete && match.winner !== match.player2"
              [disabled]="!match.player2 || (match.isComplete && match.winner !== match.player2)"
              (click)="selectWinner(match.player2!)"
            >
              <span class="player-name">{{ match.player2 || t.get('bracket.tbd') }}</span>
            </button>
          </div>

          @if (match.isComplete) {
            <div class="match-actions">
              <button 
                nz-button 
                nzType="text"
                nzSize="small"
                (click)="editMatch()"
                class="edit-button"
              >
                <span nz-icon nzType="edit" nzTheme="outline"></span>
                {{ t.get('bracket.edit') }}
              </button>
            </div>
          }
        }
      </nz-card>
    </div>
  `,
  styles: [`
    .match-node {
      position: relative;
      transition: transform 0.3s ease;
    }

    .match-node:hover {
      transform: translateY(-2px);
    }

    .match-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      min-width: 220px;
      transition: all 0.3s ease;
    }

    .match-node.complete .match-card {
      border-color: var(--accent-blue);
      box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
    }

    .match-node.final .match-card {
      border-color: var(--champion-glow);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    }

    .match-players {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .player-button {
      width: 100%;
      padding: 1rem;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      position: relative;
      overflow: hidden;
    }

    .player-button:hover:not(:disabled) {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
    }

    .player-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .player-button.winner {
      background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
      border-color: var(--winner-glow);
      color: #fff;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
      animation: winnerPulse 2s ease-in-out infinite;
    }

    .player-button.disabled:not(.winner) {
      opacity: 0.3;
    }

    .player-name {
      font-weight: bold;
      letter-spacing: 0.05em;
    }

    .vs-divider {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: bold;
      padding: 0.5rem 0;
      letter-spacing: 0.2em;
    }

    .bye-match {
      text-align: center;
      padding: 1rem;
    }

    .bye-player {
      padding: 1rem;
      background: var(--bg-tertiary);
      border: 2px solid var(--accent-purple);
      color: var(--accent-purple);
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .bye-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-style: italic;
    }

    .match-actions {
      margin-top: 0.5rem;
      text-align: center;
    }

    .edit-button {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .edit-button:hover {
      color: var(--accent-cyan);
    }

    @keyframes winnerPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
      }
      50% {
        box-shadow: 0 0 30px rgba(0, 255, 136, 0.9);
      }
    }

    @media (max-width: 768px) {
      .match-card {
        min-width: 200px;
      }
    }
  `]
})
export class MatchNodeComponent {
  @Input() match!: Match;
  @Input() isFinal: boolean = false;
  @Output() winnerSelected = new EventEmitter<{ matchId: string; winner: string }>();
  @Output() matchEdited = new EventEmitter<string>();

  constructor(public t: TranslationService) {}

  selectWinner(player: string): void {
    if (!this.match.isComplete && (player === this.match.player1 || player === this.match.player2)) {
      this.winnerSelected.emit({ matchId: this.match.id, winner: player });
    }
  }

  editMatch(): void {
    this.matchEdited.emit(this.match.id);
  }
}
