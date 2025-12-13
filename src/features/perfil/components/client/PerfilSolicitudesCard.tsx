import { Card } from "@/components/ui/card";
import type { SolicitudAdopcionMin } from "@/features/perfil/types/perfil";

export default function PerfilSolicitudesCard({
  solicitudes,
}: {
  solicitudes: SolicitudAdopcionMin[];
}) {
  return (
    <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
      <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
        Mascotas en proceso de adopción
      </h2>

      {solicitudes.length === 0 ? (
        <p className="text-[#5b3e26]">No tienes solicitudes pendientes.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {solicitudes.map((sol) => (
            <li
              key={sol.id}
              className="bg-[#fffaf3] border border-[#e2cbb3] rounded-xl p-4"
            >
              <p className="font-semibold text-[#8b4513]">
                {sol.mascota?.nombre ?? "Mascota"}
              </p>
              <p className="text-sm text-[#9b7b59]">
                Solicitud #{sol.numero_solicitud}
              </p>
              <span className="mt-2 inline-block bg-[#f7e8d0] text-[#8b4513] text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {sol.estado}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
