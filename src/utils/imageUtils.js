// src/utils/imageUtils.js
// Gestione upload e compressione immagini

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { storage } from '../firebase';

const MAX_SIZE_MB = 2;
const MAX_WIDTH_PX = 1920;
const MAX_FILES = 5;

/**
 * Valida un file immagine
 */
export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(file.type)) {
    return 'Formato non supportato. Usa JPG, PNG o WebP.';
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'File troppo grande. Massimo 10MB.';
  }
  return null;
}

/**
 * Comprime un'immagine prima dell'upload
 */
async function compressImage(file) {
  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_PX,
    useWebWorker: true,
    fileType: 'image/webp',
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file; // fallback: usa il file originale
  }
}

/**
 * Carica un'immagine su Firebase Storage
 * Ritorna l'URL pubblico
 */
export async function uploadImage(file, userId, spotId) {
  const compressed = await compressImage(file);
  const ext = 'webp';
  const filename = `spots/${userId}/${spotId}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, compressed);
  return getDownloadURL(storageRef);
}

/**
 * Carica multiple immagini e ritorna array di URL
 */
export async function uploadImages(files, userId, spotId) {
  if (files.length > MAX_FILES) {
    throw new Error(`Puoi caricare al massimo ${MAX_FILES} foto.`);
  }
  const urls = await Promise.all(
    Array.from(files).map(f => uploadImage(f, userId, spotId))
  );
  return urls;
}

export { MAX_FILES };
