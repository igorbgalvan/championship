import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { en_US, pt_BR, es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import pt from '@angular/common/locales/pt';
import es from '@angular/common/locales/es';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

registerLocaleData(en);
registerLocaleData(pt);
registerLocaleData(es);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pt',
    pathMatch: 'full'
  },
  {
    path: ':lang',
    component: AppComponent
  },
  {
    path: '**',
    redirectTo: '/pt'
  }
];

// Get initial language
const getInitialLanguage = (): string => {
  const pathLang = window.location.pathname.match(/^\/(pt|en|es)/)?.[1];
  return pathLang || localStorage.getItem('championship_language') || 'pt';
};

const initialLang = getInitialLanguage();
const localeMap: Record<string, any> = {
  'pt': pt_BR,
  'en': en_US,
  'es': es_ES
};

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    provideNzI18n(localeMap[initialLang] || pt_BR)
  ]
}).catch(err => console.error(err));
