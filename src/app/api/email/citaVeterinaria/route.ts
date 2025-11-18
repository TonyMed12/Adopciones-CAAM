import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      email,
      nombre,
      nombreMascota,
      fechaTexto,
      horaTexto,
      motivo,
    } = await req.json();

    if (!email || !nombre || !nombreMascota || !fechaTexto || !horaTexto) {
      return NextResponse.json(
        { error: "Faltan datos para enviar el correo." },
        { status: 400 }
      );
    }

    // Transporter
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


    // ============================
    //  EMAIL HTML TEMPLATE
    // ============================
    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FFF7F7; padding: 25px;">
      <table align="center" width="520" style="background: #ffffff; border-radius: 14px; padding: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="text-align: center;">
            <img src="https://caamorelia.vercel.app/logo.png" width="120" alt="Logo CAAM" style="margin-bottom: 10px;" />
            <h2 style="color:#9B2E45;margin:0;font-weight:900;">Centro de Atención Animal de Morelia</h2>
            <h2 style="color: #9B2E45; margin: 0; margin-bottom: 20px; font-size: 22px; font-weight: 900;">
              Cita Veterinaria Agendada
            </h2>
          </td>
        </tr>

        <tr>
          <td style="color: #333; font-size: 15px; line-height: 1.6;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>
              Tu cita veterinaria ha sido registrada correctamente.  
              El equipo del CAAM revisará tu solicitud y te confirmará lo antes posible.
            </p>

            <div style="background: #FCE8E8; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #9B2E45;">📋 Detalles de la cita:</p>
              <p style="margin: 8px 0;"><strong>Mascota:</strong> ${nombreMascota}</p>
              <p style="margin: 8px 0;"><strong>Fecha:</strong> ${fechaTexto}</p>
              <p style="margin: 8px 0;"><strong>Hora:</strong> ${horaTexto}</p>
              <p style="margin: 8px 0;"><strong>Motivo:</strong> ${motivo}</p>
            </div>

            <p style="font-size: 14px; color: #555;">
              No es necesario responder este correo.  
              Si tienes dudas, puedes contactarnos directamente desde el portal del adoptante.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p style="text-align: center; font-size: 13px; color: #777;">
              Centro de Atención Animal de Morelia<br />
              Este correo es una confirmación automática.
            </p>
          </td>
        </tr>
      </table>
    </div>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: `"CAAM Morelia" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Cita Veterinaria Registrada",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando correo veterinario:", error);
    return NextResponse.json({ error: "Error enviando correo" }, { status: 500 });
  }
}
