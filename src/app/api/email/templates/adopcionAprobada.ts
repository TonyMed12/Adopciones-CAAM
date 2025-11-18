// src/app/api/email/templates/adopcionAprobada.ts

type AdopcionAprobadaParams = {
  nombre: string;
  nombreMascota: string;
};

export function buildAdopcionAprobadaEmail({
  nombre,
  nombreMascota,
}: AdopcionAprobadaParams) {
  const subject = `🎉 ¡Tu adopción ha sido aprobada! – ${nombreMascota} te espera`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:20px;">
      <table
        align="center" width="520"
        style="background-color:#fff; border-radius:14px; padding:30px; box-shadow:0 3px 8px rgba(0,0,0,0.1);"
      >
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" width="120" style="margin-bottom:10px;" />
            <h2 style="color:#9B2E45; margin:0; font-weight:900;">Centro de Atención Animal de Morelia</h2>
            <p style="color:#555; margin-top:4px;">¡Buenas noticias! 🐾</p>
          </td>
        </tr>

        <tr>
          <td style="padding-top:20px; color:#333; font-size:15px;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              ¡Tu proceso de adopción ha sido <strong>aprobado</strong>!  
              Ya puedes acudir al CAAM para recoger a tu nuevo compañero de vida:
              <strong>${nombreMascota}</strong>.
            </p>

            <p style="margin-top:12px;">
              <strong>🕒 Horario laboral:</strong> de <strong>8:00 AM</strong> a <strong>2:00 PM</strong>, cualquier día.
              <br/>
              <strong>📍 Importante:</strong> Lleva una identificación oficial (INE).
            </p>

            <p style="margin-top:14px;">
              Adjuntamos tu <strong>Certificado Oficial de Adopción</strong> en formato PDF.
            </p>

            <p>¡Felicidades! Gracias por cambiarle la vida a <strong>${nombreMascota}</strong> ❤️🐾</p>
          </td>
        </tr>

        <tr>
          <td style="text-align:center; padding-top:24px; font-size:12px; color:#999;">
            © ${new Date().getFullYear()} CAAM Morelia · Correo automático
          </td>
        </tr>

      </table>
    </body>
  </html>
  `;

  return { subject, html };
}
