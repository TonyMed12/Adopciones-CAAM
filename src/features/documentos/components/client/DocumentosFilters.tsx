"use client";

interface DocumentosFiltersProps {
  filtro: string;
  onChange: (f: string) => void;
}

export default function DocumentosFilters({ filtro, onChange }: DocumentosFiltersProps) {
  const filtros = ["todos", "pendiente", "aprobado", "rechazado"];

  return (
    <div className="w-full overflow-x-auto no-scrollbar mt-4">
      <div className="flex gap-3 min-w-max border-b border-[#eadacb] pb-1">
        {filtros.map((estado) => (
          <button
            key={estado}
            onClick={() => onChange(estado)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${
              filtro === estado
                ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
            }`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
