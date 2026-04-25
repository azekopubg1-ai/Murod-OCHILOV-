import { Injectable, signal } from '@angular/core';
import { auth, db } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  setDoc,
  doc, 
  query, 
  orderBy, 
  where,
  FirestoreError,
  deleteDoc
} from 'firebase/firestore';

export interface Booking {
  id?: string;
  userId: string;
  roomId: string; // Requested room type/id
  assignedRoomId?: string; // Actual room assigned by admin
  roomType: string | Record<string, string>;
  name: string;
  people?: {
    name: string;
    age: number;
    passport: string;
    gender?: 'male' | 'female';
  }[];
  phone: string;
  telegram: string;
  region: string | Record<string, string>;
  district: string | Record<string, string>;
  mahalla: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'active' | 'archive' | 'rejected';
  createdAt: string;
}

export interface PublicBooking {
  id?: string;
  userId: string;
  roomId: string;
  roomType: string | Record<string, string>;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'active' | 'archive' | 'rejected';
  peopleCount: number;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  allBookings = signal<Booking[]>([]);
  userBookings = signal<Booking[]>([]);
  publicBookings = signal<PublicBooking[]>([]);
  
  private allUnsubscribe?: () => void;
  private userUnsubscribe?: () => void;
  private publicUnsubscribe?: () => void;
  private currentUserId: string | null = null;

  constructor() {
    this.listenToPublicBookings();
  }

  listenToPublicBookings() {
    if (this.publicUnsubscribe) return;
    const q = query(collection(db, 'public_bookings'));
    this.publicUnsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublicBooking));
      this.publicBookings.set(bookings);
    }, (error) => {
      console.error('Public bookings listener error:', error);
    });
  }

  private handleFirestoreError(error: FirestoreError, operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write', path: string | null) {
    const errInfo = {
      error: error.message || String(error),
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName,
          email: p.email,
          photoUrl: p.photoURL
        })) || []
      }
    };
    console.error('Firestore Error:', JSON.stringify(errInfo));
    // We don't throw here to avoid crashing the app, but we log it as requested
  }

  listenToAllBookings() {
    if (this.allUnsubscribe) return this.allUnsubscribe;

    // All bookings for admin
    const allQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    this.allUnsubscribe = onSnapshot(allQ, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      this.allBookings.set(bookings);
    }, (error: FirestoreError) => {
      if (error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'list', 'bookings');
      } else {
        console.error('All bookings listener error:', error);
      }
    });
    return this.allUnsubscribe;
  }

  stopAllListener() {
    if (this.allUnsubscribe) {
      this.allUnsubscribe();
      this.allUnsubscribe = undefined;
    }
  }

  listenToUserBookings(userId: string) {
    if (this.currentUserId === userId && this.userUnsubscribe) return this.userUnsubscribe;
    
    this.stopUserListener();
    this.currentUserId = userId;

    const userQ = query(
      collection(db, 'bookings'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    this.userUnsubscribe = onSnapshot(userQ, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      this.userBookings.set(bookings);
    }, (error: FirestoreError) => {
      if (error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'list', 'bookings');
      } else {
        console.error('User bookings listener error:', error);
      }
    });
    return this.userUnsubscribe;
  }

  stopUserListener() {
    if (this.userUnsubscribe) {
      this.userUnsubscribe();
      this.userUnsubscribe = undefined;
    }
    this.currentUserId = null;
    this.userBookings.set([]);
  }

  async createBooking(booking: Booking) {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), booking);
      // Sync to public
      await setDoc(doc(db, 'public_bookings', docRef.id), {
        userId: booking.userId,
        roomId: booking.roomId,
        roomType: booking.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: booking.status,
        peopleCount: booking.people?.length || 1
      });
    } catch (error: unknown) {
      if (error instanceof FirestoreError && error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'create', 'bookings');
      }
      throw error;
    }
  }

  async updateBookingStatus(id: string, status: Booking['status'], assignedRoomId?: string) {
    try {
      const update: { status: Booking['status']; assignedRoomId?: string } = { status };
      if (assignedRoomId) update.assignedRoomId = assignedRoomId;
      await updateDoc(doc(db, 'bookings', id), update);
      // Sync to public
      await setDoc(doc(db, 'public_bookings', id), { status }, { merge: true });
    } catch (error: unknown) {
      if (error instanceof FirestoreError && error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'update', `bookings/${id}`);
      }
      throw error;
    }
  }

  async updateBooking(id: string, data: Partial<Booking>) {
    try {
      await updateDoc(doc(db, 'bookings', id), data);
      // Sync to public
      const publicUpdate: Record<string, unknown> = {};
      if (data.checkIn) publicUpdate['checkIn'] = data.checkIn;
      if (data.checkOut) publicUpdate['checkOut'] = data.checkOut;
      if (data.status) publicUpdate['status'] = data.status;
      if (data.roomType) publicUpdate['roomType'] = data.roomType;
      if (data.people) publicUpdate['peopleCount'] = data.people.length;
      if (Object.keys(publicUpdate).length > 0) {
        await setDoc(doc(db, 'public_bookings', id), publicUpdate, { merge: true });
      }
    } catch (error: unknown) {
      if (error instanceof FirestoreError && error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'update', `bookings/${id}`);
      }
      throw error;
    }
  }

  async deleteBooking(id: string) {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      await deleteDoc(doc(db, 'public_bookings', id));
    } catch (error: unknown) {
      if (error instanceof FirestoreError && error.message.includes('permissions')) {
        this.handleFirestoreError(error, 'delete', `bookings/${id}`);
      }
      throw error;
    }
  }

  async clearOldBookings(type: 'rejected' | 'archive' | 'all_old') {
    try {
      const bookingsToDelete = this.allBookings().filter(b => {
        if (type === 'rejected') return b.status === 'rejected';
        if (type === 'archive') return b.status === 'archive';
        return b.status === 'rejected' || b.status === 'archive';
      });

      for (const b of bookingsToDelete) {
        if (b.id) await this.deleteBooking(b.id);
      }
      return bookingsToDelete.length;
    } catch (error) {
      console.error('Clear old bookings error:', error);
      throw error;
    }
  }

  async syncPublicBookings() {
    try {
      const all = this.allBookings();
      for (const b of all) {
        if (b.id) {
          await setDoc(doc(db, 'public_bookings', b.id), {
            userId: b.userId,
            roomId: b.roomId,
            roomType: b.roomType,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: b.status,
            peopleCount: b.people?.length || 1
          });
        }
      }
      return all.length;
    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    }
  }

  async cleanupOldBookings() {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoIso = oneMonthAgo.toISOString();

      // Find archived and rejected bookings older than 1 month
      const oldBookings = this.allBookings().filter(b => 
        (b.status === 'archive' || b.status === 'rejected') && 
        b.createdAt < oneMonthAgoIso
      );

      for (const booking of oldBookings) {
        if (booking.id) {
          await deleteDoc(doc(db, 'bookings', booking.id));
        }
      }
      console.log(`Cleaned up ${oldBookings.length} old bookings.`);
    } catch (error: unknown) {
      console.error('Cleanup error:', error);
    }
  }
}
