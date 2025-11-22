"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RazaSchema } from "@/features/mascotas/schemas/razas-schemas";

type Props = {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
};

export default function FormRaza({ onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [tamano, setTamanoRaza] = useState("mediano");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const parsed = RazaSchema.parse({
        nombre,
        especie,
        tamano,
        activa: true,
      });

      setLoading(true);
      await onSubmit(parsed);
      setNombre("");
      setTamanoRaza("mediano");
      setEspecie("Perro");
    } catch (err: any) {
      setError(err.message || "Error al crear la raza");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-1"
    >
      <div>
        <Label htmlFor="nombre" className="font-medium text-sm">
          Nombre
        </Label>
        <Input
          id="nombre"
          type="text"
          placeholder="Ej. Labrador Retriever"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="especie" className="font-medium text-sm">
          Especie
        </Label>
        <select
          id="especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div>
        <Label htmlFor="tamano_raza" className="font-medium text-sm">
          Tamaño promedio
        </Label>
        <select
          id="tamano_raza"
          value={tamano}
          onChange={(e) => setTamanoRaza(e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
