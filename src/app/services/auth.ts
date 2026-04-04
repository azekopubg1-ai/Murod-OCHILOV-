import { Injectable, signal, inject } from '@angular/core';
import { auth, db } from '../../firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  user = signal<User | null>(null);
  isAdmin = signal<boolean>(false);
  permissions = signal<string[]>([]);
  isAuthReady = signal<boolean>(false);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.user.set(user);
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            this.isAdmin.set(true);
            this.permissions.set(adminDoc.data()['permissions'] || ['all']);
          } else if (user.email === 'shovqiddin45@gmail.com') {
            this.isAdmin.set(true);
            this.permissions.set(['all']);
          } else {
            this.isAdmin.set(false);
            this.permissions.set([]);
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

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
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
