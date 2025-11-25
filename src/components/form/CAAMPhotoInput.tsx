"use client";

import { useRef } from "react";

interface CAAMPhotoInputProps {
  previewUrl?: string | null;
  onSelectFile: (file: File | null) => void;
  className?: string;
}

export function CAAMPhotoInput({
  previewUrl,
  onSelectFile,
  className = "",
}: CAAMPhotoInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onSelectFile(file);
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="rounded-xl w-64 h-64 object-cover shadow-md border border-[#FF8414]/20"
          />

          <button
            type="button"
            className="mt-2 text-sm px-4 py-1.5 rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] transition text-[#8B4513]"
            onClick={() => fileRef.current?.click()}
          >
            Cambiar foto
          </button>

          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleChange} />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-64 h-64 rounded-xl border-2 border-dashed border-[#FF8414]/50 bg-[#fff9f4] text-[#8B4513] hover:border-[#FF8414] transition cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <span className="text-4xl mb-2">🐾</span>
          <p className="text-sm font-medium">Subir foto</p>
          <p className="text-xs opacity-70 mt-1">Haz clic para seleccionar</p>

          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleChange} />
        </div>
      )}
    </div>
  );
}
