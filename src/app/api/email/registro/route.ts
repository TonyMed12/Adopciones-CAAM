import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, nombre, confirmationUrl } = await req.json();

    // Validaciones básicas
    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    // Configurar transporte SMTP con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Evita errores TLS en Vercel/local
      },
    });

    // ============================
    // 💌 TEMPLATE HTML DEL CORREO
    // ============================
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #faf6f6; padding: 20px;">
          <table align="center" width="480" style="background-color: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);">
            
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
                  ¡Gracias por registrarte en la plataforma de adopciones del CAAM 🐾!  
                  Para completar tu registro, confirma tu correo electrónico haciendo clic en el siguiente botón:
                </p>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}"
                    style="background-color: #8B4513; color: white; padding: 14px 26px; 
                    text-decoration: none; border-radius: 10px; font-weight: bold; 
                    box-shadow: 0 2px 5px rgba(107,30,36,0.3); display: inline-block;">
                    Confirmar cuenta
                  </a>
                </p>

                <p style="color: #555; font-size: 14px;">
                  Si tú no creaste esta cuenta, puedes ignorar este mensaje.
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

    // ============================
    // 📤 ENVÍO DEL CORREO
    // ============================
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Confirmación de cuenta – CAAM 🐾",
      html: htmlContent,
    });

    console.log("📧 Email enviado:", info.messageId);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return NextResponse.json(
      { ok: false, error: "Error al enviar el correo." },
      { status: 500 }
    );
  }
}
