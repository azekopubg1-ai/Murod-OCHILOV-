import { Injectable, signal } from '@angular/core';
import { db } from '../../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: Record<string, string>;
  mapUrl: string;
  siteName: Record<string, string>;
  siteSubtitle: Record<string, string>;
  footerDescription: Record<string, string>;
  copyright: Record<string, string>;
  footerImages: string[];
  socialLinks: SocialLink[];
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  contactInfo = signal<ContactInfo>({
    phone: '+998 90 123 45 67',
    email: 'info@murodocilov.uz',
    address: {
      UZ: 'Samarqand viloyati, Nurobod tumani, Oltinsoy MFY',
      RU: 'Самаркандская область, Нурободский район, МСГ Олтинсой',
      EN: 'Oltinsoy village, Nurobod district, Samarkand region',
      AR: 'قرية أولتينسوي، منطقة نوروباد، ولاية سمرقند',
      TR: 'Semerkand vilayeti, Nurobod ilçesi, Oltinsoy köyü'
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.3456789!2d71.6!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiA3McKwMzYnMDAuMCJF!5e0!3m2!1sen!2suz!4v1234567890',
    siteName: {
      UZ: 'Murod OCHILOV',
      RU: 'Мурод ОЧИЛОВ',
      EN: 'Murod OCHILOV',
      QQ: 'Murod OCHILOV',
      UZ_KR: 'Мурод ОЧИЛОВ'
    },
    siteSubtitle: {
      UZ: 'Issiq Suv Davolash Sanatoryasi',
      RU: 'Санаторий лечения горячей водой',
      EN: 'Hot Water Treatment Sanatorium',
      QQ: 'Issıq Suw Emleniw Sanatoriyası',
      UZ_KR: 'Иссиқ Сув Даволаш Санаторияси'
    },
    footerDescription: {
      UZ: 'Sanatoriyamizda tabiiy issiq suv bilan davolanish va dam olish uchun barcha sharoitlar yaratilgan. Salomatligingiz biz uchun muhim.',
      RU: 'В нашем санатории созданы все условия для лечения и отдыха с использованием природной горячей воды. Ваше здоровье важно для нас.',
      EN: 'Our sanatorium provides all conditions for treatment and relaxation using natural hot water. Your health is important to us.',
      QQ: 'Sanatoriyamızda tábiyiy ıssı suw menen emleniw hám dem alıw ushın barlıq sharayatlar jaratılǵan. Salomatlıǵıńız biz ushın áhmiyetli.',
      UZ_KR: 'Санаториямизда табиий иссиқ сув билан даволаниш ва дам олиш учун барча шароitлар яратилган. Саломатлигингиз биз учун муҳим.'
    },
    copyright: {
      UZ: '© 2026 Murod OCHILOV Sanatoryasi. Barcha huquqlar himoyalangan.',
      RU: '© 2026 Санаторий Мурод ОЧИЛОВ. Все права защищены.',
      EN: '© 2026 Murod OCHILOV Sanatorium. All rights reserved.',
      QQ: '© 2026 Murod OCHILOV Sanatoriyası. Barlıq huquqlar qorǵalǵan.',
      UZ_KR: '© 2026 Мурод ОЧИЛОВ Санаторияси. Барча ҳуқуқлар ҳимояланган.'
    },
    footerImages: [
      'https://picsum.photos/seed/murod-1/800/600',
      'https://picsum.photos/seed/murod-2/800/600'
    ],
    socialLinks: [
      { platform: 'Telegram', url: 'https://t.me/murodocilov_sanatoriya', icon: 'telegram' },
      { platform: 'Instagram', url: 'https://instagram.com/murodocilov_sanatoriya', icon: 'camera_alt' },
      { platform: 'YouTube', url: 'https://youtube.com/@murodocilov_sanatoriya', icon: 'play_circle' }
    ]
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
