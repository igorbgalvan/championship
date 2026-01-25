import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { translations } from '../translations/translations';

export type Language = 'pt' | 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public currentLanguageSubject = new BehaviorSubject<Language>('pt');
  public currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  constructor() {
    // Get language from URL or localStorage
    const urlLang = this.getLanguageFromUrl();
    const storedLang = localStorage.getItem('championship_language') as Language;
    const initialLang = urlLang || storedLang || 'pt';
    // Set without reload on init
    this.currentLanguageSubject.next(initialLang);
    localStorage.setItem('championship_language', initialLang);
  }

  private getLanguageFromUrl(): Language | null {
    const path = window.location.pathname;
    const match = path.match(/^\/(pt|en|es)/);
    return match ? (match[1] as Language) : null;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language, skipReload: boolean = false): void {
    // Avoid reload if language is already set
    if (this.currentLanguageSubject.value === lang) {
      return;
    }
    
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('championship_language', lang);
    // Update URL - get current path without language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(pt|en|es)/, '') || '';
    const newPath = `/${lang}${pathWithoutLang}`;
    
    // Only reload if URL actually changed
    if (window.location.pathname !== newPath && !skipReload) {
      window.location.href = newPath;
    }
  }

  translate(key: string, params?: Record<string, string>): string {
    const lang = this.currentLanguageSubject.value;
    let translation = translations[lang]?.[key] || key;

    // Replace parameters
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{{${paramKey}}}`, params[paramKey]);
      });
    }

    return translation;
  }

  get(key: string, params?: Record<string, string>): string {
    return this.translate(key, params);
  }
}
