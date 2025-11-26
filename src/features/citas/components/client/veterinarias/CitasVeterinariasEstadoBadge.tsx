"use client";

export function CitasVeterinariasEstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    aprobada: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[estado]}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}
