"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { listarRazas, crearRaza, eliminarRaza } from "@/mascotas/razas/razas-actions";
import { RazaSchema } from "@/mascotas/razas/razas-schemas";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";

export default function GestionRazas({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [razas, setRazas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [tamano, setTamano] = useState("mediano");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchRazas() {
    setLoading(true);
    try {
      const data = await listarRazas();
      setRazas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) fetchRazas();
  }, [open]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const parsed = RazaSchema.parse({
        nombre,
        especie,
        tamano,
        activa: true,
      });
      setSaving(true);
      await crearRaza(parsed);
      await fetchRazas();
      setNombre("");
      setEspecie("Perro");
      setTamano("mediano");
    } catch (err: any) {
      toast.error(err.message || "Error al crear la raza");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirm = await toastConfirm("?Seguro que deseas eliminar esta raza?");
    if (!confirm) return;
    await eliminarRaza(id);
    await fetchRazas();
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
        {/* Formulario de creación */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#fff8f0] border border-amber-200 shadow-sm"
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
            <Label htmlFor="tamano" className="font-medium text-sm">
              Tamaño promedio
            </Label>
            <select
              id="tamano"
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm col-span-full text-center mt-1">{error}</p>
          )}

          <div className="flex justify-end gap-3 col-span-full">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>

        {/* Listado de razas */}
        <div className="bg-[#fff8f0] border border-amber-200 rounded-lg p-3 max-h-80 overflow-y-auto">
          {loading ? (
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
                    <p className="font-semibold text-[#4e3728] leading-tight">{r.nombre}</p>
                    <div className="flex gap-2 mt-1">
                      {/* Chip especie */}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          r.especie === "Perro"
                            ? "bg-yellow-100 text-yellow-800"
                            : r.especie === "Gato"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.especie}
                      </span>
                      {/* Chip tamaño con color distinto */}
                      {r.tamano && (
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${colorPorTamano(
                            r.tamano
                          )}`}
                        >
                          {r.tamano.charAt(0).toUpperCase() + r.tamano.slice(1)}
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
