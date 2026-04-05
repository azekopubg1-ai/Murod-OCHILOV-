import { Component, inject, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { SettingsService } from '../../services/settings';
import { RoomService } from '../../services/room';
import { NavbarComponent } from '../../components/navbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterLink, MatIconModule, CommonModule],
  template: `
    <div class="relative min-h-screen bg-black text-white overflow-hidden">
      <!-- Hero Background -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/sanatorium/1920/1080?blur=2" 
          class="w-full h-full object-cover opacity-60"
          alt="Sanatorium Background"
          referrerpolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      <app-navbar></app-navbar>

      <main class="relative z-10 pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen text-center">
        <div class="glass p-8 md:p-12 rounded-[3rem] max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h1 class="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {{ t()('hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-white/70 mb-10 font-medium">
            {{ t()('hero.subtitle') }}
          </p>
          
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            @if (auth.isAdmin()) {
              <button 
                routerLink="/admin"
                class="bg-emerald-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
              >
                <mat-icon>admin_panel_settings</mat-icon>
                Admin Panelga o'tish
              </button>
            }
            <button 
              routerLink="/rooms"
              class="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <mat-icon>hotel</mat-icon>
              {{ t()('hero.view_rooms') }}
            </button>
            <button 
              routerLink="/booking"
              class="glass px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <mat-icon>event_available</mat-icon>
              {{ t()('hero.book_now') }}
            </button>
          </div>
        </div>

        <div class="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
          <div class="glass p-6 rounded-3xl text-center">
            <mat-icon class="text-emerald-400 text-4xl mb-2">hot_tub</mat-icon>
            <div class="font-bold text-2xl">45°C</div>
            <div class="text-white/50 text-sm">Issiq suv</div>
          </div>
          <div class="glass p-6 rounded-3xl text-center">
            <mat-icon class="text-blue-400 text-4xl mb-2">wifi</mat-icon>
            <div class="font-bold text-2xl">Free</div>
            <div class="text-white/50 text-sm">WiFi</div>
          </div>
          <div class="glass p-6 rounded-3xl text-center">
            <mat-icon class="text-amber-400 text-4xl mb-2">restaurant</mat-icon>
            <div class="font-bold text-2xl">3x</div>
            <div class="text-white/50 text-sm">Ovqatlanish</div>
          </div>
          <div class="glass p-6 rounded-3xl text-center">
            <mat-icon class="text-purple-400 text-4xl mb-2">nature_people</mat-icon>
            <div class="font-bold text-2xl">100%</div>
            <div class="text-white/50 text-sm">Tabiat</div>
          </div>
        </div>
      </main>

      <!-- Featured Rooms Section -->
      <section class="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <h2 class="font-display text-4xl font-bold mb-12 text-center">{{ t()('rooms.title') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          @for (room of featuredRooms(); track room.id) {
            <div class="glass rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <div class="relative h-64 overflow-hidden">
                <img 
                  [src]="room.images[0]" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Room Image"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute top-4 right-4 glass px-4 py-1 rounded-full text-sm font-bold">
                  {{ room.price.toLocaleString() }} UZS
                </div>
              </div>
              <div class="p-8">
                <h3 class="text-2xl font-bold mb-4">{{ room.type }}</h3>
                <p class="text-white/50 text-sm mb-6 line-clamp-2">{{ room.description }}</p>
                <button 
                  routerLink="/booking"
                  [queryParams]="{ roomId: room.id, roomType: room.type }"
                  class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  {{ t()('rooms.book') }}
                </button>
              </div>
            </div>
          }
        </div>
        <div class="text-center mt-12">
          <button routerLink="/rooms" class="glass px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
            Barcha xonalarni ko'rish
          </button>
        </div>
      </section>

      <section id="contact" class="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div class="glass p-12 rounded-[3rem]">
          <h2 class="font-display text-4xl font-bold mb-12 text-center">{{ t()('contact.title') }}</h2>
          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-8">
              <div class="flex items-center gap-6">
                <div class="glass p-4 rounded-2xl text-emerald-400">
                  <mat-icon>location_on</mat-icon>
                </div>
                <div>
                  <div class="text-white/50 text-sm">{{ t()('contact.address') }}</div>
                  <div class="text-xl font-bold">{{ settingsService.contactInfo().address }}</div>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="glass p-4 rounded-2xl text-blue-400">
                  <mat-icon>phone</mat-icon>
                </div>
                <div>
                  <div class="text-white/50 text-sm">{{ t()('contact.phone') }}</div>
                  <div class="text-xl font-bold">{{ settingsService.contactInfo().phone }}</div>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="glass p-4 rounded-2xl text-purple-400">
                  <mat-icon>email</mat-icon>
                </div>
                <div>
                  <div class="text-white/50 text-sm">{{ t()('contact.email') }}</div>
                  <div class="text-xl font-bold">{{ settingsService.contactInfo().email }}</div>
                </div>
              </div>
            </div>
            <div class="rounded-3xl overflow-hidden glass h-80">
              @if (safeMapUrl()) {
                <iframe 
                  [src]="safeMapUrl()" 
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              } @else {
                <div class="w-full h-full flex flex-col items-center justify-center text-white/30 p-8 text-center">
                  <mat-icon class="text-6xl mb-4">map</mat-icon>
                  <p>Xarita manzili noto'g'ri kiritilgan yoki hali sozlanmagan.</p>
                  <p class="text-xs mt-2">Admin panelidan Google Maps iframe URL-ni kiriting.</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  ts = inject(TranslationService);
  settingsService = inject(SettingsService);
  roomService = inject(RoomService);
  auth = inject(AuthService);
  sanitizer = inject(DomSanitizer);
  t = computed(() => this.ts.t());

  featuredRooms = computed(() => this.roomService.rooms().slice(0, 3));
  safeMapUrl = computed(() => {
    const url = this.settingsService.contactInfo().mapUrl;
    if (!url || !url.startsWith('http')) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
