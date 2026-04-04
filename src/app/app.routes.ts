import {Routes} from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RoomsComponent } from './pages/rooms/rooms';
import { BookingComponent } from './pages/booking/booking';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
