import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import AppTheme from './theme/app-theme';

import {
  LucideBox,
  LucideBoxes,
  LucideBringToFront,
  LucideChartSpline,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideHouse,
  LucideLogOut,
  LucideMegaphone,
  LucideMenu,
  LucidePackagePlus,
  LucideSettings,
  LucideShoppingBag,
  LucideUsers,
  LucideWarehouse,

  provideLucideIcons
} from '@lucide/angular';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideLucideIcons(
      LucideShoppingBag,
      LucideMenu,
      LucideHouse,
      LucideBringToFront,
      LucideBox,
      LucideBoxes,
      LucidePackagePlus,
      LucideUsers,
      LucideWarehouse,
      LucideChartSpline,
      LucideSettings,
      LucideLogOut,
      LucideChevronRight
    ),
  ],
};
