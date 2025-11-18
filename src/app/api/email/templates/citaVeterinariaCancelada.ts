export function buildCitaVeterinariaCanceladaEmail({
  nombre,
  nombreMascota,
  fotoMascota,
  motivo,
  fechaTexto,
}: {
  nombre: string;
  nombreMascota: string;
  fotoMascota: string;
  motivo: string;
  fechaTexto: string;
}) {
  const subject = `⚠️ Tu cita veterinaria con ${nombreMascota} ha sido cancelada`;

  const html = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color:#faf6f6; padding:24px;">

      <table align="center" width="560" 
        style="background:#fff; border-radius:18px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <!-- LOGO -->
        <tr>
          <td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png"
              alt="CAAM Logo" 
              style="width:120px; margin-bottom:10px;" />
          </td>
        </tr>

        <!-- TITULO -->
        <tr>
          <td style="text-align:center;">
            <h1 style="color:#9B2E45; font-size:26px; font-weight:900;">
              Cita cancelada
            </h1>
            <h3 style="color:#c74b63; margin-top:4px;">
              Tu cita con ${nombreMascota} ha sido cancelada ❗
            </h3>
          </td>
        </tr>

        <!-- FOTO -->
        <tr>
          <td style="text-align:center;">
            <img src="${fotoMascota}" alt="${nombreMascota}"
              style="width:250px; height:250px; object-fit:cover; border-radius:20px; border:4px solid #9B2E45; margin-top:10px; margin-bottom:20px;" />
          </td>
        </tr>

        <!-- CUERPO -->
        <tr>
          <td style="font-size:15px; color:#444; line-height:1.6;">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              Lamentamos informarte que tu cita veterinaria programada para  
              <strong>${fechaTexto}</strong> con <strong>${nombreMascota}</strong> ha sido
              <strong style="color:#9B2E45;">rechazada</strong>.
            </p>

            <div style="background:#fff4f4; padding:16px; border-left:6px solid #9B2E45; border-radius:12px; margin:18px 0;">
              <strong>Motivo:</strong><br/>
              ${motivo || "Sin motivo especificado."}
            </div>

            <p>
              Puedes volver a agendar otra cita cuando lo desees desde tu panel.
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
