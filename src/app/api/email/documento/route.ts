import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, nombre, tipoDocumento, estado, motivo } = await req.json();

    if (!email || !estado || !tipoDocumento) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos para enviar el correo." },
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

    let subject = "";
    let bodyHtml = "";

    if (estado === "rechazado") {
      subject = `Documento rechazado – ${tipoDocumento}`;
      bodyHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #faf6f6; padding: 20px;">
            <table align="center" width="480" style="background-color: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="text-align: center;">
                  <img src="https://caamorelia.vercel.app/logo.png"
                    alt="Logo CAAM"
                    width="120"
                    style="margin: 0 auto 10px; display: block;" />
                  <h2 style="color: #9B2E45; margin-bottom: 10px; font-weight: 900;">
                    Centro de Atención Animal de Morelia
                  </h2>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color: #333; font-size: 16px;">
                    Hola <strong>${nombre}</strong>,
                  </p>
                  <p style="color: #333; font-size: 15px; line-height: 1.6;">
                    Uno de tus documentos fue <strong>rechazado</strong> durante la revisión:
                  </p>
                  <p style="font-size: 15px;"><strong>Documento:</strong> ${tipoDocumento}</p>
                  <p style="font-size: 15px;"><strong>Motivo:</strong> ${motivo || "No especificado"}</p>
                  <p style="color: #555; font-size: 14px; margin-top: 16px;">
                    Por favor, ingresa a la plataforma para corregirlo y subirlo nuevamente.
                  </p>
                  <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />
                  <p style="text-align: center; color: #888; font-size: 12px; line-height: 1.4;">
                    © 2025 Centro de Atención Animal de Morelia<br/>
                    Hecho con <span style="color: #f17a36;">❤</span> por el equipo CAAM
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else if (estado === "aprobado_total") {
      subject = "✅ Documentos aprobados – CAAM";
      bodyHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #faf6f6; padding: 20px;">
            <table align="center" width="480" style="background-color: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="text-align: center;">
                  <img src="https://caamorelia.vercel.app/logo.png"
                    alt="Logo CAAM"
                    width="120"
                    style="margin: 0 auto 10px; display: block;" />
                  <h2 style="color: #9B2E45; margin-bottom: 10px; font-weight: 900;">
                    Centro de Atención Animal de Morelia
                  </h2>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color: #333; font-size: 16px;">
                    Hola <strong>${nombre}</strong>,
                  </p>
                  <p style="color: #333; font-size: 15px; line-height: 1.6;">
                    ¡Tus <strong>documentos fueron aprobados</strong> exitosamente! 🎉
                  </p>
                  <p style="color: #555; font-size: 14px; margin-top: 16px;">
                    En breve nos pondremos en contacto contigo para continuar con el proceso de adopción.
                  </p>
                  <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />
                  <p style="text-align: center; color: #888; font-size: 12px; line-height: 1.4;">
                    © 2025 Centro de Atención Animal de Morelia<br/>
                    Hecho con <span style="color: #f17a36;">❤</span> por el equipo CAAM
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else {
      return NextResponse.json(
        { ok: false, error: "Estado de correo no soportado." },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: bodyHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al enviar correo de documento:", error);
    return NextResponse.json(
      { ok: false, error: "Error al enviar el correo." },
      { status: 500 }
    );
  }
}
