import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Claim, ClaimStatus } from '../types';
import toast from 'react-hot-toast';

export function useClaims(itemId: string | undefined) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'claims'),
      where('itemId', '==', itemId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setClaims(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        })) as Claim[]
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [itemId]);

  return { claims, loading };
}

export function useUserClaims(userId: string | undefined) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'claims'),
      where('claimerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setClaims(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        })) as Claim[]
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { claims, loading };
}

export function useClaimActions() {
  const [submitting, setSubmitting] = useState(false);

  const submitClaim = useCallback(
    async (
      itemId: string,
      claimerId: string,
      claimerName: string,
      claimerEmail: string,
      message: string
    ) => {
      setSubmitting(true);
      try {
        await addDoc(collection(db, 'claims'), {
          itemId,
          claimerId,
          claimerName,
          claimerEmail,
          message,
          status: 'pending' as ClaimStatus,
          createdAt: serverTimestamp(),
        });

        // Increment claimCount on the item
        await updateDoc(doc(db, 'items', itemId), {
          claimCount: increment(1),
        });

        toast.success('Claim submitted! The finder will contact you.');
      } catch {
        toast.error('Failed to submit claim. Please try again.');
        throw new Error('Claim submission failed');
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const updateClaimStatus = useCallback(async (claimId: string, status: ClaimStatus) => {
    await updateDoc(doc(db, 'claims', claimId), { status });
    toast.success(`Claim ${status}.`);
  }, []);

  return { submitClaim, updateClaimStatus, submitting };
}
