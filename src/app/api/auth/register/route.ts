import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  console.log("📩 Entró al endpoint /api/auth/register");
  try {
    const formData = await req.json();
    console.log("📦 Datos recibidos:", formData);

    // Crear usuario
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmado`,
      },
    });

    console.log("🧩 Resultado signUp:", authData, authError);

    if (authError) {
      console.error("❌ Error creando usuario:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      console.error("❌ No se devolvió user");
      return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 400 });
    }

    // Crear perfil
    const { error: perfilError } = await supabaseAdmin.from("perfiles").insert([
      {
        id: authData.user.id,
        nombres: formData.nombres,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        curp: formData.curp,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento,
        ocupacion: formData.ocupacion,
        email: formData.email,
        rol_id: 2,
      },
    ]);

    console.log("📥 Resultado perfil:", perfilError);

    if (perfilError) {
      console.error("❌ Error creando perfil:", perfilError.message);
      return NextResponse.json({ error: perfilError.message }, { status: 400 });
    }

    console.log("✅ Usuario y perfil creados correctamente");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("💥 Error general en registro:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
