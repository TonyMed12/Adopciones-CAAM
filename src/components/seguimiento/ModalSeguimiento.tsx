"use client";

import ModalPremium from "@/components/ui/ModalPremium";

export default function ModalSeguimiento({
  open,
  onClose,
  titulo,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <ModalPremium
      open={open}
      onClose={onClose}
      title={titulo}
      maxWidth="max-w-2xl"
      bg="bg-[#FFF8F0]"
      border="border-[#E5D1B8]"
      padding="p-5"
    >
      {children}
    </ModalPremium>
  );
}
