import {createClient} from "@/lib/supabase/client";

export async function subirFotosEvidencia(files: File[], usuarioId: string): Promise<string[]> {
    const supabase = createClient();
    const bucket = "adopciones";
    const urls: string[] = [];

    for (const file of files) {
        const filename = `${usuarioId}/${Date.now()}_${file.name}`;
        const {error} = await supabase.storage.from(bucket).upload(filename, file);

        if (error) throw new Error(`Error al subir ${file.name}: ${error.message}`);

        const {data: publicUrl} = supabase.storage.from(bucket).getPublicUrl(filename);
        urls.push(publicUrl.publicUrl);
    }

    return urls;
}
