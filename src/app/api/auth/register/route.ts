import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    console.log("📝 Iniciando registro para:", formData.email);

    // =======================================
    // 1️⃣ CREAR USUARIO EN SUPABASE
    // =======================================
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
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

    const userId = authData.user.id;

    // =======================================
    // 2️⃣ CREAR PERFIL EN TABLA perfiles
    // =======================================
    console.log("💾 Creando perfil para usuario:", userId);

    const { error: perfilError } = await supabaseAdmin
      .from("perfiles")
      .insert([
        {
          id: userId,
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

      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: `Error creando perfil: ${perfilError.message}` },
        { status: 400 }
      );
    }

    // =======================================
    // 3️⃣ GENERAR LINK DE CONFIRMACIÓN
    // =======================================
    console.log("🔗 Generando link de verificación…");

    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email: formData.email,
        password: formData.password, // requerido por Supabase
      });

    if (linkError) {
      console.error("❌ Error generando link de verificación:", linkError);
      return NextResponse.json(
        {
          error:
            linkError.message ||
            "No se pudo generar el link de verificación.",
        },
        { status: 400 }
      );
    }

    const confirmationUrl = linkData?.properties?.action_link;

    console.log("✅ Link de confirmación generado:", confirmationUrl);

    if (!confirmationUrl) {
      return NextResponse.json(
        { error: "Supabase no devolvió el link de confirmación" },
        { status: 500 }
      );
    }

    console.log("🎉 Usuario, perfil y link generados con éxito.");

    // =======================================
    // 4️⃣ RESPUESTA FINAL PARA handleSubmit
    // =======================================
    return NextResponse.json(
      {
        success: true,
        confirmationUrl,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";

    console.error("❌ Error general en registro:", errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
