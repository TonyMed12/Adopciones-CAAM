import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function OAuthRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("SESSION:", session);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const { data: perfil } = await supabaseAdmin
    .from("perfiles")
    .select("rol_id")
    .eq("email", session.user.email)
    .maybeSingle();
  let rolId = perfil?.rol_id;

  if (!rolId) {
    const { data: inserted } = await supabaseAdmin
      .from("perfiles")
      .insert([
        {
          email: session.user.email,
          nombres: session.user.name ?? "Usuario",
          rol_id: 2,
        },
      ])
      .select("rol_id")
      .single();

    rolId = inserted?.rol_id ?? 2;
  }

  if (rolId === 1) redirect("/dashboards/administrador");
  redirect("/dashboards/usuario");
    }
