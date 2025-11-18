import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildCitaVeterinariaAprobadaEmail } from "../templates/citaVeterinariaAprobada";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, nombre, nombreMascota, fotoMascota, fechaTexto } = body;

    const { subject, html } = buildCitaVeterinariaAprobadaEmail({
      nombre,
      nombreMascota,
      fotoMascota,
      fechaTexto,
    });

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
