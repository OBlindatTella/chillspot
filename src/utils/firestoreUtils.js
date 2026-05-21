// src/utils/firestoreUtils.js
// Funzioni CRUD per Firestore

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── SPOTS ──────────────────────────────────────────────────────────────────

/**
 * Crea un nuovo spot
 */
export async function createSpot(data, userId, anonymousName) {
  const ref = await addDoc(collection(db, 'spots'), {
    ...data,
    createdBy: userId,
    createdByName: anonymousName,
    createdAt: serverTimestamp(),
    likesCount: 0,
    savedCount: 0,
    reportCount: 0,
    status: 'active',
    likedBy: [],
  });

  // Incrementa contatore spot utente
  await updateDoc(doc(db, 'users', userId), { totalSpots: increment(1) });

  return ref.id;
}

/**
 * Recupera uno spot per ID
 */
export async function getSpot(spotId) {
  const snap = await getDoc(doc(db, 'spots', spotId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Recupera spot con filtri
 */
export async function getSpots({ category, orderField = 'createdAt', limitN = 20 } = {}) {
  // Query semplice senza indici compositi
  const q = query(
    collection(db, 'spots'),
    orderBy(orderField, 'desc'),
    limit(limitN)
  );
  const snap = await getDocs(q);
  // Filtra lato client
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(s => s.status === 'active')
    .filter(s => !category || s.category === category);
}

/**
 * Recupera gli spot di un utente
 */
export async function getUserSpots(userId) {
  const q = query(
    collection(db, 'spots'),
    where('createdBy', '==', userId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Recupera spot salvati da un array di ID
 */
export async function getSavedSpots(spotIds) {
  if (!spotIds?.length) return [];
  const results = await Promise.all(spotIds.map(id => getSpot(id)));
  return results.filter(Boolean).filter(s => s.status === 'active');
}

// ── LIKE ───────────────────────────────────────────────────────────────────

export async function toggleLike(spotId, userId, isLiked) {
  const ref = doc(db, 'spots', spotId);
  if (isLiked) {
    await updateDoc(ref, {
      likesCount: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(ref, {
      likesCount: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
}

// ── SAVE ───────────────────────────────────────────────────────────────────

export async function toggleSave(spotId, userId, isSaved) {
  const userRef = doc(db, 'users', userId);
  const spotRef = doc(db, 'spots', spotId);

  if (isSaved) {
    await updateDoc(userRef, { savedSpots: arrayRemove(spotId) });
    await updateDoc(spotRef, { savedCount: increment(-1) });
  } else {
    await updateDoc(userRef, { savedSpots: arrayUnion(spotId) });
    await updateDoc(spotRef, { savedCount: increment(1) });
  }
}

// ── REPORT ─────────────────────────────────────────────────────────────────

export async function reportSpot(spotId, userId, reason) {
  await addDoc(collection(db, 'reports'), {
    spotId,
    userId,
    reason,
    createdAt: serverTimestamp(),
  });

  const spotRef = doc(db, 'spots', spotId);
  const snap = await getDoc(spotRef);
  if (snap.exists()) {
    const count = (snap.data().reportCount || 0) + 1;
    const update = { reportCount: increment(1) };
    // Auto-hide se >5 segnalazioni
    if (count >= 5) update.status = 'reported';
    await updateDoc(spotRef, update);
  }
}

// ── COMMENTS ───────────────────────────────────────────────────────────────

export async function addComment(spotId, userId, anonymousName, text) {
  return addDoc(collection(db, 'comments'), {
    spotId,
    userId,
    anonymousName,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function getComments(spotId) {
  const q = query(
    collection(db, 'comments'),
    where('spotId', '==', spotId),
    orderBy('createdAt', 'asc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── RANDOM SPOT ─────────────────────────────────────────────────────────────

export async function getRandomSpot() {
  const snap = await getDocs(
    query(collection(db, 'spots'), where('status', '==', 'active'), limit(50))
  );
  const docs = snap.docs;
  if (!docs.length) return null;
  const rand = docs[Math.floor(Math.random() * docs.length)];
  return { id: rand.id, ...rand.data() };
}
