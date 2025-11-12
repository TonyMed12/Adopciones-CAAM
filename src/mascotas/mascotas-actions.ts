"use server";
import { supabase } from "@/lib/supabase/client";
import { CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema } from "./mascotas-schemas";
import type { Mascota } from "./mascotas";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

/* ======================== LISTAR ======================== */
export async function listarMascotas(): Promise<Mascota[]> {
    const { data, error } = await supabase
        .from("mascotas")
        .select("*, raza:raza_id(*)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Mascota[];
}

/* ======================== CREAR ======================== */
export async function crearMascota(input: unknown, imagen?: File): Promise<Mascota> {
    const parsed = CreateMascotaSchema.parse(input);

    let imagen_url: string | null = null;
    let qr_code: string | null = null;
    let id: string | undefined;

    if (imagen) {
        const archivos = await uploadMascotaArchivos(imagen);
        if (!archivos.ok) throw new Error(archivos.error);

        imagen_url = archivos.imagen_url ?? null;
        qr_code = archivos.qr_code ?? null;
        id = archivos.id;
    }

    const dataToInsert = {
        ...parsed,
        ...(id ? { id } : {}),
        imagen_url,
        qr_code,
    };

    const { data, error } = await supabase
        .from("mascotas")
        .insert(dataToInsert)
        .select("*, raza:raza_id(id, nombre, especie)")
        .single();

    if (error) throw new Error(error.message);
    return data as Mascota;
}

/* ======================== SUBIR ARCHIVOS ======================== */
export async function uploadMascotaArchivos(file: File, id?: string) {
    try {
        const uuid = id || uuidv4();

        // 🖼 Guardar imagen directamente en la raíz del bucket
        const imageName = `${uuid}.jpg`;
        const { error: imgError } = await supabase.storage.from("mascotas-imagenes").upload(imageName, file, {
            cacheControl: "0",
            upsert: true,
            contentType: file.type,
        });
        if (imgError) throw imgError;

        const { data: imgData } = supabase.storage.from("mascotas-imagenes").getPublicUrl(imageName);

        // 🌐 Generar link base para QR

        let baseUrl = "https://caamorelia.vercel.app";

        // Si estás ejecutando localmente, usa localhost
        if (process.env.NODE_ENV === "development") {
            baseUrl = "http://localhost:3000";
        }

        // 🧾 Generar QR con enlace público
        const qrLink = `${baseUrl}/mascota/${uuid}`;
        const qrDataUrl = await QRCode.toDataURL(qrLink, { width: 300 });
        const qrBlob = await (await fetch(qrDataUrl)).blob();

        // 📤 Subir QR (también en raíz)
        const qrName = `${uuid}-qr.png`;
        const { error: qrError } = await supabase.storage
            .from("mascotas-qr")
            .upload(qrName, qrBlob, {
                cacheControl: "3600",
                upsert: true,
                contentType: "image/png",
            });
        if (qrError) throw qrError;

        return {
            ok: true,
            id: uuid,
            imagen_url: imgData?.publicUrl ?? null,
            qr_code: qrName,
        };
    } catch (err: any) {
        console.error("❌ Error subiendo archivos:", err);
        return { ok: false, error: err.message };
    }
}

/* ======================== ACTUALIZAR ======================== */
/* ======================== ACTUALIZAR ======================== */
export async function actualizarMascota(payload: unknown, fotoFile?: File) {
    const parsed = UpdateMascotaSchema.parse(payload);

    try {
        let imagen_url = parsed.imagen_url || null;

        // 🖼 Si hay nueva foto, reemplazar la anterior
        if (fotoFile) {
            const imageName = `${parsed.id}.jpg`;

            // 🧹 Borrar la vieja (si existía)
            await supabase.storage.from("mascotas-imagenes").remove([imageName]);

            // 📤 Subir la nueva con el mismo nombre
            const { error: uploadError } = await supabase.storage.from("mascotas-imagenes").upload(imageName, fotoFile, {
                cacheControl: "0", // sin caché
                upsert: true,
                contentType: fotoFile.type,
            });
            if (uploadError) throw uploadError;

            // 🌐 Obtener URL pública con anti-caché
            const { data: urlData } = supabase.storage.from("mascotas-imagenes").getPublicUrl(imageName);

            // 🚀 Fuerza actualización en navegador/CDN
            imagen_url = `${urlData?.publicUrl}?v=${Date.now()}`;
        }

        // 🕒 Actualizar mascota en la base de datos
        const { data, error } = await supabase
            .from("mascotas")
            .update({
                ...parsed,
                imagen_url,
                updated_at: new Date().toISOString(),
            })
            .eq("id", parsed.id)
            .select("*, raza:raza_id(id, nombre, especie)")
            .single();

        if (error) throw error;
        return data as Mascota;
    } catch (err) {
        console.error("❌ Error actualizando mascota:", err);
        throw err;
    }
}

/* ======================== ELIMINAR SOLO FOTO ======================== */
export async function eliminarFotoMascota(id: string, imagen_url: string | null) {
    if (!id) {
        console.warn("No hay ID válido para eliminar");
        return { success: false, message: "No hay ID válido" };
    }

    try {
        const fileName = `${id}.jpg`; // ✅ nombre fijo
        console.log("🧹 Eliminando imagen del bucket:", fileName);

        // 🗑️ Eliminar del bucket
        const { error: deleteError } = await supabase.storage.from("mascotas-imagenes").remove([fileName]);
        if (deleteError) throw deleteError;

        // 🔄 Actualizar registro (solo si la imagen estaba guardada)
        if (imagen_url) {
            const { error: updateError } = await supabase
                .from("mascotas")
                .update({
                    imagen_url: null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id);
            if (updateError) throw updateError;
        }

        console.log("✅ Imagen eliminada correctamente");
        return { success: true };
    } catch (err: any) {
        console.error("❌ Error al eliminar imagen:", err);
        return { success: false, message: err.message };
    }
}

/* ======================== ELIMINAR MASCOTA COMPLETA ======================== */
export async function eliminarMascota(id: string): Promise<{ success: boolean }> {
    const parsed = DeleteMascotaSchema.parse({ id });
    console.log("🚮 Iniciando eliminación de mascota:", parsed.id);

    // 1️⃣ Verificar y eliminar solicitudes de adopción relacionadas
    try {
        const { data: solicitudes, error: fetchSolicitudesError } = await supabase
            .from("solicitudes_adopcion")
            .select("id")
            .eq("mascota_id", parsed.id);

        if (fetchSolicitudesError) {
            console.warn("⚠️ No se pudieron obtener solicitudes:", fetchSolicitudesError.message);
        }

        if (solicitudes && solicitudes.length > 0) {
            console.log(`📦 Se encontraron ${solicitudes.length} solicitudes. Eliminando...`);
            const { error: delSolicitudesError } = await supabase
                .from("solicitudes_adopcion")
                .delete()
                .eq("mascota_id", parsed.id);

            if (delSolicitudesError) {
                console.error("❌ Error al eliminar solicitudes:", delSolicitudesError);
                throw new Error(delSolicitudesError.message);
            } else {
                console.log("🧹 Solicitudes de adopción eliminadas correctamente.");
            }
        } else {
            console.log("✅ No hay solicitudes asociadas a esta mascota.");
        }
    } catch (err) {
        console.warn("⚠️ Error manejando solicitudes:", err);
        // Continuar aunque haya fallado el fetch
    }

    // 2️⃣ Obtener datos de la mascota (imagen y QR)
    const { data: mascotaData, error: fetchError } = await supabase
        .from("mascotas")
        .select("imagen_url, qr_code")
        .eq("id", parsed.id)
        .single();

    if (fetchError) {
        console.warn("⚠️ No se pudo obtener la mascota antes de eliminar:", fetchError.message);
    }

    // 3️⃣ Eliminar imagen si existe
    if (mascotaData?.imagen_url) {
        const fileName = mascotaData.imagen_url.split("/").pop()?.split("?")[0];
        if (fileName) {
            const { error: delImgError } = await supabase.storage.from("mascotas-imagenes").remove([fileName]);
            if (delImgError) console.warn("⚠️ No se pudo eliminar imagen:", delImgError.message);
            else console.log("🧹 Imagen eliminada:", fileName);
        }
    }

    // 4️⃣ Eliminar QR si existe
    if (mascotaData?.qr_code) {
        const { error: delQrError } = await supabase.storage.from("mascotas-qr").remove([mascotaData.qr_code]);
        if (delQrError) console.warn("⚠️ No se pudo eliminar QR:", delQrError.message);
        else console.log("🧹 QR eliminado:", mascotaData.qr_code);
    }

    // 5️⃣ Finalmente eliminar mascota
    const { error: deleteMascotaError } = await supabase.from("mascotas").delete().eq("id", parsed.id);

    if (deleteMascotaError) {
        console.error("❌ Error al eliminar mascota:", deleteMascotaError);
        throw new Error(deleteMascotaError.message);
    }

    console.log(`✅ Mascota ${parsed.id} eliminada correctamente`);
    return { success: true };
}

// OBTENER POR ID
export async function obtenerMascotaPorId(id: string) {
    const { data, error } = await supabase
        .from("mascotas")
        .select("*, raza:raza_id(id, nombre, especie)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("❌ Error obteniendo mascota:", error.message);
        throw new Error("No se encontró la mascota");
    }

    return data;
}
