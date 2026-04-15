import { Component, inject, computed } from '@angular/core';
import { TranslationService } from '../services/translation';
import { SettingsService } from '../services/settings';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, CommonModule],
  template: `
    <footer class="relative z-10 py-24 px-6 bg-black/80 border-t border-white/10">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <!-- Brand Section -->
        <div class="space-y-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-wrap gap-3">
              @for (img of settingsService.contactInfo().footerImages; track img) {
                <div class="w-16 h-16 rounded-2xl glass p-1 overflow-hidden shadow-xl shadow-emerald-500/10 hover:scale-110 transition-transform cursor-pointer">
                  <img 
                    [src]="img" 
                    class="w-full h-full object-cover rounded-xl"
                    alt="Footer Image"
                    referrerpolicy="no-referrer"
                  />
                </div>
              }
            </div>
            <div>
              <h3 class="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                {{ ts.translateObject(settingsService.contactInfo().siteName) }}
              </h3>
              <p class="text-emerald-400 text-xs font-medium tracking-wide uppercase">
                {{ ts.translateObject(settingsService.contactInfo().siteSubtitle) }}
              </p>
            </div>
          </div>
          
          <p class="text-white/60 leading-relaxed text-sm">
            {{ ts.translateObject(settingsService.contactInfo().footerDescription) }}
          </p>
        </div>

        <!-- Quick Links -->
        <div class="space-y-8">
          <h4 class="font-bold text-lg">{{ t()('nav.home') }}</h4>
          <nav class="flex flex-col gap-4 text-white/50 text-sm">
            <a routerLink="/" class="hover:text-emerald-400 transition-all">{{ t()('nav.home') }}</a>
            <a routerLink="/rooms" class="hover:text-emerald-400 transition-all">{{ t()('nav.rooms') }}</a>
            <a routerLink="/#contact" class="hover:text-emerald-400 transition-all">{{ t()('nav.contact') }}</a>
          </nav>
        </div>

        <!-- Info & Social -->
        <div class="space-y-8">
          <h4 class="font-bold text-lg">Ijtimoiy tarmoqlar</h4>
          <div class="flex flex-wrap gap-4">
            @for (link of settingsService.contactInfo().socialLinks; track link.url) {
              <a [href]="link.url" target="_blank" class="glass p-3 rounded-xl hover:text-emerald-400 transition-all flex items-center gap-2" [title]="link.platform">
                <mat-icon>{{ link.icon }}</mat-icon>
                <span class="text-xs font-bold">{{ link.platform }}</span>
              </a>
            }
          </div>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
        <p>{{ ts.translateObject(settingsService.contactInfo().copyright) }}</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  ts = inject(TranslationService);
  settingsService = inject(SettingsService);
  t = computed(() => this.ts.t());
}
