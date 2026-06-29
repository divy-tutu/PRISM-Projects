import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  getDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Item, ItemType, ItemStatus, ItemFilters, Category } from '../types';
import toast from 'react-hot-toast';

export function useItems(filters?: Partial<ItemFilters>, limitCount = 20) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.type) constraints.push(where('type', '==', filters.type));
    if (filters?.category) constraints.push(where('category', '==', filters.category));
    if (filters?.status) constraints.push(where('status', '==', filters.status));
    constraints.push(limit(limitCount));

    const q = query(collection(db, 'items'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        let results = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        })) as Item[];

        if (filters?.search) {
          const term = filters.search.toLowerCase();
          results = results.filter(
            (item) =>
              item.title.toLowerCase().includes(term) ||
              item.description.toLowerCase().includes(term) ||
              item.location.toLowerCase().includes(term)
          );
        }

        if (filters?.location) {
          const loc = filters.location.toLowerCase();
          results = results.filter((item) => item.location.toLowerCase().includes(loc));
        }

        setItems(results);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, [
    filters?.type,
    filters?.category,
    filters?.status,
    filters?.search,
    filters?.location,
    limitCount,
  ]);

  return { items, loading };
}

export function useUserItems(userId: string | undefined) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'items'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        })) as Item[]
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { items, loading };
}

export function useItem(itemId: string | undefined) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'items', itemId), (snap) => {
      if (snap.exists()) {
        setItem({
          id: snap.id,
          ...snap.data(),
          createdAt: snap.data().createdAt?.toDate?.() ?? new Date(),
        } as Item);
      } else {
        setItem(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [itemId]);

  return { item, loading };
}

interface CreateItemPayload {
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location: string;
  date: string;
  imageFile?: File | null;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

export function useItemActions() {
  const [uploading, setUploading] = useState(false);

  const createItem = useCallback(async (payload: CreateItemPayload): Promise<string> => {
    setUploading(true);
    try {
      let imageURL = '';
      if (payload.imageFile) {
        const storageRef = ref(storage, `items/${Date.now()}_${payload.imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, payload.imageFile);
        imageURL = await getDownloadURL(snapshot.ref);
      }

      const docRef = await addDoc(collection(db, 'items'), {
        type: payload.type,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        location: payload.location,
        date: payload.date,
        imageURL,
        status: 'open' as ItemStatus,
        ownerId: payload.ownerId,
        ownerName: payload.ownerName,
        ownerEmail: payload.ownerEmail,
        createdAt: serverTimestamp(),
      });

      toast.success('Item reported successfully!');
      return docRef.id;
    } catch (err) {
      toast.error('Failed to report item. Please try again.');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const updateItem = useCallback(
    async (
      itemId: string,
      updates: Partial<Pick<Item, 'title' | 'description' | 'location' | 'status' | 'category'>>
    ) => {
      await updateDoc(doc(db, 'items', itemId), updates);
      toast.success('Item updated!');
    },
    []
  );

  const deleteItem = useCallback(async (item: Item) => {
    if (item.imageURL) {
      try {
        const imgRef = ref(storage, item.imageURL);
        await deleteObject(imgRef);
      } catch {
        // Image may not exist in storage
      }
    }
    await deleteDoc(doc(db, 'items', item.id));
    toast.success('Item deleted.');
  }, []);

  const markResolved = useCallback(async (itemId: string) => {
    await updateDoc(doc(db, 'items', itemId), { status: 'resolved' as ItemStatus });
    toast.success('Marked as resolved!');
  }, []);

  return { createItem, updateItem, deleteItem, markResolved, uploading };
}

export function useStats() {
  const [stats, setStats] = useState({ lostCount: 0, foundCount: 0, resolvedCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [lostSnap, foundSnap, resolvedSnap] = await Promise.all([
        getDocs(query(collection(db, 'items'), where('type', '==', 'lost'))),
        getDocs(query(collection(db, 'items'), where('type', '==', 'found'))),
        getDocs(query(collection(db, 'items'), where('status', '==', 'resolved'))),
      ]);
      setStats({
        lostCount: lostSnap.size,
        foundCount: foundSnap.size,
        resolvedCount: resolvedSnap.size,
      });
    };
    fetchStats();
  }, []);

  return stats;
}

export async function getItemById(id: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, 'items', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate?.() ?? new Date() } as Item;
}
