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
  mapUrl: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  contactInfo = signal<ContactInfo>({
    phone: '+998 90 123 45 67',
    email: 'info@murodocilov.uz',
    address: 'Namangan viloyati, Chortoq tumani',
    telegram: '@murodocilov_sanatoriya',
    instagram: '@murodocilov_sanatoriya',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.3456789!2d71.6!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiA3McKwMzYnMDAuMCJF!5e0!3m2!1sen!2suz!4v1234567890'
  });

  constructor() {
    onSnapshot(doc(db, 'settings', 'contact'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        this.contactInfo.update(current => ({
          ...current,
          ...data,
          mapUrl: data['mapUrl'] || current.mapUrl
        }));
      }
    }, (error) => {
      console.error('Settings listener error:', error);
    });
  }

  async updateContactInfo(info: ContactInfo) {
    await setDoc(doc(db, 'settings', 'contact'), info);
  }
}
