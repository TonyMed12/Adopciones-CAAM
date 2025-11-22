import { Button } from "@/components/ui/Button";
import { CalendarDays, Trash2 } from "lucide-react";

export default function CitaCard({
  cita,
  onDelete,
}: {
  cita: any;
  onDelete: (id: string) => void;
}) {
  const { id, motivo, fecha_solicitada, fecha_confirmada, estado, mascota } =
    cita;

  const getEstadoColor = () => {
    switch (estado) {
      case "confirmada":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelada":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <div className="border rounded-2xl shadow-sm p-4 bg-white flex flex-col space-y-3 transition hover:shadow-md">
      {/* Imagen y nombre mascota */}
      <div className="flex items-center space-x-3">
        {mascota?.foto_url ? (
          <img
            src={mascota.foto_url}
            alt={mascota.nombre}
            className="w-16 h-16 object-cover rounded-xl"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-xl" />
        )}
        <div>
          <h2 className="text-lg font-semibold">
            {mascota?.nombre || "Mascota"}
          </h2>
          <p
            className={`text-sm font-medium inline-block px-2 py-1 rounded-lg border ${getEstadoColor()}`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </p>
        </div>
      </div>

      {/* Información cita */}
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <span>
            Fecha solicitada:{" "}
            <strong>{new Date(fecha_solicitada).toLocaleDateString()}</strong>
          </span>
        </p>
        {fecha_confirmada && (
          <p className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>
              Confirmada para:{" "}
              <strong>{new Date(fecha_confirmada).toLocaleDateString()}</strong>
            </span>
          </p>
        )}
        <p>
          Motivo: <span className="italic">{motivo}</span>
        </p>
      </div>

      {/* Botón eliminar */}
      {estado !== "confirmada" && (
        <Button
          variant="primary"
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-4 h-4" /> Cancelar cita
        </Button>
      )}
    </div>
  );
}
