import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNoopAnimations(),
    provideHttpClient(),
    provideHotToastConfig({
      position: "top-center",
      duration: 4000,
      theme: "toast",
      style: {
        borderRadius: "50px", // Use '12px' for a subtle curve, or '50px' for pill-shaped
        padding: "10px", // Optional: Give it a bit more breathing room
      },
    }),
  ],
};
