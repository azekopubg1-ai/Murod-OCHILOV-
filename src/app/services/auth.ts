import { Injectable, signal, inject } from '@angular/core';
import { auth, db } from '../../firebase';
import { 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
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
            // Check admins collection by email
            const q = query(
              collection(db, 'admins'), 
              where('email', '==', user.email),
              limit(1)
            );
            const adminSnapshot = await getDocs(q);
            
            if (!adminSnapshot.empty) {
              const adminData = adminSnapshot.docs[0].data();
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

  async login(providerType: 'google' | 'apple' = 'google') {
    this.isLoggingIn.set(true);
    let provider;
    
    if (providerType === 'apple') {
      provider = new OAuthProvider('apple.com');
      // Apple specific scopes if needed
      provider.addScope('email');
      provider.addScope('name');
    } else {
      provider = new GoogleAuthProvider();
    }

    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/unauthorized-domain') {
        alert('Xatolik: Ushbu domen Firebase-da ruxsat etilmagan. Iltimos, Firebase Console-da "Authorized domains" ro\'yxatiga ushbu domenni qo\'shing.');
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        alert('Xatolik: Ushbu kirish usuli (Apple/Google) Firebase Console-da yoqilmagan.');
      } else {
        alert('Kirishda xatolik yuz berdi: ' + (firebaseError.message || 'Noma’lum xatolik'));
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
