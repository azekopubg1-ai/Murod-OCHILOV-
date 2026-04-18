import { Injectable } from '@angular/core';
import { Country, State, City } from 'country-state-city';

export interface LocationItem {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  getCountries(): LocationItem[] {
    return Country.getAllCountries().map(c => ({
      id: c.isoCode,
      name: c.name
    }));
  }

  getStatesOfCountry(countryCode: string): LocationItem[] {
    return State.getStatesOfCountry(countryCode).map(s => ({
      id: s.isoCode,
      name: s.name
    }));
  }

  getCitiesOfState(countryCode: string, stateCode: string): LocationItem[] {
    return City.getCitiesOfState(countryCode, stateCode).map(c => ({
      id: c.name, // City usually doesn't have an isoCode
      name: c.name
    }));
  }
}
