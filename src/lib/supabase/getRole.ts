import { createClient } from "@/lib/supabase/client";

export async function getUserRole() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("rol_id")
    .eq("id", user.id)
    .single();

  if (error || !perfil) return null;
  return perfil.rol_id;
}
