import { Injectable, signal } from '@angular/core';
import { db } from '../../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  telegram: string;
  instagram: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  contactInfo = signal<ContactInfo>({
    phone: '+998 90 123 45 67',
    email: 'info@murodocilov.uz',
    address: 'Namangan viloyati, Chortoq tumani',
    telegram: '@murodocilov_sanatoriya',
    instagram: '@murodocilov_sanatoriya'
  });

  constructor() {
    onSnapshot(doc(db, 'settings', 'contact'), (snapshot) => {
      if (snapshot.exists()) {
        this.contactInfo.set(snapshot.data() as ContactInfo);
      }
    }, (error) => {
      console.error('Settings listener error:', error);
    });
  }

  async updateContactInfo(info: ContactInfo) {
    await setDoc(doc(db, 'settings', 'contact'), info);
  }
}
