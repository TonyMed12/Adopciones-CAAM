"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import CertificadoPDF from "@/components/certificados/CertificadoPDF";
import { Button } from "@/components/ui/Button";
import dayjs from "dayjs";

export default function CertificadoModal({ open, onClose, mascota }) {
  if (!mascota) return null;

  // Datos reales desde mascotas_adoptadas
  const adoptante = mascota.adoptante_nombre; 
  const nombreMascota = mascota.mascota_nombre;
  const fotoMascota = mascota.imagen_url;
  const idAdopcion = mascota.adopcion_id;

  const fecha = dayjs(mascota.fecha_adopcion).format("DD/MM/YYYY");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-white p-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#8b4513]">
            Certificado de Adopción – {nombreMascota}
          </DialogTitle>
        </DialogHeader>

        {/* Vista previa del PDF */}
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <PDFViewer width="100%" height="100%">
            <CertificadoPDF
              adoptante={adoptante}
              mascota={{
                nombre: nombreMascota,
                foto: fotoMascota,
                id: idAdopcion,
              }}
              fecha={fecha}
            />
          </PDFViewer>
        </div>

        {/* Botón de descarga */}
        <div className="mt-4 text-center">
          <PDFDownloadLink
            document={
              <CertificadoPDF
                adoptante={adoptante}
                mascota={{
                  nombre: nombreMascota,
                  foto: fotoMascota,
                  id: idAdopcion,
                }}
                fecha={fecha}
              />
            }
            fileName={`Certificado-Adopcion-${nombreMascota}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl">
                {loading ? "Generando PDF..." : "Descargar Certificado PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
