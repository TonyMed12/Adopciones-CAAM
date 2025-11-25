"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RazaSchema } from "@/features/mascotas/schemas/razas-schemas";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";

import { useRazasQuery } from "@/features/mascotas/hooks/useRazasQuery";
import { useCrearRaza } from "@/features/mascotas/hooks/useCrearRaza";
import { useEliminarRaza } from "@/features/mascotas/hooks/useEliminarRaza";

export default function GestionRazas({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [tamano, setTamano] = useState("mediano");

  const { data: razas = [], isLoading } = useRazasQuery();
  const createRaza = useCrearRaza();
  const deleteRaza = useEliminarRaza();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const parsed = RazaSchema.parse({
        nombre,
        especie,
        tamano,
        activa: true,
      });

      await createRaza.mutateAsync(parsed);

      toast.success("Raza creada");

      setNombre("");
      setEspecie("Perro");
      setTamano("mediano");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear la raza";

      toast.error(message);
    }
  }

  async function handleDelete(id: string) {
    const confirm = await toastConfirm(
      "¿Seguro que deseas eliminar esta raza?"
    );
    if (!confirm) return;
    deleteRaza.mutate(id);
  }

  function colorPorTamano(t: string) {
    switch (t) {
      case "pequeño":
        return "bg-emerald-100 text-emerald-700";
      case "mediano":
        return "bg-amber-100 text-amber-700";
      case "grande":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Gestionar Razas">
      <div className="space-y-6">
        {/* Formulario */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#fff8f0] border border-amber-200 shadow-sm"
        >
          <div>
            <Label>Nombre</Label>
            <Input
              type="text"
              placeholder="Ej. Labrador"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>Especie</Label>
            <select
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
            >
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <Label>Tamaño</Label>
            <select
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
            >
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 col-span-full">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createRaza.isPending}>
              {createRaza.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>

        {/* Lista de razas */}
        <div className="bg-[#fff8f0] border border-amber-200 rounded-lg p-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm">
              Cargando razas...
            </p>
          ) : razas.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">
              No hay razas registradas.
            </p>
          ) : (
            <div className="grid gap-3">
              {razas.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-semibold text-[#4e3728]">{r.nombre}</p>

                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {r.especie}
                      </span>

                      {r.tamano && (
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${colorPorTamano(
                            r.tamano
                          )}`}
                        >
                          {r.tamano}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleDelete(r.id)}
                    className="text-sm px-3"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
