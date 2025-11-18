// @ts-check

export default function documentacionRechazada({ nombre, razon }) {
  return {
    subject: "Documentación rechazada ❗",
    body: `
      <html>
      <body style="font-family:Arial;background:#faf6f6;padding:20px;">

        <table align="center" width="480"
          style="background:#fff;border-radius:14px;padding:30px;">

          <tr><td style="text-align:center;">
            <img src="https://caamorelia.vercel.app/logo.png" width="120"/>
            <h2 style="color:#9B2E45;font-weight:900;">
              Documentación rechazada
            </h2>
          </td></tr>

          <tr><td>

            <p>Hola <strong>${nombre}</strong>,</p>

            <p>
              Tu documentación no pudo ser aprobada.
            </p>

            <p><strong>Motivo:</strong> ${razon}</p>

            <p style="color:#555;">
              Por favor, vuelve a subir tus documentos cuando lo consideres listo.
            </p>

            <p style="text-align:center;margin:25px 0;">
              <a href="https://caamorelia.vercel.app"
                style="background:#8B4513;color:white;padding:14px 26px;
                border-radius:10px;text-decoration:none;font-weight:bold;">
                Subir documentos de nuevo
              </a>
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
