"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CitaForm({
  mascota,
  onSubmit,
  onClose,
}: {
  mascota: any;
  onSubmit: (data: { motivo: string; fecha_cita: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    motivo: "",
    fecha_cita: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.motivo || !form.fecha_cita) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto">
      {/* 🐾 Sección de información de la mascota */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 flex flex-col items-center text-center border-b">
        <img
          src={mascota.imagen_url}
          alt={mascota.mascota_nombre}
          className="w-32 h-32 object-cover rounded-full shadow-md border border-orange-200 mb-3"
        />
        <h2 className="text-2xl font-semibold text-orange-800">
          {mascota.mascota_nombre}
        </h2>
        <p className="text-sm text-gray-600 mt-1">Agendar cita veterinaria</p>
      </div>

      {/* 📋 Sección del formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha tentativa
          </label>
          <input
            type="datetime-local"
            name="fecha_cita"
            value={form.fecha_cita}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de la cita
          </label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            placeholder="Describe brevemente el motivo..."
            className="w-full border rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
          />
        </div>

        {/* Barra inferior con botones */}
        <div className="flex justify-end gap-3 border-t pt-4 bg-gray-50 rounded-b-2xl">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
          >
            Agendar cita
          </Button>
        </div>
      </form>
    </div>
  );
}
