"use client";

import React from "react";

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function MascotaSeleccionadaCard({
  mascota,
  onCancelar,
}: {
  mascota: any;
  onCancelar: () => void;
}) {
  return (
    <div className="w-full text-center">
      {/* Foto */}
      <div className="flex justify-center mb-4">
        <img
          src={mascota?.imagen_url || "/img/placeholder-mascota.jpg"}
          alt={capitalize(mascota?.nombre)}
          className="h-24 w-24 rounded-full object-cover border border-[#eadacb] shadow-md bg-[#f7eee4]"
        />
      </div>

      {/* Nombre */}
      <h3 className="text-xl font-extrabold text-[#2b1b12]">
        {capitalize(mascota?.nombre)}
      </h3>

      <p className="text-sm text-[#BC5F36] mt-1 mb-3">
        Mascota seleccionada para adopción 🐾
      </p>

      {/* Chips */}
      <div className="flex justify-center flex-wrap gap-2 mb-5">
        {mascota?.raza?.nombre && (
          <span className="px-3 py-1 bg-[#f3e7dc] text-[#8b4513] rounded-full text-xs font-semibold">
            {capitalize(mascota.raza.nombre)}
          </span>
        )}

        {mascota?.tamano && (
          <span className="px-3 py-1 bg-[#fff4e7] text-[#BC5F36] rounded-full text-xs font-semibold">
            {capitalize(mascota.tamano)}
          </span>
        )}

        {mascota?.edad && (
          <span className="px-3 py-1 bg-[#e7f0ff] text-[#1e40af] rounded-full text-xs font-semibold">
            {mascota.edad} meses
          </span>
        )}
      </div>

      {/* Info */}
      <div className="text-left text-[13px] text-[#7a5c49] space-y-2 mb-6">
        {mascota?.personalidad && (
          <p>
            <strong className="text-[#2b1b12]">Personalidad:</strong>{" "}
            {capitalize(mascota.personalidad)}
          </p>
        )}

        {mascota?.peso_kg && (
          <p>
            <strong className="text-[#2b1b12]">Peso:</strong> {mascota.peso_kg}{" "}
            kg
          </p>
        )}

        {mascota?.altura_cm && (
          <p>
            <strong className="text-[#2b1b12]">Altura:</strong>{" "}
            {mascota.altura_cm} cm
          </p>
        )}

        {mascota?.descripcion_fisica && (
          <p>
            <strong className="text-[#2b1b12]">Descripción:</strong>{" "}
            {capitalize(mascota.descripcion_fisica)}
          </p>
        )}
      </div>

      {/* ⭐ NUEVA SECCIÓN PARA LLENAR ESPACIO (elegante y útil) */}
      <div className="mt-6 mb-8 bg-[#fff8f3] border border-[#efd8c7] rounded-xl p-4 text-left shadow-sm">
        <p className="text-sm font-extrabold text-[#2b1b12] mb-2">
          Sobre esta mascota
        </p>

        <ul className="text-[12px] text-[#7a5c49] space-y-1 leading-relaxed">
          <li>• Ha sido evaluada y está apta para convivir contigo.</li>
          <li>• El equipo del CAAM verificó su salud y comportamiento.</li>
          <li>• Lista para avanzar al siguiente paso de adopción.</li>
        </ul>
      </div>

      {/* BOTÓN MEJORADO con animación */}
      <button
        onClick={onCancelar}
        className="
          w-full text-sm font-semibold text-white
          bg-[#BC5F36] px-5 py-3 rounded-xl
          border border-[#a64f2b]
          shadow-md shadow-[#bc5f36]/30
          transition-all duration-200
          hover:bg-[#a64f2b]
          hover:shadow-lg hover:shadow-[#bc5f36]/50
          hover:-translate-y-[2px]
          active:scale-95
        "
      >
        Cancelar solicitud
      </button>
    </div>
  );
}
