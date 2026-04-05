import { Injectable, signal } from '@angular/core';
import { db } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  doc,
  query,
  Unsubscribe
} from 'firebase/firestore';

export interface AdminUser {
  id?: string;
  email: string;
  permissions: string[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  admins = signal<AdminUser[]>([]);
  private unsubscribe: Unsubscribe | null = null;

  listenToAdmins() {
    if (this.unsubscribe) return;
    
    const q = query(collection(db, 'admins'));
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const admins = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AdminUser));
      this.admins.set(admins);
    });
  }

  stopListener() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  async addAdmin(admin: Partial<AdminUser>) {
    if (!admin.email) return;
    // Use email as doc id, replacing characters that might be problematic if needed
    // but Firestore allows @ and .
    await setDoc(doc(db, 'admins', admin.email), {
      email: admin.email,
      permissions: admin.permissions || ['all'],
      createdAt: admin.createdAt || new Date().toISOString()
    });
  }

  async removeAdmin(email: string) {
    await deleteDoc(doc(db, 'admins', email));
  }

  async updatePermissions(email: string, permissions: string[]) {
    await setDoc(doc(db, 'admins', email), { permissions }, { merge: true });
  }
}
