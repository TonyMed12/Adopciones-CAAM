import { supabase } from "@/lib/supabase/client";

export async function uploadSeguimientoFotos(
  files: FileList,
  adopcionId: string
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of Array.from(files)) {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `evidencias/${adopcionId}/${filename}`;

    const { error } = await supabase.storage
      .from("seguimineto")
      .upload(path, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("seguimineto").getPublicUrl(path);

    urls.push(publicUrl);
  }

  return urls;
}
