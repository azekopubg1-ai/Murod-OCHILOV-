import { Injectable, signal } from '@angular/core';
import { db } from '../../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export interface Room {
  id?: string;
  type: string;
  price: number;
  images: string[];
  amenities: string[];
  description: string;
  capacity: number;
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
  rooms = signal<Room[]>([]);

  constructor() {
    const q = query(collection(db, 'rooms'), orderBy('price', 'asc'));
    onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
      this.rooms.set(rooms);
    }, (error) => {
      console.error('Rooms listener error:', error);
    });
  }

  async addRoom(room: Room) {
    await addDoc(collection(db, 'rooms'), room);
  }

  async updateRoom(id: string, room: Partial<Room>) {
    await updateDoc(doc(db, 'rooms', id), room);
  }

  async deleteRoom(id: string) {
    await deleteDoc(doc(db, 'rooms', id));
  }
}
