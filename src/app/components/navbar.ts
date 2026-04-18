import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService, Language, LANGUAGE_NAMES } from '../services/translation';
import { AuthService } from '../services/auth';
import { SettingsService } from '../services/settings';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule, CommonModule, FormsModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
        <mat-icon class="text-emerald-500">spa</mat-icon>
        <span class="font-display font-bold text-lg md:text-xl tracking-tight text-white">
          {{ ts.translateObject(settingsService.contactInfo().siteName) }}
        </span>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden lg:flex items-center gap-8 font-medium">
        <a routerLink="/" class="text-white/80 hover:text-emerald-400 transition-colors">{{ t()('nav.home') }}</a>
        <a routerLink="/rooms" class="text-white/80 hover:text-emerald-400 transition-colors">{{ t()('nav.rooms') }}</a>
        <a routerLink="/#contact" class="text-white/80 hover:text-emerald-400 transition-colors">{{ t()('nav.contact') }}</a>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Language Selector Button -->
        <button 
          (click)="openLangMenu()"
          class="glass p-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-1 text-white border-white/20 border"
          aria-label="Select Language"
        >
          <mat-icon>language</mat-icon>
          <span class="text-xs font-bold hidden sm:inline">{{ ts.getLanguage() }}</span>
        </button>

        @if (auth.user()) {
          <button 
            routerLink="/booking"
            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <mat-icon>event</mat-icon>
            <span class="hidden sm:inline">{{ t()('nav.booking') }}</span>
          </button>
          
          @if (auth.isAdmin()) {
            <button routerLink="/admin" class="glass px-3 md:px-4 py-2 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 text-white border-white/10 border">
              <mat-icon>admin_panel_settings</mat-icon>
              <span class="text-xs md:text-sm font-bold hidden md:inline">Admin</span>
            </button>
          }

          <button (click)="auth.logout()" class="glass p-2 rounded-full hover:bg-white/10 transition-all text-white border-white/10 border">
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
              <div class="absolute right-0 mt-2 w-48 glass rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-2 space-y-1 border border-white/10">
                <button 
                  (click)="auth.login(); isLoginMenuOpen.set(false)"
                  class="w-full px-4 py-3 text-left text-sm hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 text-white"
                >
                  <mat-icon>account_circle</mat-icon>
                  Google via
                </button>
                <button 
                  (click)="auth.loginAnonymously(); isLoginMenuOpen.set(false)"
                  class="w-full px-4 py-3 text-left text-sm hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 text-white"
                >
                  <mat-icon>person_outline</mat-icon>
                  Anonymous
                </button>
              </div>
            }
          </div>
        }

        <!-- Mobile Menu Toggle -->
        <button 
          (click)="isMenuOpen.set(!isMenuOpen())" 
          (keydown.enter)="isMenuOpen.set(!isMenuOpen())"
          class="lg:hidden glass p-2 rounded-full text-white border-white/10 border"
          aria-label="Toggle Menu"
        >
          <mat-icon>{{ isMenuOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>
    </nav>

    <!-- Language Selection Modal (White background, Black text, Centered) -->
    @if (isLangMenuOpen()) {
      <div 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div 
          class="absolute inset-0 bg-black/80 backdrop-blur-md"
          (click)="isLangMenuOpen.set(false)"
          (keydown.escape)="isLangMenuOpen.set(false)"
          role="button"
          tabindex="0"
          aria-label="Close"
        ></div>
        
        <div class="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col scale-in animate-in fade-in duration-300">
          <div class="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-bold text-black font-display">Tilingizni tanlang</h2>
              <p class="text-gray-500 text-sm">Dunyoning barcha tillari bir joyda</p>
            </div>
            <button (click)="isLangMenuOpen.set(false)" class="p-4 hover:bg-gray-100 rounded-full transition-all text-gray-400">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="p-6 bg-gray-50/50">
            <div class="relative group">
              <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">search</mat-icon>
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                placeholder="Tilni qidirish..." 
                class="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-emerald-500 rounded-3xl outline-none text-lg text-black transition-all shadow-sm"
              >
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              @for (lang of filteredLanguages(); track lang) {
                <button 
                  (click)="ts.setLanguage(lang); isLangMenuOpen.set(false)"
                  class="group p-5 rounded-3xl text-left transition-all flex flex-col gap-1 border-2"
                  [class]="ts.getLanguage() === lang 
                    ? 'bg-emerald-50 border-emerald-500 text-black shadow-lg shadow-emerald-500/5' 
                    : 'bg-white border-gray-50 hover:bg-gray-50 hover:border-emerald-200 text-black'"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-widest text-emerald-600/60" [class.text-emerald-600]="ts.getLanguage() === lang">
                      {{ lang }}
                    </span>
                    @if (ts.getLanguage() === lang) {
                      <mat-icon class="text-emerald-500 text-sm">verified</mat-icon>
                    }
                  </div>
                  <span class="font-bold text-lg leading-tight">{{ languageMeta[lang].native }}</span>
                  <span class="text-xs text-gray-400 font-medium">{{ languageMeta[lang].name }}</span>
                </button>
              } @empty {
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                  <mat-icon class="text-5xl">language_off</mat-icon>
                  <p class="text-lg font-medium">Bunday til topilmadi</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

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
      <div class="fixed top-24 left-4 right-4 z-50 glass rounded-[2rem] p-6 lg:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 border border-white/10">
        <a routerLink="/" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl text-white">{{ t()('nav.home') }}</a>
        <a routerLink="/rooms" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl text-white">{{ t()('nav.rooms') }}</a>
        <a routerLink="/#contact" (click)="isMenuOpen.set(false)" (keydown.enter)="isMenuOpen.set(false)" class="text-xl font-bold p-4 hover:bg-emerald-500/20 rounded-2xl text-white">{{ t()('nav.contact') }}</a>
      </div>
    }
  `
})
export class NavbarComponent {
  ts = inject(TranslationService);
  auth = inject(AuthService);
  settingsService = inject(SettingsService);
  t = computed(() => this.ts.t());
  
  languageMeta = LANGUAGE_NAMES;
  languages = Object.keys(LANGUAGE_NAMES) as Language[];
  
  searchQuery = '';
  filteredLanguages = computed(() => {
    const query = this.searchQuery.toLowerCase();
    if (!query) return this.languages;
    return this.languages.filter(lang => 
      lang.toLowerCase().includes(query) || 
      this.languageMeta[lang].name.toLowerCase().includes(query) || 
      this.languageMeta[lang].native.toLowerCase().includes(query)
    );
  });

  isMenuOpen = signal(false);
  isLangMenuOpen = signal(false);
  isLoginMenuOpen = signal(false);

  openLangMenu() {
    this.isLangMenuOpen.set(true);
    this.searchQuery = '';
  }
}
