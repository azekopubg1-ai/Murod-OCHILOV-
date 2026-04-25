import { Injectable } from '@angular/core';
import { Country, State, City } from 'country-state-city';

export interface LocationItem {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  // Manual override for Uzbekistan to ensure it's "complete" as requested
  private uzLocations: Record<string, string[]> = {
    'Samarqand viloyati': [
      'Bulung‘ur tumani', 'Ishtixon tumani', 'Jomboy tumani', 'Kattaqo‘rg‘on tumani',
      'Qo‘shrabot tumani', 'Narpay tumani', 'Nurobod tumani', 'Oqdaryo tumani',
      'Paxtachi tumani', 'Payariq tumani', 'Pastdarg‘om tumani', 'Samarqand tumani',
      'Toyloq tumani', 'Urgut tumani', 'Samarqand shahri', 'Kattaqo‘rg‘on shahri'
    ],
    'Andijon viloyati': [
      'Andijon tumani', 'Asaka tumani', 'Baliqchi tumani', 'Bo‘ston tumani',
      'Buloqboshi tumani', 'Izboskan tumani', 'Jalaquduq tumani', 'Marhamat tumani',
      'Oltinko‘l tumani', 'Paxtaobod tumani', 'Qo‘rg‘ontepa tumani', 'Shahrixon tumani',
      'Ulug‘nor tumani', 'Xo‘jaobod tumani', 'Andijon shahri', 'Xonobod shahri'
    ],
    'Buxoro viloyati': [
      'Buxoro tumani', 'G‘ijduvon tumani', 'Jondor tumani', 'Kogon tumani',
      'Olot tumani', 'Peshku tumani', 'Qorako‘l tumani', 'Qorovulbozor tumani',
      'Romitan tumani', 'Shofirkon tumani', 'Vobkent tumani', 'Buxoro shahri', 'Kogon shahri'
    ],
    'Farg‘ona viloyati': [
      'Bag‘dod tumani', 'Beshariq tumani', 'Buvayda tumani', 'Dang‘ara tumani',
      'Farg‘ona tumani', 'Furqat tumani', 'Oltiariq tumani', 'O‘zbekiston tumani',
      'Quva tumani', 'Rishton tumani', 'So‘x tumani', 'Toshloq tumani',
      'Uchko‘prik tumani', 'Yozyovon tumani', 'Quvasoy shahri', 'Marg‘ilon shahri',
      'Qo‘qon shahri', 'Farg‘ona shahri'
    ],
    'Jizzax viloyati': [
      'Arnasoy tumani', 'Baxmal tumani', 'Do‘stlik tumani', 'Forish tumani',
      'G‘allaorol tumani', 'Sharof Rashidov tumani', 'Mirzacho‘l tumani', 'Paxtakor tumani',
      'Yangiobod tumani', 'Zomin tumani', 'Zafarobod tumani', 'Zarbdor tumani', 'Jizzax shahri'
    ],
    'Xorazm viloyati': [
      'Bog‘ot tumani', 'Gurlan tumani', 'Qo‘shko‘pir tumani', 'Shovot tumani',
      'Urganch tumani', 'Xazorasp tumani', 'Xiva tumani', 'Xonqa tumani',
      'Yangiariq tumani', 'Yangibozor tumani', 'Tuproqqal’a tumani', 'Urganch shahri', 'Xiva shahri'
    ],
    'Namangan viloyati': [
      'Chortoq tumani', 'Chust tumani', 'Kosonsoy tumani', 'Mingbuloq tumani',
      'Namangan tumani', 'Norin tumani', 'Pop tumani', 'To‘raqo‘rg‘on tumani',
      'Uchqo‘rg‘on tumani', 'Uychi tumani', 'Yangiqo‘rg‘on tumani', 'Namangan shahri'
    ],
    'Navoiy viloyati': [
      'Konimex tumani', 'Karmana tumani', 'Qiziltepa tumani', 'Xatirchi tumani',
      'Navbahor tumani', 'Nurota tumani', 'Tomdi tumani', 'Uchquduq tumani',
      'Navoiy shahri', 'Zarafshon shahri'
    ],
    'Qashqadaryo viloyati': [
      'Chiroqchi tumani', 'Dehqonobod tumani', 'G‘uzor tumani', 'Kasbi tumani',
      'Kitob tumani', 'Koson tumani', 'Mirishkor tumani', 'Muborak tumani',
      'Nishon tumani', 'Qamashi tumani', 'Qarshi tumani', 'Shahrisabz tumani',
      'Yakkabog‘ tumani', 'Ko‘kdala tumani', 'Qarshi shahri', 'Shahrisabz shahri'
    ],
    'Qoraqalpog‘iston Respublikasi': [
      'Amudaryo tumani', 'Beruniy tumani', 'Chimboy tumani', 'Ellikqala tumani',
      'Kegeyli tumani', 'Mo‘ynoq tumani', 'Nukus tumani', 'Qonliko‘l tumani',
      'Qorao‘zak tumani', 'Qo‘ng‘irot tumani', 'Shumanay tumani', 'Taxtako‘pir tumani',
      'To‘rtko‘l tumani', 'Xo‘jayli tumani', 'Taxiatosh tumani', 'Bo‘zatov tumani', 'Nukus shahri'
    ],
    'Sirdaryo viloyati': [
      'Boyovut tumani', 'Guliston tumani', 'Mirzaobod tumani', 'Oqoltin tumani',
      'Sayhunobod tumani', 'Sardoba tumani', 'Sirdaryo tumani', 'Xovos tumani',
      'Guliston shahri', 'Shirin shahri', 'Yangiyer shahri'
    ],
    'Surxondaryo viloyati': [
      'Angor tumani', 'Bandixon tumani', 'Boysun tumani', 'Denov tumani',
      'Jarqo‘rg‘on tumani', 'Qiziriq tumani', 'Qumqo‘rg‘ontepa tumani', 'Muzrabot tumani',
      'Oltinsoy tumani', 'Sariosiyo tumani', 'Sherobod tumani', 'Sho‘rchi tumani',
      'Termiz tumani', 'Uzun tumani', 'Termiz shahri'
    ],
    'Toshkent viloyati': [
      'Bekobod tumani', 'Bo‘stonliq tumani', 'Bo‘ka tumani', 'Chinoz tumani',
      'Qibray tumani', 'Ohangaron tumani', 'Oqqo‘rg‘on tumani', 'Parkent tumani',
      'Piskent tumani', 'Quyi Chirchiq tumani', 'O‘rta Chirchiq tumani', 'Yuqori Chirchiq tumani',
      'Zangiota tumani', 'Toshkent tumani', 'Yangiyo‘l tumani', 'Bekobod shahri',
      'Olmaliq shahri', 'Angren shahri', 'Chirchiq shahri', 'Nurafshon shahri', 'Yangiyo‘l shahri'
    ],
    'Toshkent shahri': [
      'Bektemir tumani', 'Chilonzor tumani', 'Hamza tumani', 'Miraobod tumani',
      'Mirzo Ulug‘bek tumani', 'Sergeli tumani', 'Shayxontohur tumani', 'Olmazor tumani',
      'Uchtepa tumani', 'Yakkasaroy tumani', 'Yunusobod tumani', 'Yangi Hayot tumani'
    ]
  };

  getCountries(): LocationItem[] {
    return Country.getAllCountries().map(c => ({
      id: c.isoCode,
      name: c.name
    }));
  }

  getStatesOfCountry(countryCode: string): LocationItem[] {
    if (countryCode === 'UZ') {
      return Object.keys(this.uzLocations).map(name => ({
        id: name,
        name: name
      }));
    }

    return State.getStatesOfCountry(countryCode).map(s => ({
      id: s.isoCode,
      name: s.name
    }));
  }

  getCitiesOfState(countryCode: string, stateCode: string): LocationItem[] {
    if (countryCode === 'UZ' && this.uzLocations[stateCode]) {
      return this.uzLocations[stateCode].map(name => ({
        id: name,
        name: name
      }));
    }

    return City.getCitiesOfState(countryCode, stateCode).map(c => ({
      id: c.name,
      name: c.name
    }));
  }
}
