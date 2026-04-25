import { Injectable, signal, inject } from '@angular/core';
import { auth, db } from '../../firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { NotificationService } from './notification';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private ns = inject(NotificationService);
  user = signal<User | null>(null);
  isAdmin = signal<boolean>(false);
  permissions = signal<string[]>([]);
  isAuthReady = signal<boolean>(false);
  isLoggingIn = signal<boolean>(false);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.user.set(user);
      if (user) {
        try {
          // First check super admin
          if (user.email === 'shovqiddin45@gmail.com') {
            this.isAdmin.set(true);
            this.permissions.set(['all']);
          } else {
            // Check admins collection by uid
            const adminDocRef = doc(db, 'admins', user.uid);
            const adminSnapshot = await getDoc(adminDocRef);
            
            if (adminSnapshot.exists()) {
              const adminData = adminSnapshot.data();
              this.isAdmin.set(true);
              this.permissions.set(adminData['permissions'] || ['all']);
            } else {
              this.isAdmin.set(false);
              this.permissions.set([]);
            }
          }
          
          // Auto redirect to admin if admin logs in
          if (this.isAdmin() && this.router.url === '/') {
            this.router.navigate(['/admin']);
          }
        } catch (error) {
          console.error('Admin check error:', error);
          const isSuper = user.email === 'shovqiddin45@gmail.com';
          this.isAdmin.set(isSuper);
          this.permissions.set(isSuper ? ['all'] : []);
        }
      } else {
        this.isAdmin.set(false);
        this.permissions.set([]);
      }
      this.isAuthReady.set(true);
    });
  }

  hasPermission(perm: string): boolean {
    const perms = this.permissions();
    return perms.includes('all') || perms.includes(perm);
  }

  async loginAnonymously() {
    this.isLoggingIn.set(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous login error:', error);
      this.ns.alert('Anonim kirishda xatolik yuz berdi.');
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async login() {
    this.isLoggingIn.set(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/unauthorized-domain') {
        this.ns.alert('Xatolik: Ushbu domen Firebase-da ruxsat etilmagan. Iltimos, Firebase Console-da "Authorized domains" ro\'yxatiga ushbu domenni qo\'shing.');
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        this.ns.alert('Xatolik: Ushbu kirish usuli (Apple/Google) Firebase Console-da yoqilmagan.');
      } else {
        this.ns.alert('Kirishda xatolik yuz berdi: ' + (firebaseError.message || 'Noma’lum xatolik'));
      }
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
