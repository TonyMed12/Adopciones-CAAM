import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function DashboardsRouter() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) redirect("/login");

  const { data: perfil } = await supabaseAdmin
    .from("perfiles")
    .select("rol_id")
    .eq("email", session.user.email)
    .maybeSingle();

  if (!perfil?.rol_id) redirect("/registro");

  if (perfil.rol_id === 1) redirect("/dashboards/administrador");
  redirect("/dashboards/usuario");
}
