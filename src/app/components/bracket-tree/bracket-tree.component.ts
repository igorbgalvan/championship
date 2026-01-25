import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { TranslationService } from '../../services/translation.service';
import { MatchNodeComponent } from '../match-node/match-node.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bracket-tree',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzTypographyModule,
    NzIconModule,
    NzModalModule,
    MatchNodeComponent
  ],
  template: `
    <div class="bracket-container">
      <div class="bracket-header">
        <h2>{{ tournament.name }}</h2>
        <div class="bracket-actions">
          <button 
            nz-button 
            nzType="default"
            (click)="exportTournament()"
            class="action-btn"
          >
            <span nz-icon nzType="download" nzTheme="outline"></span>
            {{ t.get('bracket.export') }}
          </button>
          <button 
            nz-button 
            nzType="default"
            (click)="importTournament()"
            class="action-btn"
          >
            <span nz-icon nzType="upload" nzTheme="outline"></span>
            {{ t.get('bracket.import') }}
          </button>
          <button 
            nz-button 
            nzType="default"
            nzDanger
            (click)="clearTournament()"
            class="action-btn"
          >
            <span nz-icon nzType="delete" nzTheme="outline"></span>
            {{ t.get('bracket.new') }}
          </button>
        </div>
      </div>

      <!-- Desktop: Vertical Tree -->
      <div class="bracket-tree-desktop">
        @for (round of rounds; track round) {
          <div class="round-column" [class.current-round]="isCurrentRound(round)">
            <h3 class="round-title" [class.current-round-title]="isCurrentRound(round)">{{ t.get('bracket.round', { number: round.toString() }) }}</h3>
            <div class="matches-container">
              @for (match of getMatchesByRound(round); track match.id) {
                <app-match-node 
                  [match]="match"
                  [isFinal]="round === tournament.totalRounds"
                  (winnerSelected)="onWinnerSelected($event)"
                  (matchEdited)="onMatchEdited($event)"
                ></app-match-node>
              }
            </div>
          </div>
        }
      </div>

      <!-- Mobile: Horizontal Scroll -->
      <div class="bracket-tree-mobile" #mobileContainer>
        @for (round of rounds; track round) {
          <div class="round-column-mobile" [class.current-round]="isCurrentRound(round)" #roundColumn>
            <h3 class="round-title" [class.current-round-title]="isCurrentRound(round)">{{ t.get('bracket.round', { number: round.toString() }) }}</h3>
            <div class="matches-container-mobile">
              @for (match of getMatchesByRound(round); track match.id) {
                <app-match-node 
                  [match]="match"
                  [isFinal]="round === tournament.totalRounds"
                  (winnerSelected)="onWinnerSelected($event)"
                  (matchEdited)="onMatchEdited($event)"
                ></app-match-node>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .bracket-container {
      width: 100%;
    }

    .bracket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .bracket-header h2 {
      color: var(--accent-cyan);
      margin: 0;
      font-size: 1.8rem;
    }

    .bracket-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      background: var(--bg-secondary);
      border-color: var(--border-color);
      color: var(--text-primary);
    }

    /* Desktop Layout */
    .bracket-tree-desktop {
      display: flex;
      justify-content: center;
      gap: 3rem;
      padding: 2rem 0;
    }

    .round-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 250px;
      padding: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .round-column.current-round {
      transform: scale(1.08);
      z-index: 10;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(74, 144, 226, 0.1) 100%);
      border: 3px solid var(--accent-cyan);
      box-shadow: 
        0 0 30px rgba(0, 212, 255, 0.5),
        0 0 60px rgba(0, 212, 255, 0.3),
        inset 0 0 20px rgba(0, 212, 255, 0.1);
      animation: columnGlow 2s ease-in-out infinite;
    }

    @keyframes columnGlow {
      0%, 100% {
        box-shadow: 
          0 0 30px rgba(0, 212, 255, 0.5),
          0 0 60px rgba(0, 212, 255, 0.3),
          inset 0 0 20px rgba(0, 212, 255, 0.1);
        border-color: var(--accent-cyan);
      }
      50% {
        box-shadow: 
          0 0 40px rgba(0, 212, 255, 0.7),
          0 0 80px rgba(0, 212, 255, 0.5),
          inset 0 0 30px rgba(0, 212, 255, 0.2);
        border-color: var(--accent-cyan);
      }
    }

    .round-title {
      color: var(--accent-purple);
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
      text-align: center;
      padding: 0.5rem 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .round-title.current-round-title {
      color: var(--accent-cyan);
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(74, 144, 226, 0.2) 100%);
      border: 3px solid var(--accent-cyan);
      box-shadow: 0 0 25px rgba(0, 212, 255, 0.6);
      animation: roundPulse 2s ease-in-out infinite;
      font-weight: bold;
      text-shadow: 0 0 10px var(--accent-cyan);
    }

    @keyframes roundPulse {
      0%, 100% {
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.6);
      }
      50% {
        box-shadow: 0 0 35px rgba(0, 212, 255, 0.8);
      }
    }

    .matches-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Mobile Layout */
    .bracket-tree-mobile {
      display: none;
    }


    @media (max-width: 768px) {
      .bracket-tree-desktop {
        display: none;
      }

      .bracket-tree-mobile {
        display: flex;
        overflow-x: auto;
        gap: 1rem;
        padding: 1rem 1rem;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scroll-padding: 0 1rem;
        position: relative;
      }

      .round-column-mobile {
        min-width: calc(100vw - 2rem);
        max-width: calc(100vw - 2rem);
        scroll-snap-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem 1rem;
        margin: 0 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        flex-shrink: 0;
        box-sizing: border-box;
      }

      .round-column-mobile.current-round {
        transform: scale(1.02);
        z-index: 10;
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(74, 144, 226, 0.1) 100%);
        border: 3px solid var(--accent-cyan);
        box-shadow: 
          0 0 25px rgba(0, 212, 255, 0.5),
          0 0 50px rgba(0, 212, 255, 0.3),
          inset 0 0 15px rgba(0, 212, 255, 0.1);
        animation: columnGlowMobile 2s ease-in-out infinite;
        padding: 1.5rem 1rem;
      }

      @keyframes columnGlowMobile {
        0%, 100% {
          box-shadow: 
            0 0 25px rgba(0, 212, 255, 0.5),
            0 0 50px rgba(0, 212, 255, 0.3),
            inset 0 0 15px rgba(0, 212, 255, 0.1);
          border-color: var(--accent-cyan);
        }
        50% {
          box-shadow: 
            0 0 35px rgba(0, 212, 255, 0.7),
            0 0 70px rgba(0, 212, 255, 0.5),
            inset 0 0 25px rgba(0, 212, 255, 0.2);
          border-color: var(--accent-cyan);
        }
      }

      .matches-container-mobile {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
      }

      .bracket-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .bracket-header h2 {
        font-size: 1.4rem;
        margin-bottom: 1rem;
      }

      .bracket-actions {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      /* First two buttons (Export and Import) in same row */
      .bracket-actions .action-btn:nth-child(1),
      .bracket-actions .action-btn:nth-child(2) {
        flex: 1;
        min-width: calc(50% - 0.25rem);
        max-width: calc(50% - 0.25rem);
      }

      /* Third button (New Tournament) on new line, full width */
      .bracket-actions .action-btn:nth-child(3) {
        width: 100%;
        flex: 1 1 100%;
      }
    }
  `]
})
export class BracketTreeComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @Input() tournament!: Tournament;
  @ViewChild('mobileContainer') mobileContainer?: ElementRef;

  private previousCurrentRound: number = 1;
  private previousIsComplete: boolean = false;
  private championModalVisible: boolean = false;
  private tournamentSubscription?: Subscription;

  get rounds(): number[] {
    return Array.from({ length: this.tournament.totalRounds }, (_, i) => i + 1);
  }

  constructor(
    private tournamentService: TournamentService,
    private modal: NzModalService,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    // Subscribe to tournament changes to detect completion and round changes
    this.tournamentSubscription = this.tournamentService.tournament$.subscribe(tournament => {
      if (tournament) {
        const wasComplete = this.previousIsComplete;
        const isNowComplete = tournament.isComplete;
        
        if (isNowComplete && !wasComplete) {
          this.previousIsComplete = true;
          setTimeout(() => this.showChampionModal(), 300);
        } else {
          this.previousIsComplete = isNowComplete;
        }

        // Check if current round changed and scroll to it on mobile
        const currentRoundIndex = this.rounds.findIndex(r => this.isCurrentRound(r));
        if (currentRoundIndex >= 0 && currentRoundIndex + 1 !== this.previousCurrentRound) {
          this.previousCurrentRound = currentRoundIndex + 1;
          // Scroll to new current round on mobile
          setTimeout(() => this.scrollToCurrentRound(), 500);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tournamentSubscription) {
      this.tournamentSubscription.unsubscribe();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tournament']) {
      const wasComplete = this.previousIsComplete;
      const isNowComplete = this.tournament.isComplete;
      
      // Check if tournament just completed
      if (isNowComplete && !wasComplete) {
        this.previousIsComplete = true;
        setTimeout(() => this.showChampionModal(), 500);
      } else {
        this.previousIsComplete = isNowComplete;
      }

      // Check if current round changed (only if not first change)
      if (!changes['tournament'].firstChange) {
        const newCurrentRound = this.rounds.findIndex(r => this.isCurrentRound(r)) + 1;
        if (newCurrentRound !== this.previousCurrentRound) {
          this.previousCurrentRound = newCurrentRound;
          // Scroll to new current round on mobile - wait a bit longer for DOM update
          setTimeout(() => this.scrollToCurrentRound(), 500);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // Scroll to current round on mobile after view init
    setTimeout(() => {
      this.scrollToCurrentRound();
      // Also scroll on window resize for mobile
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
          setTimeout(() => this.scrollToCurrentRound(), 100);
        }
      });
    }, 300);
    
    // Check if tournament is already complete on init
    if (this.tournament.isComplete) {
      this.previousIsComplete = true;
      setTimeout(() => this.showChampionModal(), 500);
    }
  }

  isCurrentRound(round: number): boolean {
    // Find the first round that has incomplete matches (excluding byes)
    let firstIncompleteRound: number | null = null;
    
    for (let r = 1; r <= this.tournament.totalRounds; r++) {
      const roundMatches = this.tournament.matches.filter(m => m.round === r);
      const hasIncomplete = roundMatches.some(m => !m.isComplete && !m.isBye);
      
      if (hasIncomplete) {
        firstIncompleteRound = r;
        break;
      }
    }
    
    // If no incomplete round found, the tournament is complete
    // Highlight the final round
    if (firstIncompleteRound === null) {
      return round === this.tournament.totalRounds;
    }
    
    // Only highlight the first round with incomplete matches
    return round === firstIncompleteRound;
  }

  scrollToCurrentRound(): void {
    if (!this.mobileContainer) return;
    
    // Only scroll on mobile
    if (window.innerWidth > 768) return;
    
    const currentRoundIndex = this.rounds.findIndex(r => this.isCurrentRound(r));
    if (currentRoundIndex >= 0) {
      const container = this.mobileContainer.nativeElement;
      const roundColumns = container.querySelectorAll('.round-column-mobile');
      if (roundColumns[currentRoundIndex]) {
        const targetElement = roundColumns[currentRoundIndex] as HTMLElement;
        
        // Use scrollIntoView for better mobile compatibility
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }

  getMatchesByRound(round: number) {
    return this.tournamentService.getMatchesByRound(round);
  }

  onWinnerSelected(data: { matchId: string; winner: string }): void {
    this.tournamentService.selectWinner(data.matchId, data.winner);
  }

  onMatchEdited(matchId: string): void {
    this.tournamentService.editMatch(matchId);
  }

  getChampion(): string {
    const finalMatch = this.tournament.matches.find(m => m.round === this.tournament.totalRounds);
    return finalMatch?.winner || '';
  }

  exportTournament(): void {
    const json = this.tournamentService.exportTournament();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-${this.tournament.name || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importTournament(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            this.tournamentService.importTournament(e.target.result);
          } catch (error) {
            alert(this.t.get('action.import.error'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  clearTournament(): void {
    if (confirm(this.t.get('action.confirm.clear'))) {
      this.tournamentService.clearTournament();
      window.location.reload();
    }
  }

  showChampionModal(): void {
    if (this.championModalVisible) return;
    
    this.championModalVisible = true;
    const champion = this.getChampion();
    
    if (!champion) {
      console.warn('Champion not found');
      this.championModalVisible = false;
      return;
    }
    
    const modalRef = this.modal.create({
      nzTitle: '',
      nzContent: `
        <div class="champion-modal-content">
          <div class="champion-icon">🏆</div>
          <h1 class="champion-title">${this.t.get('modal.champion.title')}</h1>
          <p class="champion-name">${champion}</p>
        </div>
      `,
      nzFooter: [
        {
          label: this.t.get('modal.champion.new'),
          type: 'primary',
          onClick: () => {
            this.tournamentService.clearTournament();
            modalRef.close();
            this.championModalVisible = false;
            window.location.reload();
          }
        }
      ],
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 500,
      nzCentered: true,
      nzBodyStyle: {
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-secondary)'
      },
      nzStyle: {
        '--champion-glow': '#ffd700',
        '--accent-cyan': '#00d4ff'
      },
      nzOnCancel: () => {
        this.championModalVisible = false;
      }
    });
  }
}
