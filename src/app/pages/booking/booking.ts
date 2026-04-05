import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { BookingService, Booking } from '../../services/booking';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import { LocationService } from '../../services/location';
import { NavbarComponent } from '../../components/navbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const checkIn = control.get('checkIn');
  const checkOut = control.get('checkOut');

  return checkIn && checkOut && checkIn.value && checkOut.value && new Date(checkOut.value) <= new Date(checkIn.value) 
    ? { dateRangeInvalid: true } 
    : null;
};

@Component({
  selector: 'app-booking',
  imports: [NavbarComponent, MatIconModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white pb-24">
      <app-navbar></app-navbar>

      <div class="pt-32 px-6 max-w-4xl mx-auto">
        <div class="glass p-8 md:p-12 rounded-[3rem]">
          <h1 class="font-display text-4xl font-bold mb-8 text-center">{{ t()('booking.title') }}</h1>
          
          @if (selectedRoomType()) {
            <div class="glass px-6 py-4 rounded-2xl mb-8 flex items-center justify-between border-emerald-500/30">
              <div class="flex flex-col">
                <div class="flex items-center gap-4">
                  <mat-icon class="text-emerald-500">hotel</mat-icon>
                  <span class="font-bold text-lg">{{ selectedRoomType() }}</span>
                </div>
                @if (bookingForm.get('checkIn')?.value && bookingForm.get('checkOut')?.value) {
                  <div class="text-xs text-white/50 mt-1 flex items-center gap-2">
                    <mat-icon class="text-xs">info</mat-icon>
                    <span>{{ availableSpots() }} ta bo'sh joy mavjud</span>
                  </div>
                }
              </div>
              <button (click)="selectedRoomType.set(null)" class="text-white/50 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }

          @if (bookingForm.get('checkIn')?.value && bookingForm.get('checkOut')?.value && !isRoomAvailable()) {
            <div class="bg-rose-500/20 text-rose-500 p-4 rounded-2xl mb-8 flex items-center gap-3">
              <mat-icon>warning</mat-icon>
              @if (bookingForm.errors?.['dateRangeInvalid']) {
                <span class="text-sm font-bold">{{ t()('booking.error.date_range') }}</span>
              } @else {
                <span class="text-sm font-bold">Tanlangan sanalarda yetarli bo'sh joy yo'q. Faqat {{ availableSpots() }} ta joy qolgan.</span>
              }
            </div>
          }

          <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-8">
            <!-- People Count Selection -->
            <div class="space-y-4">
              <span class="text-sm font-medium text-white/50 block">{{ t()('booking.people_count') }}</span>
              <div class="grid grid-cols-4 gap-4">
                @for (count of [1, 2, 3, 4]; track count) {
                  <button 
                    type="button"
                    (click)="setPeopleCount(count)"
                    [class.bg-emerald-500]="peopleCount() === count"
                    [class.glass]="peopleCount() !== count"
                    class="py-4 rounded-2xl font-bold transition-all"
                  >
                    {{ count === 1 ? t()('booking.only_me') : count + ' ' + t()('booking.person') }}
                  </button>
                }
              </div>
            </div>

            <!-- Dynamic Person Fields -->
            <div formArrayName="people" class="space-y-8">
              @for (person of peopleFormArray.controls; track $index) {
                <div [formGroupName]="$index" class="glass p-6 rounded-3xl space-y-6 relative">
                  <div class="absolute -top-3 left-6 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                    {{ $index + 1 }}-{{ t()('booking.person') }}
                  </div>

                  <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label [for]="'name-' + $index" class="text-sm font-medium text-white/50">{{ t()('booking.name') }}</label>
                      <input [id]="'name-' + $index" type="text" formControlName="name" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    </div>
                    <div class="space-y-2">
                      <label [for]="'age-' + $index" class="text-sm font-medium text-white/50">{{ t()('booking.age') }}</label>
                      <input [id]="'age-' + $index" type="number" formControlName="age" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label [for]="'passport-' + $index" class="text-sm font-medium text-white/50">{{ t()('booking.passport') }}</label>
                      <input [id]="'passport-' + $index" type="text" formControlName="passport" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    </div>
                    @if (peopleCount() === 1) {
                      <div class="space-y-2">
                        <label [for]="'gender-' + $index" class="text-sm font-medium text-white/50">{{ t()('booking.gender') }}</label>
                        <select [id]="'gender-' + $index" formControlName="gender" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                          <option value="male">{{ t()('booking.gender.male') }}</option>
                          <option value="female">{{ t()('booking.gender.female') }}</option>
                        </select>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Contact Info -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="phone" class="text-sm font-medium text-white/50">{{ t()('booking.phone') }}</label>
                <input id="phone" type="tel" formControlName="phone" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              </div>
              <div class="space-y-2">
                <label for="telegram" class="text-sm font-medium text-white/50">{{ t()('booking.telegram') }}</label>
                <input id="telegram" type="text" formControlName="telegram" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              </div>
            </div>

            <!-- Location Selection -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="country" class="text-sm font-medium text-white/50">{{ t()('booking.country') }}</label>
                <select id="country" formControlName="country" (change)="onCountryChange()" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                  <option value="" disabled selected>{{ t()('booking.select') }}</option>
                  @for (country of countries; track country.id) {
                    <option [value]="country.id">{{ country.name[ts.getLanguage()] }}</option>
                  }
                </select>
              </div>
              @if (selectedCountryId() === 'other') {
                <div class="space-y-2">
                  <label for="otherCountry" class="text-sm font-medium text-white/50">Davlat nomi</label>
                  <input id="otherCountry" type="text" formControlName="otherCountry" placeholder="Davlatni yozing" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                </div>
              }
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="region" class="text-sm font-medium text-white/50">{{ t()('booking.region') }}</label>
                @if (selectedCountryId() === 'other') {
                  <input id="otherRegion" type="text" formControlName="otherRegion" placeholder="Viloyatni yozing" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                } @else {
                  <select id="region" formControlName="region" (change)="onRegionChange()" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none" [disabled]="!availableRegions().length">
                    <option value="" disabled selected>{{ t()('booking.select') }}</option>
                    @for (region of availableRegions(); track region.id) {
                      <option [value]="region.id">{{ region.name[ts.getLanguage()] }}</option>
                    }
                  </select>
                }
              </div>
              <div class="space-y-2">
                <label for="district" class="text-sm font-medium text-white/50">{{ t()('booking.district') }}</label>
                @if (selectedCountryId() === 'other') {
                  <input id="otherDistrict" type="text" formControlName="otherDistrict" placeholder="Tumanni yozing" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                } @else {
                  <select id="district" formControlName="district" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none" [disabled]="!availableDistricts().length">
                    <option value="" disabled selected>{{ t()('booking.select') }}</option>
                    @for (district of availableDistricts(); track district.id) {
                      <option [value]="district.id">{{ district.name[ts.getLanguage()] }}</option>
                    }
                  </select>
                }
              </div>
            </div>

            <div class="space-y-2">
              <label for="mahalla" class="text-sm font-medium text-white/50">{{ t()('booking.mahalla') }}</label>
              <input id="mahalla" type="text" formControlName="mahalla" placeholder="Mahallani yozing" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            </div>

            <!-- Dates -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="checkIn" class="text-sm font-medium text-white/50">{{ t()('booking.checkIn') }}</label>
                <input id="checkIn" type="date" formControlName="checkIn" [min]="today" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              </div>
              <div class="space-y-2">
                <label for="checkOut" class="text-sm font-medium text-white/50">{{ t()('booking.checkOut') }}</label>
                <input id="checkOut" type="date" formControlName="checkOut" [min]="bookingForm.get('checkIn')?.value || today" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="bookingForm.invalid || isSubmitting() || !isRoomAvailable()"
              class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-3xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/20 mt-8"
            >
              @if (isSubmitting()) {
                <span class="animate-pulse">Yuborilmoqda...</span>
              } @else {
                {{ t()('booking.submit') }}
              }
            </button>
          </form>
        </div>

        @if (bookingService.userBookings().length > 0) {
          <div class="mt-12 space-y-6">
            <h2 class="text-2xl font-bold px-4">{{ t()('booking.my_bookings') }}</h2>
            @for (booking of bookingService.userBookings(); track booking.id) {
              <div class="glass p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div class="font-bold">{{ booking.roomType }}</div>
                  <div class="text-sm text-white/50">{{ booking.checkIn }} - {{ booking.checkOut }}</div>
                  <div class="text-xs text-white/30 mt-1">{{ booking.people?.length || 1 }} {{ t()('booking.person') }}</div>
                </div>
                <div 
                  [class]="{
                    'bg-amber-500/20 text-amber-500': booking.status === 'pending',
                    'bg-emerald-500/20 text-emerald-500': booking.status === 'active',
                    'bg-blue-500/20 text-blue-500': booking.status === 'archive',
                    'bg-rose-500/20 text-rose-500': booking.status === 'rejected'
                  }"
                  class="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {{ t()('booking.status.' + booking.status) }}
                </div>
              </div>
            }
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
  `]
})
export class BookingComponent implements OnInit {
  ts = inject(TranslationService);
  bookingService = inject(BookingService);
  roomService = inject(RoomService);
  auth = inject(AuthService);
  locationService = inject(LocationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  t = computed(() => this.ts.t());
  selectedRoomId = signal<string | null>(null);
  selectedRoomType = signal<string | null>(null);
  isSubmitting = signal(false);
  peopleCount = signal(1);
  isRoomAvailable = signal(true);
  availableSpots = signal(0);
  today = new Date().toISOString().split('T')[0];

  countries = this.locationService.getCountries().filter(c => c.id === 'uz' || c.id === 'other');
  selectedCountryId = signal('');
  selectedRegionId = signal('');

  bookingForm = this.fb.group({
    people: this.fb.array([this.createPersonGroup()]),
    phone: ['', Validators.required],
    telegram: [''],
    country: ['', Validators.required],
    otherCountry: [''],
    region: ['', Validators.required],
    otherRegion: [''],
    district: ['', Validators.required],
    otherDistrict: [''],
    mahalla: ['', Validators.required],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required]
  }, { validators: [dateRangeValidator] });

  get peopleFormArray() {
    return this.bookingForm.get('people') as FormArray;
  }

  createPersonGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(120)]],
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
    this.checkAvailability();
  }

  availableRegions = computed(() => {
    const countryId = this.selectedCountryId();
    if (!countryId) return [];
    return this.countries.find(c => c.id === countryId)?.regions || [];
  });

  availableDistricts = computed(() => {
    const regionId = this.selectedRegionId();
    if (!regionId) return [];
    return this.availableRegions().find(r => r.id === regionId)?.districts || [];
  });

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.bookingService.listenToUserBookings(user.uid);
      } else {
        this.bookingService.stopUserListener();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['roomId']) this.selectedRoomId.set(params['roomId']);
      if (params['roomType']) this.selectedRoomType.set(params['roomType']);
    });

    // Watch for date changes to check availability
    this.bookingForm.valueChanges.subscribe(() => {
      this.checkAvailability();
    });
  }

  async checkAvailability() {
    const val = this.bookingForm.value;
    const roomType = this.selectedRoomType();
    if (!val.checkIn || !val.checkOut || !roomType) {
      this.availableSpots.set(0);
      this.isRoomAvailable.set(true);
      return;
    }

    const room = this.roomService.rooms().find(r => r.type === roomType);
    if (!room) return;

    const checkIn = new Date(val.checkIn);
    const checkOut = new Date(val.checkOut);
    
    if (checkOut <= checkIn) {
      this.isRoomAvailable.set(false);
      return;
    }

    // Calculate total spots (beds)
    const totalSpots = (room.totalCount || 1) * (room.capacity || 1);

    // Find all active bookings for this room type from public bookings
    const activeBookings = this.bookingService.publicBookings().filter(b => 
      b.roomType === roomType && 
      b.status !== 'rejected' && b.status !== 'archive'
    );

    // Check each day in the range
    let minRemaining = totalSpots;
    const current = new Date(checkIn);
    while (current < checkOut) {
      const dayStart = new Date(current);
      const dayEnd = new Date(current);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const occupiedOnDay = activeBookings.filter(b => 
        new Date(b.checkIn) < dayEnd && new Date(b.checkOut) > dayStart
      ).reduce((sum, b) => sum + (b.peopleCount || 1), 0);

      const remainingOnDay = totalSpots - occupiedOnDay;
      if (remainingOnDay < minRemaining) {
        minRemaining = remainingOnDay;
      }
      current.setDate(current.getDate() + 1);
    }
    
    this.availableSpots.set(minRemaining);
    this.isRoomAvailable.set(minRemaining >= this.peopleCount());
  }

  onCountryChange() {
    const countryId = this.bookingForm.get('country')?.value || '';
    this.selectedCountryId.set(countryId);
    
    if (countryId === 'other') {
      this.bookingForm.get('region')?.clearValidators();
      this.bookingForm.get('district')?.clearValidators();
      this.bookingForm.get('otherCountry')?.setValidators([Validators.required]);
      this.bookingForm.get('otherRegion')?.setValidators([Validators.required]);
      this.bookingForm.get('otherDistrict')?.setValidators([Validators.required]);
    } else {
      this.bookingForm.get('region')?.setValidators([Validators.required]);
      this.bookingForm.get('district')?.setValidators([Validators.required]);
      this.bookingForm.get('otherCountry')?.clearValidators();
      this.bookingForm.get('otherRegion')?.clearValidators();
      this.bookingForm.get('otherDistrict')?.clearValidators();
    }
    
    this.bookingForm.get('region')?.setValue('');
    this.bookingForm.get('district')?.setValue('');
    this.bookingForm.get('otherCountry')?.setValue('');
    this.bookingForm.get('otherRegion')?.setValue('');
    this.bookingForm.get('otherDistrict')?.setValue('');
    
    this.bookingForm.get('region')?.updateValueAndValidity();
    this.bookingForm.get('district')?.updateValueAndValidity();
    this.bookingForm.get('otherCountry')?.updateValueAndValidity();
    this.bookingForm.get('otherRegion')?.updateValueAndValidity();
    this.bookingForm.get('otherDistrict')?.updateValueAndValidity();
    
    this.selectedRegionId.set('');
  }

  onRegionChange() {
    const regionId = this.bookingForm.get('region')?.value || '';
    this.selectedRegionId.set(regionId);
    this.bookingForm.get('district')?.setValue('');
  }

  async onSubmit() {
    if (this.bookingForm.invalid || !this.auth.user() || !this.isRoomAvailable()) return;

    this.isSubmitting.set(true);
    const formValue = this.bookingForm.value;

    let country = '';
    let region = '';
    let district = '';

    const lang = this.ts.getLanguage();
    if (formValue.country === 'other') {
      country = formValue.otherCountry || 'Boshqa';
      region = formValue.otherRegion || '';
      district = formValue.otherDistrict || '';
    } else {
      country = this.countries.find(c => c.id === formValue.country)?.name[lang] || formValue.country || '';
      region = this.availableRegions().find(r => r.id === formValue.region)?.name[lang] || formValue.region || '';
      district = this.availableDistricts().find(d => d.id === formValue.district)?.name[lang] || formValue.district || '';
    }

    const booking: Booking = {
      userId: this.auth.user()!.uid,
      roomId: this.selectedRoomId() || 'general',
      roomType: this.selectedRoomType() || 'Xona turi tanlanmagan',
      name: (formValue.people as Booking['people'] || [])[0]?.name || '',
      people: formValue.people as Booking['people'],
      phone: formValue.phone!,
      telegram: formValue.telegram || '',
      region: `${country}, ${region}`,
      district: district!,
      mahalla: formValue.mahalla!,
      checkIn: formValue.checkIn!,
      checkOut: formValue.checkOut!,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await this.bookingService.createBooking(booking);
      this.bookingForm.reset();
      this.setPeopleCount(1);
      this.selectedRoomId.set(null);
      this.selectedRoomType.set(null);
      alert('Bron muvaffaqiyatli yuborildi!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
