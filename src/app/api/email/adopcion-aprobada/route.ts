import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import CertificadoPDF from "@/components/certificados/CertificadoPDF";
import { buildAdopcionAprobadaEmail } from "../templates/adopcionAprobada";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, nombre, nombreMascota, fotoMascota, adopcionId } = body;

    if (!email || !nombre || !nombreMascota) {
      return NextResponse.json(
        { ok: false, message: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    console.log("📩 Enviando correo a:", email);

    // ============================
    // 1️⃣ GENERAR PDF (React PDF)
    // ============================

        // 1️⃣ Descargar la imagen de la mascota y convertirla a Buffer
    let fotoParaPDF: any = fotoMascota;

    try {
      if (fotoMascota) {
        const resImg = await fetch(fotoMascota);
        if (resImg.ok) {
          const arrayBuffer = await resImg.arrayBuffer();
          fotoParaPDF = Buffer.from(arrayBuffer);
        } else {
          console.warn("⚠ No se pudo descargar la imagen, status:", resImg.status);
        }
      }
    } catch (e) {
      console.warn("⚠ Error descargando imagen, se usa placeholder:", e);
      fotoParaPDF = "https://caamorelia.vercel.app/logo.png"; // fallback sencillo
    }

    // 2️⃣ Generar el PDF usando esa imagen
    const pdfBuffer = await renderToBuffer(
      CertificadoPDF({
        adoptante: nombre,
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
      nombre,
      nombreMascota,
      fotoMascota,
    });

    // ============================
    // 3️⃣ SMTP CONFIG
    // ============================

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
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
