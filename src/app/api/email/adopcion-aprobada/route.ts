import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildAdopcionAprobadaEmail } from "../templates/adopcionAprobada";
import { generarCertificadoPDF } from "./generarCertificado";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      adoptante,
      mascota, // { nombre, foto, id }
      fechaAdopcion,
    } = body;

    if (!email || !adoptante || !mascota) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // ⭐ 1. Crear PDF certificado
    const pdfBuffer = await generarCertificadoPDF({
      adoptante,
      mascota,
      fechaAdopcion,
    });

    // ⭐ 2. Crear correo
    const { subject, html } = buildAdopcionAprobadaEmail({
      nombre: adoptante,
      nombreMascota: mascota.nombre,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CAAM Morelia" <${process.env.SMTP_FROM}>`,
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: `Certificado-Adopcion-${mascota.nombre}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando adopcion-aprobada:", error);
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}
