// src/context/AuthContext.jsx
// Gestisce lo stato di autenticazione globale

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { generateAnonymousName, generateAvatarStyle } from '../utils/anonymousUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Firebase user
  const [profile, setProfile] = useState(null);   // Profilo Firestore
  const [loading, setLoading] = useState(true);

  // Crea o carica il profilo anonimo dell'utente
  const ensureProfile = async (firebaseUser) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    }

    // Primo accesso: crea profilo anonimo
    const newProfile = {
      uid: firebaseUser.uid,
      anonymousName: generateAnonymousName(),
      avatarStyle: generateAvatarStyle(),
      createdAt: serverTimestamp(),
      savedSpots: [],
      totalSpots: 0,
      reputationScore: 0,
    };

    await setDoc(ref, newProfile);
    return newProfile;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const p = await ensureProfile(firebaseUser);
          setProfile(p);
        } catch (err) {
          console.error('Errore caricamento profilo:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  // Login con Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  // Login email/password
  const loginWithEmail = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Registrazione email/password
  const registerWithEmail = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Ricarica il profilo (dopo aggiornamenti)
  const refreshProfile = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setProfile(snap.data());
  };

  const value = {
    user,
    profile,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
