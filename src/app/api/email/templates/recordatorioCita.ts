// @ts-check

export default function recordatorioCita({
  nombre,
  tipoCita,
  mascota,
  fecha,
  hora,
}) {
  return {
    subject: `Recordatorio de cita – ${tipoCita}`,
    body: `
      <html>
      <body style="font-family:Arial;background:#faf6f6;padding:20px;">
        <table align="center" width="480"
          style="background:#fff;border-radius:14px;padding:30px;">

          <tr><td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" width="120"/>
            <h2 style="color:#9B2E45;font-weight:900;">
              Recordatorio de cita
            </h2>
          </td></tr>

          <tr><td>

            <p>Hola <strong>${nombre}</strong>,</p>

            <p style="color:#333;">
              Este es un recordatorio para tu cita:
            </p>

            <p>
              <strong>Tipo:</strong> ${tipoCita}<br/>
              ${mascota ? `<strong>Mascota:</strong> ${mascota}<br/>` : ""}
              <strong>📅 Fecha:</strong> ${fecha}<br/>
              <strong>⏰ Hora:</strong> ${hora}
            </p>

            <p style="color:#555;">
              Te esperamos puntual.
            </p>

            <hr style="margin:25px 0;border-top:1px solid #eee;">
            <p style="text-align:center;color:#888;font-size:12px;">
              © CAAM – Centro de Atención Animal Morelia
            </p>

          </td></tr>

        </table>
      </body>
      </html>
    `,
  };
}
