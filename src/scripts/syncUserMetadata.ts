import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" }); // 👈 lee las variables desde la raíz
import { createClient } from "@supabase/supabase-js";

// 🔐 Usa la Service Role Key (solo en backend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncUserMetadata() {
  console.log("🔄 Iniciando sincronización desde public.perfiles → auth.users...");

  const { data: perfiles, error } = await supabase
    .from("perfiles")
    .select("id, nombres")
    .not("nombres", "is", null);

  if (error) {
    console.error("❌ Error obteniendo perfiles:", error);
    return;
  }

  console.log(`📦 Se encontraron ${perfiles.length} perfiles`);

  for (const perfil of perfiles) {
    try {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        perfil.id,
        { user_metadata: { nombre: perfil.nombres } }
      );

      if (updateError) {
        console.error(`⚠️ Error actualizando ${perfil.id}:`, updateError);
      } else {
        console.log(`✅ ${perfil.nombres} (${perfil.id}) actualizado`);
      }
    } catch (err) {
      console.error(`🚨 Falló actualización para ${perfil.id}`, err);
    }
  }

  console.log("🎉 Sincronización completada con éxito.");
}

syncUserMetadata();
