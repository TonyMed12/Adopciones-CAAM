"use client";

import { X } from "lucide-react";

export default function ZoomImageModal({
  image,
  onClose,
}: {
  image: string | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
        >
          <X size={22} className="text-gray-700" />
        </button>

        <img
          src={image}
          className="w-full max-h-[90vh] object-contain rounded-xl border border-white shadow-lg"
        />
      </div>
    </div>
  );
}
