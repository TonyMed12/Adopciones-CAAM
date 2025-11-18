import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildAdopcionRechazadaEmail } from "../templates/adopcionRechazada";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, nombre, nombreMascota, fotoMascota, motivo } = body;

    if (!email || !nombre || !nombreMascota) {
      return NextResponse.json(
        { ok: false, message: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    const { subject, html } = buildAdopcionRechazadaEmail({
      nombre,
      nombreMascota,
      fotoMascota,
      motivo,
    });

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Error interno al enviar correo" },
      { status: 500 }
    );
  }
}
