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
  uid: string;
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
        uid: doc.id,
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

  async addAdmin(admin: AdminUser) {
    await setDoc(doc(db, 'admins', admin.uid), {
      email: admin.email,
      permissions: admin.permissions,
      createdAt: admin.createdAt
    });
  }

  async removeAdmin(uid: string) {
    await deleteDoc(doc(db, 'admins', uid));
  }

  async updatePermissions(uid: string, permissions: string[]) {
    await setDoc(doc(db, 'admins', uid), { permissions }, { merge: true });
  }
}
