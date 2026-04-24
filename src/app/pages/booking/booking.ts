import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { BookingService, Booking } from '../../services/booking';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import { LocationService, LocationItem } from '../../services/location';
import { NotificationService } from '../../services/notification';
import { NavbarComponent } from '../../components/navbar';
import { FooterComponent } from '../../components/footer';
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
  imports: [NavbarComponent, FooterComponent, MatIconModule, ReactiveFormsModule, CommonModule],
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
              </div>
              <button (click)="selectedRoomId.set(null)" class="text-white/50 hover:text-white">
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
                <span class="text-sm font-bold">{{ t()('booking.no_availability') }}</span>
              }
            </div>
          }

          @if (selectedRoomType() && busyDates().length > 0) {
            <div class="glass p-6 rounded-3xl mb-8 border-amber-500/20">
              <div class="flex items-center gap-2 mb-4 text-amber-500">
                <mat-icon>event_busy</mat-icon>
                <h3 class="font-bold">{{ t()('booking.busy_dates') }}</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                @for (range of busyDates(); track range) {
                  <span class="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-medium">
                    {{ range }}
                  </span>
                }
              </div>
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
            <div class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Country -->
                <div class="space-y-2">
                  <label for="country" class="text-sm font-medium text-white/50">{{ t()('booking.country') }}</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      [placeholder]="t()('booking.search_placeholder') || 'Qidirish...'"
                      [value]="countrySearch()"
                      (input)="countrySearch.set($event.target.value)"
                      class="w-full glass p-4 rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-b border-white/10"
                    >
                    <select 
                      id="country" 
                      formControlName="country" 
                      (change)="onCountryChange()" 
                      class="w-full glass p-4 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                    >
                      <option value="" disabled selected>{{ t()('booking.select') }}</option>
                      @for (country of filteredCountries(); track country.id) {
                        <option [value]="country.id">{{ country.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <!-- Region -->
                <div class="space-y-2">
                  <label for="region" class="text-sm font-medium text-white/50">{{ t()('booking.region') }}</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      [disabled]="!availableRegions().length"
                      [placeholder]="t()('booking.search_placeholder') || 'Qidirish...'"
                      [value]="regionSearch()"
                      (input)="regionSearch.set($event.target.value)"
                      class="w-full glass p-4 rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-b border-white/10 disabled:opacity-50"
                    >
                    <select 
                      id="region" 
                      formControlName="region" 
                      (change)="onRegionChange()" 
                      class="w-full glass p-4 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none disabled:opacity-50" 
                      [disabled]="!availableRegions().length"
                    >
                      <option value="" disabled selected>{{ t()('booking.select') }}</option>
                      @for (region of filteredRegions(); track region.id) {
                        <option [value]="region.id">{{ region.name }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <!-- District -->
                <div class="space-y-2">
                  <label for="district" class="text-sm font-medium text-white/50">{{ t()('booking.district') }}</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      [disabled]="!availableDistricts().length"
                      [placeholder]="t()('booking.search_placeholder') || 'Qidirish...'"
                      [value]="districtSearch()"
                      (input)="districtSearch.set($event.target.value)"
                      class="w-full glass p-4 rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-b border-white/10 disabled:opacity-50"
                    >
                    <select 
                      id="district" 
                      formControlName="district" 
                      class="w-full glass p-4 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none disabled:opacity-50" 
                      [disabled]="!availableDistricts().length"
                    >
                      <option value="" disabled selected>{{ t()('booking.select') }}</option>
                      @for (district of filteredDistricts(); track district.id) {
                        <option [value]="district.id">{{ district.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="mahalla" class="text-sm font-medium text-white/50">{{ t()('booking.mahalla') }}</label>
                  <input id="mahalla" type="text" formControlName="mahalla" [placeholder]="t()('booking.mahalla_placeholder') || 'Mahallani yozing'" class="w-full glass p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                </div>
              </div>
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
                <span class="animate-pulse">{{ t()('booking.submitting') }}</span>
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

      <app-footer></app-footer>
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
  ns = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  t = computed(() => this.ts.t());
  selectedRoomId = signal<string | null>(null);
  selectedRoomType = computed(() => {
    const id = this.selectedRoomId();
    if (id) {
      const room = this.roomService.rooms().find(r => r.id === id);
      if (room) return this.ts.translateObject(room.type);
    }
    return this.route.snapshot.queryParams['roomType'] || null;
  });
  isSubmitting = signal(false);
  peopleCount = signal(1);
  isRoomAvailable = signal(true);
  availableSpots = signal(0);
  busyDates = signal<string[]>([]);
  today = new Date().toISOString().split('T')[0];

  countries = this.locationService.getCountries();
  availableRegions = signal<LocationItem[]>([]);
  availableDistricts = signal<LocationItem[]>([]);
  selectedCountryId = signal('');
  selectedRegionId = signal('');
  countrySearch = signal('');
  regionSearch = signal('');
  districtSearch = signal('');

  filteredCountries = computed(() => {
    const q = this.countrySearch().toLowerCase();
    if (!q) return this.countries;
    return this.countries.filter(c => c.name.toLowerCase().includes(q));
  });

  filteredRegions = computed(() => {
    const q = this.regionSearch().toLowerCase();
    const regions = this.availableRegions();
    if (!q) return regions;
    return regions.filter(r => r.name.toLowerCase().includes(q));
  });

  filteredDistricts = computed(() => {
    const q = this.districtSearch().toLowerCase();
    const districts = this.availableDistricts();
    if (!q) return districts;
    return districts.filter(d => d.name.toLowerCase().includes(q));
  });

  bookingForm = this.fb.group({
    people: this.fb.array([this.createPersonGroup()]),
    phone: ['', Validators.required],
    telegram: [''],
    country: ['', Validators.required],
    region: ['', Validators.required],
    district: ['', Validators.required],
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
      if (this.peopleCount() > this.peopleFormArray.length) {
        this.peopleFormArray.push(this.createPersonGroup());
      } else {
        this.peopleFormArray.removeAt(this.peopleFormArray.length - 1);
      }
    }
    this.checkAvailability();
  }

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
      if (params['roomId']) {
        this.selectedRoomId.set(params['roomId']);
      } else if (params['roomType']) {
        // Fallback for direct links with just roomType string
        // but we'll try to find the roomId if it's unique
        const room = this.roomService.rooms().find(r => 
          Object.values(r.type).includes(params['roomType'])
        );
        if (room) this.selectedRoomId.set(room.id!);
      }
    });

    // Watch for date changes to check availability
    this.bookingForm.valueChanges.subscribe(() => {
      this.checkAvailability();
    });
  }

  async checkAvailability() {
    const val = this.bookingForm.value;
    const roomId = this.selectedRoomId();
    if (!val.checkIn || !val.checkOut || !roomId) {
      this.availableSpots.set(0);
      this.isRoomAvailable.set(true);
      return;
    }

    const room = this.roomService.rooms().find(r => r.id === roomId);
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
      b.roomId === roomId && 
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
    this.calculateBusyDates();
  }

  calculateBusyDates() {
    const roomType = this.selectedRoomType();
    if (!roomType) {
      this.busyDates.set([]);
      return;
    }

    const room = this.roomService.rooms().find(r => {
      if (typeof r.type === 'string') return r.type === roomType;
      return Object.values(r.type as Record<string, string>).includes(roomType);
    });
    if (!room) return;

    const totalSpots = (room.totalCount || 1) * (room.capacity || 1);
    const activeBookings = this.bookingService.publicBookings().filter(b => 
      b.roomType === roomType && 
      b.status !== 'rejected' && b.status !== 'archive'
    );

    const busyRanges: string[] = [];
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 3); // Check 3 months ahead

    let currentRangeStart: Date | null = null;
    const current = new Date(start);
    
    while (current <= end) {
      const dayStart = new Date(current);
      const dayEnd = new Date(current);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const occupiedOnDay = activeBookings.filter(b => 
        new Date(b.checkIn) < dayEnd && new Date(b.checkOut) > dayStart
      ).reduce((sum, b) => sum + (b.peopleCount || 1), 0);

      // A day is "busy" if there are no spots left for at least 1 person
      const isBusy = (totalSpots - occupiedOnDay) < 1;

      if (isBusy) {
        if (!currentRangeStart) currentRangeStart = new Date(current);
      } else {
        if (currentRangeStart) {
          const rangeEnd = new Date(current);
          rangeEnd.setDate(rangeEnd.getDate() - 1);
          busyRanges.push(`${currentRangeStart.toISOString().split('T')[0]} - ${rangeEnd.toISOString().split('T')[0]}`);
          currentRangeStart = null;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    if (currentRangeStart) {
      busyRanges.push(`${currentRangeStart.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`);
    }

    this.busyDates.set(busyRanges);
  }

  onCountryChange() {
    const countryId = this.bookingForm.get('country')?.value || '';
    this.selectedCountryId.set(countryId);
    
    const states = this.locationService.getStatesOfCountry(countryId);
    this.availableRegions.set(states);
    this.availableDistricts.set([]);

    this.bookingForm.get('region')?.setValue('');
    this.bookingForm.get('district')?.setValue('');
    this.selectedRegionId.set('');
  }

  onRegionChange() {
    const regionId = this.bookingForm.get('region')?.value || '';
    this.selectedRegionId.set(regionId);
    
    const cities = this.locationService.getCitiesOfState(this.selectedCountryId(), regionId);
    this.availableDistricts.set(cities);
    this.bookingForm.get('district')?.setValue('');
  }

  async onSubmit() {
    if (this.bookingForm.invalid || !this.auth.user() || !this.isRoomAvailable()) return;

    this.isSubmitting.set(true);
    const formValue = this.bookingForm.value;

    const country = this.countries.find(c => c.id === formValue.country)?.name || formValue.country || '';
    const region = this.availableRegions().find(r => r.id === formValue.region)?.name || formValue.region || '';
    const district = this.availableDistricts().find(d => d.id === formValue.district)?.name || formValue.district || '';

    const booking: Booking = {
      userId: this.auth.user()!.uid,
      roomId: this.selectedRoomId() || 'general',
      roomType: this.selectedRoomType() || this.t()('booking.no_room_selected'),
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
      this.ns.alert(this.t()('booking.success'));
    } catch (error) {
      console.error('Booking error:', error);
      this.ns.alert(this.t()('booking.error.general'));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
