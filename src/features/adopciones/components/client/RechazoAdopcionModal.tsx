"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";

export function RechazoAdopcionModal({
  open,
  motivo,
  onChangeMotivo,
  onClose,
  onConfirm,
}: {
  open: boolean;
  motivo: string;
  onChangeMotivo: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#8B4513]">Rechazar adopción</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mb-2">
          Escribe el motivo del rechazo. Este texto se guardará en el sistema y se enviará al adoptante por correo.
        </p>

        <Textarea
          placeholder="Ej. El espacio del hogar no es suficiente para esta mascota…"
          value={motivo}
          onChange={(e) => onChangeMotivo(e.target.value)}
          className="min-h-[120px]"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" type="button" onClick={onConfirm}>
            Confirmar rechazo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
