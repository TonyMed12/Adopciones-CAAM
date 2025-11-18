import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, nombre, mascota, fecha, hora, motivo } = await req.json();

    if (!email || !nombre || !mascota) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos necesarios para el correo." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const html = `
      <html>
      <body style="font-family: Arial; background-color: #faf6f6; padding: 20px;">
        <table align="center" width="520" style="background-color:#fff;border-radius:14px;padding:30px;box-shadow:0 3px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="text-align:center">
              <img src="https://caamorelia.vercel.app/logo.png" width="120" style="margin-bottom:10px" />
              <h2 style="color:#9B2E45;margin:0;font-weight:900;">Centro de Atención Animal de Morelia</h2>
            </td>
          </tr>

          <tr>
            <td>
              <p>Hola <strong>${nombre}</strong>,</p>
              <p>Tu cita para conocer a <strong>${mascota}</strong> ha sido <strong>cancelada</strong>.</p>

              ${
                fecha && hora
                  ? `
                <p><strong>Fecha original:</strong> ${fecha}</p>
                <p><strong>Hora original:</strong> ${hora}</p>
              `
                  : ""
              }

              ${
                motivo
                  ? `
                <p style="margin-top:12px"><strong>Motivo:</strong> ${motivo}</p>
              `
                  : ""
              }

              <p style="margin-top:16px">
                Si deseas reprogramar tu cita, puedes hacerlo desde tu panel de usuario.
              </p>

              <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />

              <p style="text-align:center;color:#888;font-size:12px">
                © 2025 Centro de Atención Animal de Morelia<br>
                Hecho con ❤ por el equipo CAAM
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Cita cancelada – CAAM`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al enviar correo de cancelación:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el correo." },
      { status: 500 }
    );
  }
}
