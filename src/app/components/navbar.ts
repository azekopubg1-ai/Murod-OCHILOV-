import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService, Language } from '../services/translation';
import { AuthService } from '../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule, CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
        <mat-icon class="text-emerald-500">spa</mat-icon>
        <span class="font-display font-bold text-lg md:text-xl tracking-tight">Murod Ocilov</span>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden lg:flex items-center gap-8 font-medium">
        <a routerLink="/" class="hover:text-emerald-500 transition-colors">{{ t()('nav.home') }}</a>
        <a routerLink="/rooms" class="hover:text-emerald-500 transition-colors">{{ t()('nav.rooms') }}</a>
        <a routerLink="/#contact" class="hover:text-emerald-500 transition-colors">{{ t()('nav.contact') }}</a>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Language Selector -->
        <div class="relative">
          <button 
            (click)="isLangMenuOpen.set(!isLangMenuOpen())"
            class="glass p-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-1"
            aria-label="Select Language"
          >
            <mat-icon>language</mat-icon>
            <span class="text-xs font-bold hidden sm:inline">{{ ts.getLanguage() }}</span>
          </button>
          
          @if (isLangMenuOpen()) {
            <div 
              class="fixed inset-0 z-40" 
              (click)="isLangMenuOpen.set(false)"
              (keydown.escape)="isLangMenuOpen.set(false)"
              role="button"
              tabindex="0"
              aria-label="Close Menu"
            ></div>
            <div class="absolute right-0 mt-2 w-24 glass rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              @for (lang of languages; track lang) {
                <button 
                  (click)="ts.setLanguage(lang); isLangMenuOpen.set(false)"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-emerald-500/20 transition-colors"
                  [class.text-emerald-500]="ts.getLanguage() === lang"
                >
                  {{ lang }}
                </button>
              }
            </div>
          }
        </div>

        @if (auth.user()) {
          <button 
            routerLink="/booking"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <mat-icon>event</mat-icon>
            <span class="hidden sm:inline">{{ t()('nav.booking') }}</span>
          </button>
          
          @if (auth.isAdmin()) {
            <button routerLink="/admin" class="glass px-3 md:px-4 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
              <mat-icon>admin_panel_settings</mat-icon>
              <span class="text-xs md:text-sm font-bold hidden md:inline">Admin</span>
            </button>
          }

          <button (click)="auth.logout()" class="glass p-2 rounded-full hover:bg-white/10 transition-all">
            <mat-icon>logout</mat-icon>
          </button>
        } @else {
          <div class="relative">
            <button 
              (click)="isLoginMenuOpen.set(!isLoginMenuOpen())"
              [disabled]="auth.isLoggingIn()"
              class="bg-white text-black px-4 md:px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {{ auth.isLoggingIn() ? '...' : 'Login' }}
              <mat-icon class="text-sm">expand_more</mat-icon>
            </button>

            @if (isLoginMenuOpen()) {
              <div 
                class="fixed inset-0 z-40" 
                (click)="isLoginMenuOpen.set(false)"
                (keydown.escape)="isLoginMenuOpen.set(false)"
                role="button"
                tabindex="0"
                aria-label="Close Menu"
              ></div>
              <div class="absolute right-0 mt-2 w-48 glass rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-2 space-y-1">
                <button 
                  (click)="auth.login('google'); isLoginMenuOpen.set(false)"
                  class="w-full px-4 py-3 text-left text-sm hover:bg-white/10 rounded-xl transition-all flex items-center gap-3"
                >
                  <mat-icon>account_circle</mat-icon>
                  Google orqali
                </button>
                <button 
                  (click)="auth.login('apple'); isLoginMenuOpen.set(false)"
                  class="w-full px-4 py-3 text-left text-sm hover:bg-white/10 rounded-xl transition-all flex items-center gap-3"
                >
                  <mat-icon>apple</mat-icon>
                  Apple ID orqali
                </button>
              </div>
            }
          </div>
        }

        <!-- Mobile Menu Toggle -->
        <button 
          (click)="isMenuOpen.set(!isMenuOpen())" 
          (keydown.enter)="isMenuOpen.set(!isMenuOpen())"
          class="lg:hidden glass p-2 rounded-full"
          aria-label="Toggle Menu"
        >
          <mat-icon>{{ isMenuOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    @if (isMenuOpen()) {
      <div 
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
        (click)="isMenuOpen.set(false)"
        (keydown.escape)="isMenuOpen.set(false)"
        role="button"
        tabindex="0"
        aria-label="Close Menu"
      ></div>
      <div class="fixed top-24 left-4 right-4 z-50 glass rounded-[2rem] p-6 lg:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
        <a routerLink="/" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl">{{ t()('nav.home') }}</a>
        <a routerLink="/rooms" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl">{{ t()('nav.rooms') }}</a>
        <a routerLink="/#contact" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl">{{ t()('nav.contact') }}</a>
      </div>
    }
  `
})
export class NavbarComponent {
  ts = inject(TranslationService);
  auth = inject(AuthService);
  t = computed(() => this.ts.t());
  languages: Language[] = ['UZ', 'UZ_KR', 'RU', 'EN', 'QQ'];
  isMenuOpen = signal(false);
  isLangMenuOpen = signal(false);
  isLoginMenuOpen = signal(false);
}
