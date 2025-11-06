"use client";
import {useState} from "react";
import {subirFotosEvidencia} from "@/lib/supabase/upload-adopciones";

export type AdoptionPayload = {
    usuarioId: string;
    usuarioNombre: string;
    mascotaId: string;
    mascotaNombre: string;
    experiencia: "nunca" | "poca" | "mucha";
    tipoVivienda: string;
    detalleTipoVivienda?: string;
    espacioDisponible: string;
    detalleEspacio?: string;
    otrasMascotas: "si" | "no";
    detalleOtrasMascotas?: string;
    evidenciaHogarUrls: string[];
    compromisoSeguimiento: boolean;
    compromisoCuidado: boolean;
    observaciones?: string;
};

type Props = {
    defaultValues?: Partial<AdoptionPayload>;
    onSubmit: (payload: AdoptionPayload) => void;
};

export default function AdoptionForm({defaultValues, onSubmit}: Props) {
    const [form, setForm] = useState<AdoptionPayload>({
        usuarioId: defaultValues?.usuarioId || "usr_101",
        usuarioNombre: defaultValues?.usuarioNombre || "Ana López",
        mascotaId: defaultValues?.mascotaId || "masc_77",
        mascotaNombre: defaultValues?.mascotaNombre || "Miel",
        experiencia: defaultValues?.experiencia || "poca",
        tipoVivienda: defaultValues?.tipoVivienda || "casa_propia",
        espacioDisponible: defaultValues?.espacioDisponible || "interior",
        otrasMascotas: defaultValues?.otrasMascotas || "no",
        detalleOtrasMascotas: defaultValues?.detalleOtrasMascotas || "",
        evidenciaHogarUrls: defaultValues?.evidenciaHogarUrls || [],
        compromisoSeguimiento: defaultValues?.compromisoSeguimiento ?? false,
        compromisoCuidado: defaultValues?.compromisoCuidado ?? false,
        observaciones: defaultValues?.observaciones || "",
    });

    const set = (k: keyof AdoptionPayload, v: any) => setForm((prev) => ({...prev, [k]: v}));

    // Archivos seleccionados (aún no subidos)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (selectedFiles.length + files.length > 3) {
            alert("Solo puedes subir hasta 3 fotos.");
            return;
        }
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    // Eliminar un archivo de la selección (opcional, útil para UX)
    const removeSelectedFile = (idx: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ===== VALIDACIONES (las mismas que ya tenías) =====
        if (!form.experiencia) {
            alert("Debes indicar tu experiencia con mascotas.");
            return;
        }
        if (!form.tipoVivienda) {
            alert("Debes seleccionar el tipo de vivienda.");
            return;
        }
        if (form.tipoVivienda === "otro" && !form.detalleTipoVivienda?.trim()) {
            alert("Por favor especifica el tipo de vivienda.");
            return;
        }
        if (!form.espacioDisponible) {
            alert("Debes seleccionar el espacio disponible para la mascota.");
            return;
        }
        if (form.espacioDisponible === "otro" && !form.detalleEspacio?.trim()) {
            alert("Por favor especifica el tipo de espacio disponible.");
            return;
        }
        if (!form.otrasMascotas) {
            alert("Debes indicar si tienes otras mascotas.");
            return;
        }
        if (form.otrasMascotas === "si" && !form.detalleOtrasMascotas?.trim()) {
            alert("Por favor indica el tipo y cantidad de tus otras mascotas.");
            return;
        }
        // Ahora las fotos se validan con selectedFiles
        if (selectedFiles.length === 0 && form.evidenciaHogarUrls.length === 0) {
            alert("Debes subir al menos una foto del espacio donde vivirá la mascota.");
            return;
        }
        if (!form.compromisoSeguimiento) {
            alert("Debes aceptar las visitas o llamadas de seguimiento del CAAM.");
            return;
        }
        if (!form.compromisoCuidado) {
            alert("Debes aceptar el compromiso de cuidado del bienestar de la mascota.");
            return;
        }

        // ===== Normalizar "otro" =====
        const tipoViviendaFinal = form.tipoVivienda === "otro" ? form.detalleTipoVivienda : form.tipoVivienda;
        const espacioFinal = form.espacioDisponible === "otro" ? form.detalleEspacio : form.espacioDisponible;

        // ===== Subir archivos seleccionados (si hay) =====
        let nuevasUrls: string[] = [];
        if (selectedFiles.length > 0) {
            try {
                nuevasUrls = await subirFotosEvidencia(selectedFiles, form.usuarioId);
            } catch (err: any) {
                console.error(err);
                alert(err?.message || "Error al subir las fotos. Intenta de nuevo.");
                return;
            }
        }

        // Unir URLs previas (si existieran) + nuevas
        const evidenciaFinal = [...(form.evidenciaHogarUrls || []), ...nuevasUrls];

        // ===== Payload final que saldrá del componente =====
        const finalData: AdoptionPayload = {
            ...form,
            tipoVivienda: tipoViviendaFinal as string,
            espacioDisponible: espacioFinal as string,
            evidenciaHogarUrls: evidenciaFinal,
        };

        // Entregar al padre (la página). Ella llamará al server action real.
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-xl p-5">
            <div className="grid md:grid-cols-2 gap-4">
                {/* EXPERIENCIA */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Experiencia con mascotas</label>
                    <select
                        className="w-full border rounded-md px-3 py-2"
                        value={form.experiencia}
                        onChange={(e) => set("experiencia", e.target.value as any)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="nunca">Nunca he tenido</option>
                        <option value="poca">Poca</option>
                        <option value="mucha">Mucha</option>
                    </select>
                </div>

                {/* TIPO DE VIVIENDA */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Tipo de vivienda</label>
                    <select
                        className="w-full border rounded-md px-3 py-2"
                        value={form.tipoVivienda}
                        onChange={(e) => set("tipoVivienda", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="casa_propia">Casa propia</option>
                        <option value="casa_rentada">Casa rentada</option>
                        <option value="departamento">Departamento</option>
                        <option value="otro">Otro</option>
                    </select>
                    {form.tipoVivienda === "otro" && (
                        <input
                            className="mt-2 w-full border rounded-md px-3 py-2 text-sm"
                            placeholder="Especifica tu tipo de vivienda"
                            value={form.detalleTipoVivienda || ""}
                            onChange={(e) => set("detalleTipoVivienda", e.target.value)}
                        />
                    )}
                </div>

                {/* ESPACIO DISPONIBLE */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Espacio disponible para la mascota</label>
                    <select
                        className="w-full border rounded-md px-3 py-2"
                        value={form.espacioDisponible}
                        onChange={(e) => set("espacioDisponible", e.target.value)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="interior">Interior</option>
                        <option value="patio">Patio</option>
                        <option value="jardin">Jardín</option>
                        <option value="terraza">Terraza</option>
                        <option value="limitado">Limitado</option>
                        <option value="otro">Otro</option>
                    </select>
                    {form.espacioDisponible === "otro" && (
                        <input
                            className="mt-2 w-full border rounded-md px-3 py-2 text-sm"
                            placeholder="Especifica el tipo de espacio"
                            value={form.detalleEspacio || ""}
                            onChange={(e) => set("detalleEspacio", e.target.value)}
                        />
                    )}
                </div>

                {/* OTRAS MASCOTAS */}
                <div>
                    <label className="block text-sm font-semibold mb-1">¿Tienes otras mascotas?</label>
                    <select
                        className="w-full border rounded-md px-3 py-2"
                        value={form.otrasMascotas}
                        onChange={(e) => set("otrasMascotas", e.target.value as any)}
                    >
                        <option value="">Selecciona...</option>
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                    </select>
                </div>

                {/* DETALLE DE OTRAS MASCOTAS */}
                {form.otrasMascotas === "si" && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1">
                            Especifica tipo y cantidad de mascotas
                        </label>
                        <input
                            className="w-full border rounded-md px-3 py-2"
                            value={form.detalleOtrasMascotas}
                            onChange={(e) => set("detalleOtrasMascotas", e.target.value)}
                            placeholder="Ej. 2 perros y 1 gato"
                        />
                    </div>
                )}

                {/* EVIDENCIA */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                        Foto(s) del espacio donde vivirá la mascota
                    </label>

                    {/* Previews de archivos seleccionados (aún no subidos) */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedFiles.map((file, i) => (
                            <div key={i} className="relative">
                                <div className="w-24 h-16 bg-gray-100 border rounded-md overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSelectedFile(i)}
                                    className="absolute -top-2 -right-2 bg-white border rounded-full w-6 h-6 grid place-items-center text-xs"
                                    title="Quitar"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* Si ya hay URLs (cuando edites en el futuro), se mostrarán aquí */}
                        {form.evidenciaHogarUrls.map((u, i) => (
                            <div key={`url-${i}`} className="w-24 h-16 bg-gray-100 border rounded-md overflow-hidden">
                                <img src={u} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-1 text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Máximo 3 fotos (JPG/PNG).</p>
                </div>

                {/* COMPROMISOS */}
                <div className="md:col-span-2 flex flex-col gap-2 pt-3 border-t border-gray-200">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.compromisoSeguimiento}
                            onChange={(e) => set("compromisoSeguimiento", e.target.checked)}
                        />
                        <span className="text-sm">
                            Acepto <b>visitas o llamadas de seguimiento</b> del CAAM.
                        </span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.compromisoCuidado}
                            onChange={(e) => set("compromisoCuidado", e.target.checked)}
                        />
                        <span className="text-sm">
                            Me comprometo a <b>mantener el bienestar de la mascota</b> (alimentación, atención
                            veterinaria, no abandono, etc.).
                        </span>
                    </label>
                </div>

                {/* OBSERVACIONES */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Observaciones finales (opcional)</label>
                    <textarea
                        className="w-full border rounded-md px-3 py-2"
                        rows={3}
                        value={form.observaciones}
                        onChange={(e) => set("observaciones", e.target.value)}
                        placeholder="¿Algo más que quieras compartir?"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 rounded-md bg-[#4FA2D4] text-white hover:bg-[#3b90c3]">
                    Enviar solicitud
                </button>
            </div>
        </form>
    );
}
