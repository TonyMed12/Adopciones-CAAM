"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ModalLoginRequired({ open, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal open={open} onClose={onClose}>
            <div className="p-8 space-y-6 text-center">
                <div className="text-4xl">🔐</div>

                <h2 className="text-xl font-extrabold text-[#2b1b12]">
                    Inicia sesión para adoptar
                </h2>

                <p className="text-sm text-[#7a5c49]">
                    Necesitas una cuenta para comenzar el proceso de adopción.
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => router.push("/login")}
                        className="cursor-pointer"
                    >
                        Iniciar sesión
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => router.push("/registro")}
                        className="cursor-pointer"
                    >
                        Crear cuenta
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
