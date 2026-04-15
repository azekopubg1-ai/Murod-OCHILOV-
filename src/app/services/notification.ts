import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  alert(message: string) {
    if (this.isBrowser) {
      // In a real app, use a custom toast or modal
      // For now, we'll just guard the native alert
      alert(message);
    } else {
      console.log('Alert (SSR):', message);
    }
  }

  confirm(message: string): boolean {
    if (this.isBrowser) {
      // In a real app, use a custom modal
      return confirm(message);
    }
    console.log('Confirm (SSR):', message);
    return false;
  }
}
