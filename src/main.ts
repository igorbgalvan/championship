import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(en);

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideNzI18n(en_US),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
