"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Error al cambiar la contraseña: " + error.message);
    } else {
      setMensaje(
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Establece una nueva contraseña
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
          required
        />
        <button
          disabled={loading}
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
      {mensaje && <p className="text-green-600 mt-3">{mensaje}</p>}
    </div>
  );
}
