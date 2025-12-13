import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import type { Perfil } from "@/features/perfil/types/perfil";

export default function PerfilDatosCard({
  perfil,
  onEdit,
}: {
  perfil: Perfil;
  onEdit: () => void;
}) {
  return (
    <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#8b4513]">
          Datos personales
        </h2>
        <Button
          onClick={onEdit}
          className="bg-[#8b4513] hover:bg-[#7a3f11]"
        >
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5b3e26]">
        <Campo label="Nombre" value={perfil.nombres} />
        <Campo label="Apellido Paterno" value={perfil.apellido_paterno} />
        <Campo label="Apellido Materno" value={perfil.apellido_materno ?? "—"} />
        <Campo label="Correo" value={perfil.email} />
        <Campo label="Teléfono" value={perfil.telefono ?? "—"} />
        <Campo label="CURP" value={perfil.curp ?? "—"} />
        <Campo label="Ocupación" value={perfil.ocupacion ?? "—"} />
      </div>
    </Card>
  );
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#9b7b59]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
