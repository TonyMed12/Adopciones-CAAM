import { Card } from "@/components/ui/card";
import { MascotaCardAdoptada } from "./MascotaCardAdoptada";

export default function PerfilMascotasCard({
  mascotas,
}: {
  mascotas: any[];
}) {
  return (
    <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
      <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
        Mascotas adoptadas
      </h2>

      {mascotas.length === 0 ? (
        <p className="text-[#5b3e26]">Aún no tienes mascotas adoptadas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mascotas.map((m) => (
            <MascotaCardAdoptada key={m.id} mascota={m} />
          ))}
        </div>
      )}
    </Card>
  );
}
