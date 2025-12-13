import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import type { Direccion } from "@/features/perfil/types/perfil";

export default function PerfilDireccionCard({
  direccion,
  onEdit,
}: {
  direccion: Direccion | null;
  onEdit: () => void;
}) {
  return (
    <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#8b4513]">
          Dirección principal
        </h2>
        <Button
          onClick={onEdit}
          className="bg-[#8b4513] hover:bg-[#7a3f11]"
        >
          {direccion ? "Editar" : "Agregar"}
        </Button>
      </div>

      {direccion ? (
        <div className="text-[#5b3e26] space-y-1">
          <p>
            {direccion.calle} {direccion.numero_exterior}
            {direccion.numero_interior
              ? `, Int. ${direccion.numero_interior}`
              : ""}
            , {direccion.colonia}
          </p>
          <p>
            {direccion.municipio}, {direccion.estado}, CP{" "}
            {direccion.codigo_postal}
          </p>
          <p>México</p>
        </div>
      ) : (
        <p>No tienes dirección principal registrada.</p>
      )}
    </Card>
  );
}
