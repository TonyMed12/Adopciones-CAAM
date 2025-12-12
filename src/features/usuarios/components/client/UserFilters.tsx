"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function UserFilters({
  searchTerm,
  onSearchChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md rounded-2xl border border-[#EADACB] bg-white px-3 py-2">
        <Search className="h-4 w-4 text-[#8B6F5D]" />
        <input
          placeholder="Buscar usuario..."
          className="flex-1 bg-transparent text-sm focus:outline-none text-[#2B1B12]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtros (placeholder visual) */}
      <button
        type="button"
        className="flex items-center gap-1 border border-[#EADACB] rounded-2xl bg-[#FFF9F3] px-3 py-2 text-sm text-[#BC5F36] font-semibold"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>
    </div>
  );
}
