export function buildAdopcionRechazadaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
  motivo,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
  motivo: string;
}) {
  const subject = `❗ Actualización sobre la adopción de ${nombreMascota}`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:24px;">

      <table align="center" width="560" 
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <!-- LOGO -->
        <tr>
          <td style="text-align:center;">
            <img 
              src="https://caamorelia.vercel.app/logo.png" 
              alt="Logo CAAM"
              style="width:120px; margin-bottom:10px;"
            />
          </td>
        </tr>

        <!-- TITULO -->
        <tr>
          <td style="text-align:center;">
            <h1 style="color:#9B2E45; font-size:26px; font-weight:900; margin-bottom:4px;">
              Sobre tu solicitud de adopción
            </h1>
            <h3 style="color:#c74b63; font-size:17px; margin-top:0;">
              Lamentamos informarte que no fue aprobada 🐾
            </h3>
          </td>
        </tr>

        <!-- FOTO -->
        <tr>
          <td style="text-align:center; padding-top:10px;">
            <img 
              src="${fotoMascota}"
              alt="${nombreMascota}"
              style="width:250px; height:250px; border-radius:16px; object-fit:cover; margin-bottom:20px; border:4px solid #9B2E45;" 
            />
          </td>
        </tr>

        <!-- MENSAJE -->
        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              Agradecemos profundamente tu interés en adoptar a 
              <strong>${nombreMascota}</strong>.
              Después de revisar tu solicitud, lamentamos informarte que 
              <span style="color:#9B2E45; font-weight:bold;">no pudo ser aprobada en esta ocasión.</span>
            </p>

            <div style="background:#fff4f4; padding:16px; border-radius:12px; margin:18px 0; border-left:6px solid #9B2E45;">
              <p style="margin:0; font-size:15px;">
                <strong>Motivo del rechazo:</strong><br/>
                ${motivo || "Sin motivo especificado."}
              </p>
            </div>

            <p>
              Te invitamos a volver a intentarlo en el futuro.  
              Nuestro objetivo es asegurarnos de que cada mascota tenga un hogar adecuado y seguro.
            </p>

            <p>
              Si necesitas apoyo o tienes dudas, estamos para ayudarte.
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="text-align:center; padding-top:26px; font-size:12px; color:#999;">
            © ${new Date().getFullYear()} CAAM Morelia · Correo automático
          </td>
        </tr>

      </table>
    </body>
  </html>
  `;

  return { subject, html };
}
