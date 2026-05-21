// src/components/ImageUploader.jsx
import { useState, useRef } from 'react';
import { validateImageFile, MAX_FILES } from '../utils/imageUtils';

export default function ImageUploader({ files, onChange }) {
  const inputRef = useRef();
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFiles = (newFiles) => {
    setError('');
    const merged = [...files];
    let err = '';

    for (const f of newFiles) {
      if (merged.length >= MAX_FILES) {
        err = `Puoi caricare al massimo ${MAX_FILES} foto.`;
        break;
      }
      const validErr = validateImageFile(f);
      if (validErr) { err = validErr; break; }
      merged.push(f);
    }

    if (err) setError(err);
    else onChange(merged);
  };

  const remove = (i) => {
    const next = files.filter((_, idx) => idx !== i);
    onChange(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const previews = files.map(f => URL.createObjectURL(f));

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8
          flex flex-col items-center gap-3 transition-all duration-200
          ${dragging
            ? 'border-sage-500 bg-sage-500/10'
            : 'border-white/10 hover:border-white/25 hover:bg-white/3'
          }
        `}
      >
        <span className="text-3xl">📷</span>
        <div className="text-center">
          <p className="text-sm text-gray-300 font-medium">
            Trascina le foto o <span className="text-sage-400">sfoglia</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            JPG, PNG, WebP — max 10MB ciascuna — fino a {MAX_FILES} foto
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      </div>

      {/* Errore */}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1.5">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Preview griglia */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
              <img src={src} alt={`preview ${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100
                           transition-opacity flex items-center justify-center text-white text-xl"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute top-1 left-1 badge bg-sage-500/80 text-white text-[10px]">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
