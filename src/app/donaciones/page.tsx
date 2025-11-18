"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function DonacionesPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const donate = async () => {
    if (!amount || amount <= 0) {
      alert("Selecciona o ingresa un monto válido");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/donaciones/create-preference", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (error) {
      alert("Error al procesar la donación");
    } finally {
      setLoading(false);
    }
  };

  // Botones de montos predefinidos
  const presetAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-gray-800 flex flex-col">
      {/* HERO */}
      <div className="relative w-full h-[330px] md:h-[400px] overflow-hidden rounded-b-[40px]">
        <Image
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&q=80"
          alt="Animalito"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg"
          >
            Dona y Cambia Vidas ❤️
          </motion.h1>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="flex-1 px-6 py-14 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[18px] md:text-[20px] text-gray-700 mb-10"
        >
          Tu donación ayuda a rescatar, cuidar y encontrar un hogar para cientos
          de animalitos en Morelia.
        </motion.p>

        {/* BOTONES DE MONTOS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {presetAmounts.map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className={`px-6 py-3 rounded-2xl border transition-all ${
                amount === value
                  ? "bg-[#9B2C45] text-white border-[#9B2C45] shadow-md scale-105"
                  : "bg-white text-[#9B2C45] border-[#9B2C45] hover:bg-[#fef1f4]"
              }`}
            >
              ${value}
            </button>
          ))}
        </div>

        {/* OTRO MONTO */}
        <input
          type="number"
          placeholder="Otro monto"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border border-[#C8A7A9] px-4 py-3 rounded-xl w-48 text-center mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B2C45]"
        />

        {/* BOTÓN DONAR */}
        <button
          onClick={donate}
          disabled={loading}
          className="px-10 py-4 rounded-2xl bg-[#9B2C45] text-white font-semibold text-lg shadow-lg hover:bg-[#812034] transition disabled:bg-gray-400"
        >
          {loading ? "Procesando..." : "Donar ahora ❤️"}
        </button>
      </section>
    </div>
  );
}
