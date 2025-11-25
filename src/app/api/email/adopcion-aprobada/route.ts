import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import CertificadoPDF from "@/components/certificados/CertificadoPDF";
import { buildAdopcionAprobadaEmail } from "../templates/adopcionAprobada";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, adoptante, nombreMascota, fotoMascota, adopcionId } = body;

    if (!email || !adoptante || !nombreMascota) {
      return NextResponse.json(
        { ok: false, message: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    console.log("📩 Enviando correo a:", email);

    // ============================
    // 1️⃣ GENERAR PDF
    // ============================

    let fotoParaPDF: any = fotoMascota;

    try {
      if (fotoMascota) {
        const resImg = await fetch(fotoMascota);
        if (resImg.ok) {
          const arrayBuffer = await resImg.arrayBuffer();
          fotoParaPDF = Buffer.from(arrayBuffer);
        }
      }
    } catch (e) {
      console.warn("⚠ Error descargando imagen, usando placeholder.");
      fotoParaPDF = "https://caamorelia.vercel.app/logo.png";
    }

    const pdfBuffer = await renderToBuffer(
      CertificadoPDF({
        adoptante,
        mascota: {
          nombre: nombreMascota,
          foto: fotoParaPDF,
          id: adopcionId || "N/A",
        },
        fecha: new Date().toLocaleDateString("es-MX"),
      })
    );

    console.log("✅ PDF generado correctamente.");

    // ============================
    // 2️⃣ TEMPLATE HTML
    // ============================

const { subject, html } = buildAdopcionAprobadaEmail({
  nombre: adoptante, // 👈 se lo pasamos como 'nombre'
  nombreMascota,
  fotoMascota,
});
    console.log("✅ HTML del correo generado.");

    // ============================
    // 3️⃣ SMTP
    // ============================

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    // ============================
    // 4️⃣ ENVIAR
    // ============================

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: `Certificado-Adopcion-${nombreMascota}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ Correo enviado con PDF adjunto.");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Error interno al enviar correo." },
      { status: 500 }
    );
  }
}
