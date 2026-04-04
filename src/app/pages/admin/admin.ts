import { Component, inject, signal, computed, OnDestroy, effect } from '@angular/core';
import { TranslationService } from '../../services/translation';
import { RoomService, Room } from '../../services/room';
import { BookingService, Booking } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { LocationService } from '../../services/location';
import { SettingsService, ContactInfo } from '../../services/settings';
import { AdminService } from '../../services/admin';
import { NavbarComponent } from '../../components/navbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

type AdminTab = 'pending' | 'active' | 'archive' | 'rejected' | 'offline' | 'rooms' | 'settings' | 'admins';

@Component({
  selector: 'app-admin',
  imports: [NavbarComponent, MatIconModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white pb-24">
      <app-navbar></app-navbar>

      <div class="pt-32 px-6 max-w-7xl mx-auto">
        @if (!auth.isAdmin()) {
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <mat-icon class="text-rose-500 text-6xl mb-4">lock</mat-icon>
            <h1 class="text-3xl font-bold">Ruxsat berilmagan</h1>
            <p class="text-white/50">Sizda ushbu sahifaga kirish huquqi yo'q.</p>
          </div>
        } @else {
          <!-- Tabs Navigation -->
          <div class="flex overflow-x-auto whitespace-nowrap gap-2 mb-8 glass p-2 rounded-2xl no-scrollbar">
            @for (tab of tabs(); track tab.id) {
              <button 
                (click)="activeTab.set(tab.id)"
                [class.bg-emerald-500]="activeTab() === tab.id"
                [class.text-white]="activeTab() === tab.id"
                [class.text-white/50]="activeTab() !== tab.id"
                class="px-4 md:px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0"
              >
                <mat-icon class="text-sm">{{ tab.icon }}</mat-icon>
                <span class="text-sm md:text-base">{{ tab.label }}</span>
                @if (tab.count !== undefined) {
                  <span class="bg-white/10 px-2 py-0.5 rounded-md text-[10px]">{{ tab.count }}</span>
                }
              </button>
            }
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Main Content Area -->
            <div class="lg:col-span-2 space-y-6">
              
              @if (activeTab() === 'settings') {
                <div class="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-8">
                  <h2 class="text-xl md:text-2xl font-bold">{{ t()('admin.contact_settings') }}</h2>
                  <form [formGroup]="settingsForm" (ngSubmit)="onSettingsSubmit()" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="settings-phone" class="text-sm text-white/50">Telefon</label>
                        <input id="settings-phone" type="text" formControlName="phone" class="w-full glass p-4 rounded-2xl">
                      </div>
                      <div class="space-y-2">
                        <label for="settings-email" class="text-sm text-white/50">Email</label>
                        <input id="settings-email" type="email" formControlName="email" class="w-full glass p-4 rounded-2xl">
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label for="settings-address" class="text-sm text-white/50">Manzil</label>
                      <input id="settings-address" type="text" formControlName="address" class="w-full glass p-4 rounded-2xl">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="settings-telegram" class="text-sm text-white/50">Telegram</label>
                        <input id="settings-telegram" type="text" formControlName="telegram" class="w-full glass p-4 rounded-2xl">
                      </div>
                      <div class="space-y-2">
                        <label for="settings-instagram" class="text-sm text-white/50">Instagram</label>
                        <input id="settings-instagram" type="text" formControlName="instagram" class="w-full glass p-4 rounded-2xl">
                      </div>
                    </div>
                    <button type="submit" class="w-full bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20">
                      Saqlash
                    </button>
                  </form>

                  <div class="pt-8 border-t border-white/5 space-y-4">
                    <h3 class="font-bold">Tizimni sinxronizatsiya qilish</h3>
                    <p class="text-xs text-white/50">Agar bron qilishda bo'sh joylar noto'g'ri ko'rinsa, ma'lumotlarni qayta sinxronizatsiya qiling.</p>
                    <button (click)="onSyncPublic()" class="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                      <mat-icon>sync</mat-icon>
                      Bo'sh joylarni sinxronizatsiya qilish
                    </button>
                  </div>
                </div>
              } @else if (activeTab() === 'admins') {
                <div class="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-8">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 class="text-xl md:text-2xl font-bold">Adminlar boshqaruvi</h2>
                    <button (click)="isAddingAdmin.set(!isAddingAdmin())" class="bg-emerald-500 px-4 py-2 rounded-xl font-bold text-sm">
                      {{ isAddingAdmin() ? "Bekor qilish" : "Admin qo'shish" }}
                    </button>
                  </div>

                  @if (isAddingAdmin()) {
                    <form [formGroup]="adminForm" (ngSubmit)="onAddAdmin()" class="glass p-6 rounded-2xl space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" formControlName="uid" placeholder="User UID" class="glass p-3 rounded-xl text-sm">
                        <input type="email" formControlName="email" placeholder="Email" class="glass p-3 rounded-xl text-sm">
                      </div>
                      <div class="space-y-2">
                        <span class="text-xs font-bold text-white/30 uppercase tracking-widest">Ruxsatlar</span>
                        <div class="flex flex-wrap gap-2">
                          @for (perm of availablePermissions; track perm.id) {
                            <label class="flex items-center gap-2 glass px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                              <input type="checkbox" [value]="perm.id" (change)="onPermissionChange($event, perm.id)" class="accent-emerald-500">
                              <span class="text-xs">{{ perm.label }}</span>
                            </label>
                          }
                        </div>
                      </div>
                      <button type="submit" [disabled]="adminForm.invalid" class="w-full bg-emerald-500 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
                        Qo'shish
                      </button>
                    </form>
                  }

                  <div class="space-y-4">
                    @for (admin of adminService.admins(); track admin.uid) {
                      <div class="glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                        <div>
                          <div class="font-bold">{{ admin.email }}</div>
                          <div class="text-xs text-white/30 mt-1">UID: {{ admin.uid }}</div>
                          <div class="flex flex-wrap gap-1 mt-2">
                            @for (p of admin.permissions; track p) {
                              <span class="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{{ p }}</span>
                            }
                          </div>
                        </div>
                        <button (click)="adminService.removeAdmin(admin.uid)" class="text-rose-500 md:opacity-0 md:group-hover:opacity-100 transition-all self-end md:self-auto">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              } @else if (activeTab() === 'offline') {
                <div class="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-8">
                  <h2 class="text-xl md:text-2xl font-bold">{{ t()('admin.offline') }}</h2>
                  <form [formGroup]="offlineForm" (ngSubmit)="onOfflineSubmit()" class="space-y-6">
                    <div class="space-y-4">
                      <span class="text-sm font-medium text-white/50 block">{{ t()('booking.people_count') }}</span>
                      <div class="grid grid-cols-4 gap-2 md:gap-4">
                        @for (count of [1, 2, 3, 4]; track count) {
                          <button 
                            type="button"
                            (click)="setPeopleCount(count)"
                            [class.bg-emerald-500]="peopleCount() === count"
                            [class.glass]="peopleCount() !== count"
                            class="py-3 rounded-xl font-bold transition-all text-sm"
                          >
                            {{ count }}
                          </button>
                        }
                      </div>
                    </div>

                    <div formArrayName="people" class="space-y-4">
                      @for (person of peopleFormArray.controls; track $index) {
                        <div [formGroupName]="$index" class="glass p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" formControlName="name" [placeholder]="t()('booking.name')" class="glass p-3 rounded-xl text-sm">
                          <input type="number" formControlName="age" [placeholder]="t()('booking.age')" class="glass p-3 rounded-xl text-sm">
                          <input type="text" formControlName="passport" [placeholder]="t()('booking.passport')" class="glass p-3 rounded-xl text-sm">
                          @if (peopleCount() === 1) {
                            <select formControlName="gender" class="glass p-3 rounded-xl text-sm appearance-none">
                              <option value="male">{{ t()('booking.gender.male') }}</option>
                              <option value="female">{{ t()('booking.gender.female') }}</option>
                            </select>
                          }
                        </div>
                      }
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="tel" formControlName="phone" [placeholder]="t()('booking.phone')" class="glass p-4 rounded-2xl">
                      <select formControlName="roomType" class="glass p-4 rounded-2xl appearance-none">
                        <option value="" disabled selected>Xona turi</option>
                        @for (room of roomService.rooms(); track room.id) {
                          <option [value]="room.type">{{ room.type }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select formControlName="country" (change)="onCountryChange($event)" class="glass p-4 rounded-2xl appearance-none">
                        @for (country of countries; track country.id) {
                          <option [value]="country.id">{{ country.name[ts.getLanguage()] }}</option>
                        }
                      </select>
                      @if (selectedCountry() === 'other') {
                        <input type="text" formControlName="otherCountry" placeholder="Davlat nomi" class="glass p-4 rounded-2xl">
                      }
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        @if (selectedCountry() === 'other') {
                          <input type="text" formControlName="otherRegion" placeholder="Viloyat" class="w-full glass p-4 rounded-2xl">
                        } @else {
                          <select formControlName="region" (change)="onRegionChange($event)" class="w-full glass p-4 rounded-2xl appearance-none">
                            <option value="" disabled selected>Viloyat</option>
                            @for (region of regions(); track region.id) {
                              <option [value]="region.id">{{ region.name[ts.getLanguage()] }}</option>
                            }
                          </select>
                        }
                      </div>
                      <div class="space-y-2">
                        @if (selectedCountry() === 'other') {
                          <input type="text" formControlName="otherDistrict" placeholder="Tuman" class="w-full glass p-4 rounded-2xl">
                        } @else {
                          <select formControlName="district" class="w-full glass p-4 rounded-2xl appearance-none">
                            <option value="" disabled selected>Tuman</option>
                            @for (district of districts(); track district.id) {
                              <option [value]="district.id">{{ district.name[ts.getLanguage()] }}</option>
                            }
                          </select>
                        }
                      </div>
                    </div>
                    <input type="text" formControlName="mahalla" placeholder="Mahalla" class="w-full glass p-4 rounded-2xl">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="date" formControlName="checkIn" class="glass p-4 rounded-2xl">
                      <input type="date" formControlName="checkOut" class="glass p-4 rounded-2xl">
                    </div>

                    <button type="submit" [disabled]="offlineForm.invalid" class="w-full bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20">
                      Bron qilish
                    </button>
                  </form>
                </div>
              } @else if (activeTab() === 'rooms') {
                <div class="space-y-6">
                  <h2 class="text-xl md:text-2xl font-bold px-4">{{ t()('admin.rooms') }}</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                    @for (room of roomService.rooms(); track room.id) {
                      <div class="glass p-5 md:p-6 rounded-[2rem] md:rounded-3xl relative group">
                        <div class="font-bold text-lg md:text-xl mb-1">{{ room.type }}</div>
                        <div class="text-emerald-400 font-bold mb-2 text-sm md:text-base">{{ room.price.toLocaleString() }} UZS</div>
                        <div class="flex gap-4 text-[10px] md:text-xs text-white/50 mb-4">
                          <span>{{ room.capacity }} kishilik</span>
                          <span>{{ room.totalCount }} ta xona</span>
                        </div>
                        <p class="text-xs md:text-sm text-white/50 line-clamp-2 mb-4">{{ room.description }}</p>
                        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                          @for (img of room.images; track img) {
                            <img [src]="img" class="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" alt="Room thumbnail" referrerpolicy="no-referrer">
                          }
                        </div>
                        <button (click)="onDeleteRoom(room.id!)" class="absolute top-4 right-4 text-rose-500 md:opacity-0 md:group-hover:opacity-100 transition-all">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="space-y-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                    <h2 class="text-xl md:text-2xl font-bold">{{ t()('admin.bookings') }}</h2>
                    <div class="relative w-full md:w-64">
                      <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">search</mat-icon>
                      <input 
                        type="text" 
                        [placeholder]="t()('booking.name')" 
                        (input)="onSearch($event)"
                        class="w-full glass pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                    </div>
                  </div>

                  <!-- Room Summary -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4">
                    @for (room of roomService.rooms(); track room.id) {
                      <div class="glass p-3 md:p-4 rounded-2xl border-white/5">
                        <div class="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-1">{{ room.type }}</div>
                        <div class="flex items-end justify-between">
                          <span class="text-base md:text-lg font-bold">{{ room.totalCount }}</span>
                          <span class="text-[9px] md:text-[10px] text-white/50">{{ room.capacity }} kishilik</span>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="space-y-4 md:space-y-6 px-4">
                    @for (booking of filteredBookings(); track booking.id) {
                    <div class="glass p-5 md:p-6 rounded-[2rem] md:rounded-3xl space-y-4">
                      <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div>
                          <div class="text-lg md:text-xl font-bold">{{ booking.name }}</div>
                          <div class="text-emerald-400 font-medium text-sm md:text-base">{{ booking.roomType }}</div>
                          <div class="text-[10px] md:text-xs text-white/30">{{ booking.people?.length || 1 }} {{ t()('booking.person') }}</div>
                        </div>
                        <div 
                          [class]="{
                            'bg-amber-500/20 text-amber-500': booking.status === 'pending',
                            'bg-emerald-500/20 text-emerald-500': booking.status === 'active',
                            'bg-blue-500/20 text-blue-500': booking.status === 'archive',
                            'bg-rose-500/20 text-rose-500': booking.status === 'rejected'
                          }"
                          class="px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider self-start"
                        >
                          {{ t()('booking.status.' + booking.status) }}
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-white/60">
                        <div class="flex items-center gap-2">
                          <mat-icon class="text-xs">phone</mat-icon> {{ booking.phone }}
                        </div>
                        <div class="flex items-center gap-2">
                          <mat-icon class="text-xs">calendar_today</mat-icon> {{ booking.checkIn }} - {{ booking.checkOut }}
                        </div>
                        <div class="flex items-center gap-2">
                          <mat-icon class="text-xs">location_on</mat-icon> {{ booking.region }}
                        </div>
                      </div>

                      @if (booking.status === 'pending') {
                        <div class="space-y-4 pt-2">
                          <div class="flex flex-col gap-2">
                            <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">Xona tanlash</span>
                            <select #roomSelect class="glass p-3 rounded-xl text-sm appearance-none">
                              <option value="">Xona tanlanmagan</option>
                              @for (room of roomService.rooms(); track room.id) {
                                <option [value]="room.id">{{ room.type }} ({{ room.price.toLocaleString() }})</option>
                              }
                            </select>
                          </div>
                          <div class="flex flex-col md:flex-row gap-3">
                            <button 
                              (click)="bookingService.updateBookingStatus(booking.id!, 'active', roomSelect.value)"
                              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all text-sm"
                            >
                              Tasdiqlash va joylash
                            </button>
                            <button 
                              (click)="bookingService.updateBookingStatus(booking.id!, 'rejected')"
                              class="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 py-3 rounded-xl font-bold transition-all text-sm"
                            >
                              Rad etish
                            </button>
                          </div>
                        </div>
                      } @else if (booking.status === 'active') {
                        <div class="flex flex-col gap-3 pt-2">
                          @if (extendingBookingId() === booking.id) {
                            <div class="glass p-4 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
                              <label [for]="'extend-' + booking.id" class="text-xs font-bold text-white/30 uppercase tracking-widest">Yangi chiqish sanasi</label>
                              <div class="flex gap-2">
                                <input [id]="'extend-' + booking.id" #newDateInput type="date" [value]="booking.checkOut" class="flex-1 glass p-3 rounded-xl text-sm focus:outline-none">
                                <button 
                                  (click)="confirmExtension(booking, newDateInput.value)"
                                  class="bg-emerald-500 px-4 py-2 rounded-xl font-bold text-sm"
                                >
                                  Saqlash
                                </button>
                                <button 
                                  (click)="extendingBookingId.set(null)"
                                  class="glass px-4 py-2 rounded-xl font-bold text-sm"
                                >
                                  Bekor qilish
                                </button>
                              </div>
                            </div>
                          } @else {
                            <div class="flex flex-col md:flex-row gap-3">
                              <button 
                                (click)="onExtendBooking(booking)"
                                class="flex-1 glass hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                              >
                                <mat-icon class="text-sm">update</mat-icon>
                                {{ t()('admin.extend') }}
                              </button>
                              <button 
                                (click)="bookingService.updateBookingStatus(booking.id!, 'archive')"
                                class="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                              >
                                <mat-icon class="text-sm">logout</mat-icon>
                                {{ t()('admin.terminate') }}
                              </button>
                            </div>
                          }
                        </div>
                      } @else if (activeTab() === 'archive' || activeTab() === 'rejected') {
                        <div class="pt-2">
                          <button 
                            (click)="onDeleteBooking(booking.id!)"
                            class="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <mat-icon class="text-sm">delete</mat-icon>
                            Butunlay o'chirish
                          </button>
                        </div>
                      }
                    </div>
                    } @empty {
                      <div class="glass p-12 rounded-3xl text-center text-white/30">
                        <mat-icon class="text-4xl mb-2">inbox</mat-icon>
                        <p>Hozircha ma'lumot yo'q</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

          <!-- Sidebar -->
            <div class="space-y-6 order-first lg:order-last">
              @if (activeTab() === 'rooms') {
                <div class="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
                  <h3 class="font-bold mb-6">{{ t()('admin.add_room') }}</h3>
                  <form [formGroup]="roomForm" (ngSubmit)="onAddRoom()" class="space-y-4">
                    <input type="text" formControlName="type" placeholder="Xona turi" class="w-full glass p-4 rounded-2xl focus:outline-none">
                    <div class="grid grid-cols-2 gap-4">
                      <input type="number" formControlName="price" placeholder="Narx" class="w-full glass p-4 rounded-2xl focus:outline-none">
                      <input type="number" formControlName="capacity" [placeholder]="t()('admin.capacity')" class="w-full glass p-4 rounded-2xl focus:outline-none">
                    </div>
                    <input type="number" formControlName="totalCount" [placeholder]="t()('admin.total_count')" class="w-full glass p-4 rounded-2xl focus:outline-none">
                    <textarea formControlName="description" placeholder="Tavsif" class="w-full glass p-4 rounded-2xl focus:outline-none h-24"></textarea>
                    
                    <div class="space-y-2">
                      <label for="room-images" class="text-xs font-bold text-white/30">{{ t()('admin.images') }}</label>
                      
                      <!-- File Upload -->
                      <div class="glass p-4 rounded-2xl border-dashed border-white/10 hover:border-emerald-500/50 transition-all relative group cursor-pointer">
                        <input 
                          type="file" 
                          (change)="onFileSelected($event)" 
                          accept="image/*"
                          class="absolute inset-0 opacity-0 cursor-pointer z-10"
                          [disabled]="uploadingImage()"
                        >
                        <div class="flex flex-col items-center justify-center gap-2 py-2">
                          <mat-icon class="text-white/30 group-hover:text-emerald-500 transition-colors">cloud_upload</mat-icon>
                          <span class="text-[10px] font-bold text-white/30 group-hover:text-white transition-colors">Qurilmadan rasm yuklash</span>
                        </div>
                        @if (uploadingImage()) {
                          <div class="absolute inset-0 bg-zinc-950/80 rounded-2xl flex flex-col items-center justify-center gap-2 z-20">
                            <div class="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div class="h-full bg-emerald-500 transition-all duration-300" [style.width.%]="uploadProgress()"></div>
                            </div>
                            <span class="text-[10px] font-bold">{{ uploadProgress() | number:'1.0-0' }}%</span>
                          </div>
                        }
                      </div>

                      <div id="room-images" formArrayName="images" class="space-y-3 mt-4">
                        @for (img of roomImagesArray.controls; track $index) {
                          <div class="space-y-2">
                            <div class="flex gap-2">
                              <input [formControlName]="$index" placeholder="Image URL" class="flex-1 glass p-3 rounded-xl text-xs focus:outline-none">
                              <button (click)="removeImage($index)" type="button" class="text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-all">
                                <mat-icon>delete</mat-icon>
                              </button>
                            </div>
                            @if (img.value) {
                              <div class="relative w-full aspect-video rounded-xl overflow-hidden glass">
                                <img [src]="img.value" class="w-full h-full object-cover" alt="Preview" referrerpolicy="no-referrer">
                              </div>
                            }
                          </div>
                        }
                      </div>
                      
                      @if (roomImagesArray.length < 10) {
                        <button (click)="addImage()" type="button" class="w-full glass py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all mt-2">
                          <mat-icon class="text-sm">add_link</mat-icon> URL orqali rasm qo'shish
                        </button>
                      }
                    </div>

                    <button 
                      type="submit" 
                      [disabled]="roomForm.invalid"
                      class="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                      Qo'shish
                    </button>
                  </form>
                </div>
              } @else {
                <div class="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6">
                  @if (activeTab() === 'archive' || activeTab() === 'rejected') {
                    <div class="space-y-4 pb-6 border-b border-white/5">
                      <h3 class="font-bold">Tozalash</h3>
                      <p class="text-xs text-white/50">Barcha {{ activeTab() === 'archive' ? 'arxivlangan' : 'rad etilgan' }} bronlarni bir marta bosish bilan o'chirishingiz mumkin.</p>
                      <button 
                        (click)="onClearOld(activeTab() === 'archive' ? 'archive' : 'rejected')"
                        class="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <mat-icon class="text-sm">auto_delete</mat-icon>
                        Hammasini tozalash
                      </button>
                    </div>
                  }
                  <h3 class="font-bold">Statistika</h3>
                  <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div class="flex justify-between items-center">
                      <span class="text-white/50 text-xs md:text-sm">Jami bronlar</span>
                      <span class="font-bold">{{ bookingService.allBookings().length }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-white/50 text-xs md:text-sm">Kutilmoqda</span>
                      <span class="font-bold text-amber-500">{{ getCount('pending') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-white/50 text-xs md:text-sm">Faol</span>
                      <span class="font-bold text-emerald-500">{{ getCount('active') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-white/50 text-xs md:text-sm">Arxiv</span>
                      <span class="font-bold text-blue-500">{{ getCount('archive') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-white/50 text-xs md:text-sm">Rad etilgan</span>
                      <span class="font-bold text-rose-500">{{ getCount('rejected') }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    select option {
      background: #18181b;
      color: white;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class AdminComponent implements OnDestroy {
  ts = inject(TranslationService);
  roomService = inject(RoomService);
  bookingService = inject(BookingService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  locationService = inject(LocationService);
  settingsService = inject(SettingsService);
  adminService = inject(AdminService);
  
  t = computed(() => this.ts.t());
  activeTab = signal<AdminTab>('pending');
  peopleCount = signal(1);
  countries = this.locationService.getCountries().filter(c => c.id === 'uz' || c.id === 'other');
  selectedCountry = signal('uz');
  searchQuery = signal('');
  isAddingAdmin = signal(false);
  extendingBookingId = signal<string | null>(null);
  uploadingImage = signal(false);
  uploadProgress = signal(0);

  availablePermissions = [
    { id: 'all', label: 'Barcha huquqlar' },
    { id: 'bookings', label: 'Bronlarni boshqarish' },
    { id: 'rooms', label: 'Xonalarni boshqarish' },
    { id: 'settings', label: 'Sozlamalar' },
    { id: 'admins', label: 'Adminlarni boshqarish' }
  ];

  selectedPermissions: string[] = [];

  constructor() {
    effect(() => {
      const isAdm = this.auth.isAdmin();
      if (isAdm) {
        this.bookingService.listenToAllBookings();
        this.adminService.listenToAdmins();
        // Run cleanup once when admin is ready
        this.bookingService.cleanupOldBookings();
      } else {
        this.bookingService.stopAllListener();
        this.adminService.stopListener();
      }
    });
  }

  ngOnDestroy() {
    this.bookingService.stopAllListener();
    this.adminService.stopListener();
  }

  onPermissionChange(event: Event, permId: string) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedPermissions.push(permId);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permId);
    }
    this.adminForm.patchValue({ permissions: this.selectedPermissions });
  }

  adminForm = this.fb.group({
    uid: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    permissions: [[] as string[]]
  });

  async onAddAdmin() {
    if (this.adminForm.invalid) return;
    const val = this.adminForm.value;
    try {
      await this.adminService.addAdmin({
        uid: val.uid!,
        email: val.email!,
        permissions: val.permissions || ['all'],
        createdAt: new Date().toISOString()
      });
      this.adminForm.reset();
      this.selectedPermissions = [];
      this.isAddingAdmin.set(false);
      alert('Admin muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Add admin error:', error);
      alert('Xatolik yuz berdi.');
    }
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val.toLowerCase());
  }

  tabs = computed(() => {
    const t = this.t();
    const baseTabs = [
      { id: 'pending' as AdminTab, label: t('booking.status.pending'), icon: 'hourglass_empty', count: this.getCount('pending') },
      { id: 'active' as AdminTab, label: t('booking.status.active'), icon: 'check_circle', count: this.getCount('active') },
      { id: 'archive' as AdminTab, label: t('booking.status.archive'), icon: 'archive', count: this.getCount('archive') },
      { id: 'rejected' as AdminTab, label: t('booking.status.rejected'), icon: 'cancel', count: this.getCount('rejected') },
      { id: 'offline' as AdminTab, label: t('admin.offline'), icon: 'add_circle' },
      { id: 'rooms' as AdminTab, label: t('admin.rooms'), icon: 'hotel' },
      { id: 'settings' as AdminTab, label: t('admin.contact_settings'), icon: 'settings' }
    ];

    if (this.auth.hasPermission('admins') || this.auth.hasPermission('all')) {
      baseTabs.push({ id: 'admins' as AdminTab, label: 'Adminlar', icon: 'admin_panel_settings' });
    }

    return baseTabs;
  });

  roomForm = this.fb.group({
    type: ['', Validators.required],
    price: [null as number | null, Validators.required],
    capacity: [null as number | null, Validators.required],
    totalCount: [null as number | null, Validators.required],
    description: ['', Validators.required],
    images: this.fb.array([
      this.fb.control('https://picsum.photos/seed/room1/800/600', Validators.required),
      this.fb.control('https://picsum.photos/seed/room2/800/600', Validators.required),
      this.fb.control('https://picsum.photos/seed/room3/800/600', Validators.required)
    ])
  });

  settingsForm = this.fb.group({
    phone: [this.settingsService.contactInfo().phone, Validators.required],
    email: [this.settingsService.contactInfo().email, [Validators.required, Validators.email]],
    address: [this.settingsService.contactInfo().address, Validators.required],
    telegram: [this.settingsService.contactInfo().telegram],
    instagram: [this.settingsService.contactInfo().instagram]
  });

  get roomImagesArray() {
    return this.roomForm.get('images') as FormArray;
  }

  addImage() {
    if (this.roomImagesArray.length < 10) {
      this.roomImagesArray.push(this.fb.control('', Validators.required));
    }
  }

  removeImage(index: number) {
    this.roomImagesArray.removeAt(index);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const path = `rooms/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    this.uploadingImage.set(true);
    this.uploadProgress.set(0);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadProgress.set(progress);
      }, 
      (error) => {
        console.error('Upload error:', error);
        this.uploadingImage.set(false);
        alert('Rasm yuklashda xatolik yuz berdi.');
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        this.roomImagesArray.push(this.fb.control(downloadURL, Validators.required));
        this.uploadingImage.set(false);
        this.uploadProgress.set(0);
        input.value = ''; // Reset input
      }
    );
  }

  offlineForm = this.fb.group({
    people: this.fb.array([this.createPersonGroup()]),
    phone: ['', Validators.required],
    roomType: ['', Validators.required],
    country: ['uz', Validators.required],
    otherCountry: [''],
    region: ['', Validators.required],
    otherRegion: [''],
    district: ['', Validators.required],
    otherDistrict: [''],
    mahalla: ['', Validators.required],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required]
  });

  regions = computed(() => {
    const country = this.countries.find(c => c.id === this.selectedCountry());
    return country?.regions || [];
  });

  selectedRegion = signal('');
  districts = computed(() => {
    const region = this.regions().find(r => r.id === this.selectedRegion());
    return region?.districts || [];
  });

  onCountryChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCountry.set(val);
    
    if (val === 'other') {
      this.offlineForm.get('region')?.clearValidators();
      this.offlineForm.get('district')?.clearValidators();
      this.offlineForm.get('otherCountry')?.setValidators([Validators.required]);
      this.offlineForm.get('otherRegion')?.setValidators([Validators.required]);
      this.offlineForm.get('otherDistrict')?.setValidators([Validators.required]);
    } else {
      this.offlineForm.get('region')?.setValidators([Validators.required]);
      this.offlineForm.get('district')?.setValidators([Validators.required]);
      this.offlineForm.get('otherCountry')?.clearValidators();
      this.offlineForm.get('otherRegion')?.clearValidators();
      this.offlineForm.get('otherDistrict')?.clearValidators();
    }
    
    this.offlineForm.patchValue({ 
      region: '', 
      district: '',
      otherCountry: '',
      otherRegion: '',
      otherDistrict: ''
    });
    
    this.offlineForm.get('region')?.updateValueAndValidity();
    this.offlineForm.get('district')?.updateValueAndValidity();
    this.offlineForm.get('otherCountry')?.updateValueAndValidity();
    this.offlineForm.get('otherRegion')?.updateValueAndValidity();
    this.offlineForm.get('otherDistrict')?.updateValueAndValidity();
    
    this.selectedRegion.set('');
  }

  onRegionChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedRegion.set(val);
    this.offlineForm.patchValue({ district: '' });
  }

  async onOfflineSubmit() {
    if (this.offlineForm.invalid) return;
    const val = this.offlineForm.value;
    
    // Get region and district names
    const lang = this.ts.getLanguage();
    let countryName = '';
    let regionName = '';
    let districtName = '';

    if (val.country === 'other') {
      countryName = val.otherCountry || 'Boshqa';
      regionName = val.otherRegion || '';
      districtName = val.otherDistrict || '';
    } else {
      countryName = this.countries.find(c => c.id === val.country)?.name[lang] || val.country || '';
      regionName = this.regions().find(r => r.id === val.region)?.name[lang] || val.region || '';
      districtName = this.districts().find(d => d.id === val.district)?.name[lang] || val.district || '';
    }

    const booking: Booking = {
      userId: 'offline',
      name: (val.people as Booking['people'] || [])[0]?.name || '',
      phone: val.phone!,
      roomType: val.roomType!,
      roomId: val.roomType!, // For offline, we use roomType as requested roomId
      region: `${countryName}, ${regionName}`,
      district: districtName!,
      mahalla: val.mahalla!,
      checkIn: val.checkIn!,
      checkOut: val.checkOut!,
      status: 'pending',
      createdAt: new Date().toISOString(),
      people: val.people as Booking['people'],
      telegram: '',
    };

    try {
      await this.bookingService.createBooking(booking);
      this.offlineForm.reset({
        people: [{ name: '', age: null, passport: '', gender: 'male' }],
        phone: '',
        roomType: '',
        region: '',
        district: '',
        mahalla: '',
        checkIn: '',
        checkOut: ''
      });
      this.peopleCount.set(1);
      this.activeTab.set('pending');
      alert('Offline bron muvaffaqiyatli qo\'shildi!');
    } catch (e) {
      console.error(e);
      alert('Xatolik yuz berdi.');
    }
  }

  get peopleFormArray() {
    return this.offlineForm.get('people') as FormArray;
  }

  createPersonGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      age: [null as number | null, Validators.required],
      passport: ['', Validators.required],
      gender: ['male']
    });
  }

  setPeopleCount(count: number) {
    this.peopleCount.set(count);
    while (this.peopleFormArray.length !== count) {
      if (this.peopleFormArray.length < count) {
        this.peopleFormArray.push(this.createPersonGroup());
      } else {
        this.peopleFormArray.removeAt(this.peopleFormArray.length - 1);
      }
    }
  }

  filteredBookings = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery();
    if (tab === 'offline' || tab === 'rooms') return [];
    
    let bookings = this.bookingService.allBookings().filter(b => b.status === tab);
    
    if (query) {
      bookings = bookings.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.phone.includes(query) ||
        (b.people && b.people.some(p => p.name.toLowerCase().includes(query)))
      );
    }
    
    return bookings;
  });

  getCount(status: string) {
    return this.bookingService.allBookings().filter(b => b.status === status).length;
  }

  async onAddRoom() {
    if (this.roomForm.invalid) return;
    const val = this.roomForm.value;
    
    const newRoom: Room = {
      type: val.type!,
      price: val.price!,
      capacity: val.capacity!,
      totalCount: val.totalCount!,
      description: val.description!,
      images: val.images as string[],
      amenities: ['WiFi', 'TV', 'Issiq suv', 'Konditsioner']
    };

    try {
      await this.roomService.addRoom(newRoom);
      this.roomForm.reset();
      while (this.roomImagesArray.length > 3) {
        this.roomImagesArray.removeAt(this.roomImagesArray.length - 1);
      }
      alert('Xona muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Add room error:', error);
      alert('Xona qo\'shishda xatolik yuz berdi.');
    }
  }

  async onDeleteRoom(id: string) {
    if (confirm("Ushbu xonani butunlay o'chirmoqchimisiz?")) {
      try {
        await this.roomService.deleteRoom(id);
        alert("Xona o'chirildi.");
      } catch (error) {
        console.error('Delete room error:', error);
        alert("Xonani o'chirishda xatolik yuz berdi.");
      }
    }
  }

  async onSettingsSubmit() {
    if (this.settingsForm.invalid) return;
    try {
      await this.settingsService.updateContactInfo(this.settingsForm.value as ContactInfo);
      alert('Kontakt ma’lumotlari saqlandi!');
    } catch (error) {
      console.error('Settings update error:', error);
    }
  }

  async onSyncPublic() {
    if (confirm("Barcha bronlarni ochiq ma'lumotlar bilan sinxronizatsiya qilmoqchimisiz? Bu bron qilishda bo'sh joylarni to'g'ri ko'rsatish uchun kerak.")) {
      try {
        const count = await this.bookingService.syncPublicBookings();
        alert(`${count} ta bron sinxronizatsiya qilindi.`);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
  }

  async onClearOld(type: 'rejected' | 'archive' | 'all_old') {
    const msg = type === 'rejected' ? "Barcha rad etilganlarni o'chirmoqchimisiz?" : 
                type === 'archive' ? "Barcha arxivlanganlarni o'chirmoqchimisiz?" : 
                "Barcha eski bronlarni o'chirmoqchimisiz?";
    if (confirm(msg)) {
      try {
        const count = await this.bookingService.clearOldBookings(type);
        alert(`${count} ta bron o'chirildi.`);
      } catch (error) {
        console.error('Clear error:', error);
      }
    }
  }

  async onDeleteBooking(id: string) {
    if (confirm("Ushbu bronni butunlay o'chirmoqchimisiz?")) {
      try {
        await this.bookingService.deleteBooking(id);
        alert("Bron o'chirildi.");
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  }

  async confirmExtension(booking: Booking, newDate: string) {
    if (!newDate || newDate === booking.checkOut) {
      this.extendingBookingId.set(null);
      return;
    }

    try {
      await this.bookingService.updateBooking(booking.id!, { checkOut: newDate });
      this.extendingBookingId.set(null);
      alert('Muddati uzaytirildi!');
    } catch (error) {
      console.error('Extend booking error:', error);
      alert('Xatolik yuz berdi: ' + (error instanceof Error ? error.message : 'Noma’lum xatolik'));
    }
  }

  async onExtendBooking(booking: Booking) {
    this.extendingBookingId.set(booking.id!);
  }
}
