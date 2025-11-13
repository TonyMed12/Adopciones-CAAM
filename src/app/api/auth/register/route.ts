import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    console.log("📝 Iniciando registro para:", formData.email);

    // ✅ Usar admin.createUser en lugar de signUp
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      user_metadata: {
        nombre: formData.nombres,
      },
    });

    console.log("👤 Resultado creación usuario:", {
      userId: authData?.user?.id,
      error: authError?.message,
    });

    if (authError || !authData.user) {
      console.error("❌ Error creando usuario:", authError);
      return NextResponse.json(
        { error: authError?.message || "No se pudo crear el usuario" },
        { status: 400 }
      );
    }

    console.log("💾 Creando perfil para usuario:", authData.user.id);

    // Crear perfil
    const { error: perfilError } = await supabaseAdmin
      .from("perfiles")
      .insert([
        {
          id: authData.user.id,
          nombres: formData.nombres,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno || null,
          curp: formData.curp || null,
          telefono: formData.telefono || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          ocupacion: formData.ocupacion || null,
          email: formData.email,
          rol_id: 2,
        },
      ]);

    if (perfilError) {
      console.error("❌ Error creando perfil:", perfilError);
      
      // ✅ Si falla el perfil, elimina el usuario para evitar inconsistencias
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: `Error creando perfil: ${perfilError.message}` },
        { status: 400 }
      );
    }

    console.log("✅ Usuario y perfil creados exitosamente");
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    console.error("❌ Error general en registro:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}