import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { RoomService } from '../../services/room';
import { NavbarComponent } from '../../components/navbar';
import { FooterComponent } from '../../components/footer';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  imports: [NavbarComponent, FooterComponent, RouterLink, MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white pb-24">
      <app-navbar></app-navbar>

      <div class="pt-32 px-6 max-w-7xl mx-auto">
        <h1 class="font-display text-5xl font-bold mb-12 text-center">{{ t()('rooms.title') }}</h1>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (room of roomService.rooms(); track room.id) {
            <div class="glass rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <div class="relative h-64 overflow-hidden">
                <!-- Simple Slider Simulation -->
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
                <h3 class="text-2xl font-bold mb-2">{{ ts.translateObject(room.type) }}</h3>
                <div class="flex items-center gap-2 text-white/50 text-sm mb-4">
                  <mat-icon class="text-emerald-500 text-base">people</mat-icon>
                  <span>{{ room.capacity }} {{ t()('rooms.person') }}</span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  @for (amenity of ts.translateObject(room.amenities); track amenity) {
                    <span class="glass px-3 py-1 rounded-full text-xs font-medium text-white/60">
                      {{ amenity }}
                    </span>
                  }
                </div>

                <p class="text-white/50 text-sm mb-8 line-clamp-2">
                  {{ ts.translateObject(room.description) }}
                </p>

                <button 
                  routerLink="/booking"
                  [queryParams]="{ roomId: room.id, roomType: ts.translateObject(room.type) }"
                  class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <mat-icon>event</mat-icon>
                  {{ t()('rooms.book') }}
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-24 opacity-50">
              <mat-icon class="text-6xl mb-4">hotel_class</mat-icon>
              <p>{{ t()('rooms.none') }}</p>
            </div>
          }
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class RoomsComponent {
  ts = inject(TranslationService);
  roomService = inject(RoomService);
  t = computed(() => this.ts.t());
}
