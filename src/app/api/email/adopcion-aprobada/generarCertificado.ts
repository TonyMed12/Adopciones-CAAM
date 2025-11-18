import { renderToBuffer } from "@react-pdf/renderer";
import CertificadoPDF from "@/components/certificados/CertificadoPDF";
import dayjs from "dayjs";


export async function generarCertificadoPDF({
  adoptante,
  mascota,
  fechaAdopcion,
}) {
  const fecha = dayjs(fechaAdopcion).format("DD/MM/YYYY");

  const pdfDoc = (
    <CertificadoPDF
      adoptante={adoptante}
      mascota={{
        nombre: mascota.nombre,
        foto: mascota.foto,
        id: mascota.id,
      }}
      fecha={fecha}
    />
  );

  const buffer = await renderToBuffer(pdfDoc);
  return buffer;
}
