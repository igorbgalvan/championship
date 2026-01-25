import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NzIconModule],
  template: `
    <nz-select
      [ngModel]="currentLanguage"
      (ngModelChange)="onLanguageChange($event)"
      class="language-selector"
      nzSize="small"
    >
      <nz-option nzValue="pt" nzLabel="🇧🇷 Português"></nz-option>
      <nz-option nzValue="en" nzLabel="🇺🇸 English"></nz-option>
      <nz-option nzValue="es" nzLabel="🇪🇸 Español"></nz-option>
    </nz-select>
  `,
  styles: [`
    .language-selector {
      min-width: 140px;
    }

    ::ng-deep .language-selector .ant-select-selector {
      background: var(--bg-secondary) !important;
      border-color: var(--border-color) !important;
      color: var(--text-primary) !important;
    }

    ::ng-deep .language-selector .ant-select-selection-item {
      color: var(--text-primary) !important;
    }

    ::ng-deep .language-selector .ant-select-arrow {
      color: var(--text-secondary) !important;
    }
  `]
})
export class LanguageSelectorComponent {
  currentLanguage: Language = 'pt';

  constructor(private translationService: TranslationService) {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onLanguageChange(lang: Language): void {
    this.translationService.setLanguage(lang);
  }
}
