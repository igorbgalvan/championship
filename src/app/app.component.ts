import { Component, OnInit, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TournamentSetupComponent } from './components/tournament-setup/tournament-setup.component';
import { BracketTreeComponent } from './components/bracket-tree/bracket-tree.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { TournamentService } from './services/tournament.service';
import { TranslationService } from './services/translation.service';
import { Observable, Subscription } from 'rxjs';
import { Tournament } from './models/tournament.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TournamentSetupComponent, BracketTreeComponent, LanguageSelectorComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="app-title">{{ t.get('app.title') }}</h1>
            <p class="app-subtitle">{{ t.get('app.subtitle') }}</p>
          </div>
          <app-language-selector></app-language-selector>
        </div>
      </header>
      
      <main class="app-main">
        @if (tournament$ | async; as tournament) {
          <app-bracket-tree [tournament]="tournament"></app-bracket-tree>
        } @else {
          <app-tournament-setup></app-tournament-setup>
        }
      </main>
      
      <footer class="app-footer">
        <p>
          Desenvolvido usando <a href="https://angular.io" target="_blank" rel="noopener noreferrer">Angular</a>
          • Feito com <span class="heart">❤️</span> por 
          <a href="https://github.com/igorbgalvan" target="_blank" rel="noopener noreferrer">Igor</a>
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .app-header {
      padding: 2rem 1rem;
      border-bottom: 2px solid var(--border-color);
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .header-text {
      text-align: center;
      flex: 1;
      min-width: 100%;
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

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .header-text {
        min-width: 100%;
      }

      .app-main {
        padding: 1rem 0;
        overflow-x: hidden;
      }
    }

    .app-footer {
      text-align: center;
      padding: 2rem 1rem;
      margin-top: 3rem;
      border-top: 1px solid var(--border-color);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .app-footer p {
      margin: 0;
    }

    .app-footer a {
      color: var(--accent-cyan);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .app-footer a:hover {
      color: var(--accent-blue);
      text-shadow: 0 0 5px var(--accent-cyan);
    }

    .app-footer .heart {
      color: #ff4d4f;
      animation: heartbeat 1.5s ease-in-out infinite;
    }

    @keyframes heartbeat {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  tournament$: Observable<Tournament | null>;
  private langSubscription?: Subscription;
  private langMap: Record<string, string> = {
    'pt': 'pt-BR',
    'en': 'en-US',
    'es': 'es-ES'
  };

  constructor(
    private tournamentService: TournamentService,
    public t: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private title: Title,
    private meta: Meta
  ) {
    this.tournament$ = this.tournamentService.tournament$;
  }

  ngOnInit(): void {
    // Initialize language from route - only once
    const lang = this.route.snapshot.params['lang'] as string;
    if (lang && ['pt', 'en', 'es'].includes(lang)) {
      const currentLang = this.t.getCurrentLanguage();
      if (currentLang !== lang) {
        // Only update if different to avoid reload loop - use skipReload flag
        this.t.setLanguage(lang as any, true);
      }
      this.updateHtmlLang(lang);
    } else if (!lang || !['pt', 'en', 'es'].includes(lang)) {
      // Redirect to default language if invalid - only if not already on a valid route
      const currentPath = window.location.pathname;
      if (!currentPath.match(/^\/(pt|en|es)/)) {
        const defaultLang = this.t.getCurrentLanguage();
        this.router.navigate([`/${defaultLang}`], { replaceUrl: true });
      }
    }

    // Subscribe to language changes to update HTML lang, document title and meta tags
    this.langSubscription = this.t.currentLanguage$.subscribe(lang => {
      this.updateHtmlLang(lang);
      this.updateSeoForLanguage();
    });
    this.updateSeoForLanguage();
  }

  private updateSeoForLanguage(): void {
    const pageTitle = this.t.get('seo.pageTitle');
    const metaDescription = this.t.get('seo.metaDescription');
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'title', content: pageTitle });
    this.meta.updateTag({ name: 'description', content: metaDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: metaDescription });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private updateHtmlLang(lang: string): void {
    const htmlLang = this.langMap[lang] || 'pt-BR';
    this.renderer.setAttribute(this.document.documentElement, 'lang', htmlLang);
  }
}
