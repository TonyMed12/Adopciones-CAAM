import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }

    console.log("🔗 Generando link de recuperación para:", email);

    // 1️⃣ Generar el link con Supabase
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/recuperacion/reestablecer_contrasena`,
      },
    });

    if (error) {
      console.error("❌ Error generando link:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const resetUrl = data?.properties?.action_link;

    if (!resetUrl) {
      return NextResponse.json(
        { error: "Supabase no devolvió el enlace de recuperación." },
        { status: 500 }
      );
    }

    const nombre = data?.user?.user_metadata?.nombre || "Usuario";

    // 2️⃣ Enviar el correo usando tu sistema
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://caamorelia.vercel.app";

await fetch(`${baseUrl}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "resetPassword",
        email,
        data: {
          nombre,
          url: resetUrl,
        },
      }),
    });

    return NextResponse.json({
      ok: true,
      message: "Correo enviado si el usuario existe.",
    });
  } catch (err) {
    console.error("💥 Error en reset:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
