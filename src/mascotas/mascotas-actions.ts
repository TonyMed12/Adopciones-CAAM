"use server";
import {supabase} from "@/lib/supabase/client";
import {CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema} from "./mascotas-schemas";
import type {Mascota} from "./mascotas";
import {v4 as uuidv4} from "uuid";
import QRCode from "qrcode";

export async function listarMascotas(): Promise<Mascota[]> {
    const {data, error} = await supabase
    .from("mascotas")
    .select("*, raza:raza_id(*)")
    .order("created_at", {ascending: false});

    if (error) throw new Error(error.message);
    return data as Mascota[];
}

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
        ...(id ? {id} : {}),
        imagen_url,
        qr_code,
    };

    const {data, error} = await supabase
    .from("mascotas")
    .insert(dataToInsert)
    .select("*, raza:raza_id(id, nombre, especie)")
    .single();

    if (error) throw new Error(error.message);
    return data as Mascota;
}

export async function uploadMascotaArchivos(file: File, id?: string) {
    try {
        const uuid = id || uuidv4();

        // Subir imagen al bucket "mascotas-imagenes"
        const imageName = `${uuid}.jpg`;
        const {error: imgError} = await supabase.storage.from("mascotas-imagenes").upload(imageName, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
        });
        if (imgError) throw imgError;

        const {data: imgData} = supabase.storage.from("mascotas-imagenes").getPublicUrl(imageName);

        //
        let baseUrl = "http://localhost:3000";
        if (typeof window !== "undefined") baseUrl = window.location.origin;
        else if (process.env.VERCEL_URL) baseUrl = `https://${process.env.VERCEL_URL}`;

        // 3Construir el link del QR
        const qrLink = `${baseUrl}/mascota/${uuid}`;

        // 4️Generar QR con esa URL
        const qrDataUrl = await QRCode.toDataURL(qrLink, {width: 300});
        const qrBlob = await (await fetch(qrDataUrl)).blob();

        // Subir QR al bucket "mascotas-qr"
        const qrName = `${uuid}-qr.png`;
        const {error: qrError} = await supabase.storage.from("mascotas-qr").upload(qrName, qrBlob, {
            cacheControl: "3600",
            upsert: true,
            contentType: "image/png",
        });
        if (qrError) throw qrError;

        return {
            ok: true,
            id: uuid,
            imagen_url: imgData?.publicUrl ?? null,
            qr_code: qrName, // ← solo el nombre del archivo
        };
    } catch (err: any) {
        console.error("❌ Error subiendo archivos:", err);
        return {ok: false, error: err.message};
    }
}

export async function actualizarMascota(input: unknown): Promise<Mascota> {
    const parsed = UpdateMascotaSchema.parse(input);
    const {id, ...updates} = parsed;
    const {data, error} = await supabase.from("mascotas").update(updates).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Mascota;
}

export async function eliminarMascota(id: string): Promise<{success: boolean}> {
    const parsed = DeleteMascotaSchema.parse({id});
    const {error} = await supabase.from("mascotas").delete().eq("id", parsed.id);
    if (error) throw new Error(error.message);
    return {success: true};
}
