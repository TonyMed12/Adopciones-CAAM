"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import type { Direccion } from "@/features/perfil/types/perfil";

const ESTADOS_MEXICO = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche",
  "Coahuila","Colima","Chiapas","Chihuahua","Ciudad de México","Durango",
  "Guanajuato","Guerrero","Hidalgo","Jalisco","México","Michoacán",
  "Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
  "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco",
  "Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas",
];

export default function ModalEditarDireccion({
  open,
  onClose,
  formDir,
  errors,
  onChange,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  formDir: Partial<Direccion>;
  errors?: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Dirección principal">
      <div className="space-y-3">
        <div>
          <Label>Calle</Label>
          <Input name="calle" value={formDir.calle ?? ""} onChange={onChange} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            name="numero_exterior"
            placeholder="Número"
            value={formDir.numero_exterior ?? ""}
            onChange={onChange}
          />
          <Input
            name="colonia"
            placeholder="Colonia"
            value={formDir.colonia ?? ""}
            onChange={onChange}
          />
        </div>

        <Input
          name="municipio"
          placeholder="Municipio"
          value={formDir.municipio ?? ""}
          onChange={onChange}
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            name="estado"
            value={formDir.estado ?? ""}
            onChange={onChange}
            className="border rounded-md p-2"
          >
            <option value="">Estado</option>
            {ESTADOS_MEXICO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <Input
            name="codigo_postal"
            placeholder="Código Postal"
            value={formDir.codigo_postal ?? ""}
            onChange={onChange}
          />
        </div>

        <Input value="México" disabled />

        <div className="flex justify-end mt-4">
          <Button
            onClick={onSave}
            disabled={!!errors && Object.keys(errors).length > 0}
            className="bg-[#8b4513]"
          >
            Guardar dirección
          </Button>
        </div>
      </div>
    </Modal>
  );
}
