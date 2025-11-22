"use client";

import {
    Mail,
    Phone,
    MapPin,
    UserCircle,
    PawPrint,
    BriefcaseBusiness,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UserModal({
    open,
    user,
    adopciones,
    solicitudesActivas,
    isLoading,
    onClose,
}: {
    open: boolean;
    user: any;
    adopciones: any[];
    solicitudesActivas: any[];
    isLoading: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 140, damping: 18 }}
                        className="w-full max-w-2xl bg-[#FFF8F2] rounded-3xl border border-[#EADACB] shadow-[0_25px_80px_rgba(0,0,0,0.28)] overflow-hidden"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <header className="flex items-center justify-between px-6 py-5 bg-[#FFEFE2] border-b border-[#F0D8C8]">
                            <h2 className="text-lg font-extrabold text-[#2B1B12] tracking-wide">
                                Información del usuario
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1.5 hover:bg-[#E0C7B6] transition text-[#BC5F36]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        {/* CONTENT */}
                        <div className="px-6 py-6 max-h-[72vh] overflow-y-auto space-y-10">

                            {/* ===== PERFIL ===== */}
                            {isLoading ? (
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="h-16 w-16 rounded-full border border-[#EADACB] bg-white grid place-items-center text-[#BC5F36] shadow-inner">
                                        <UserCircle className="h-9 w-9" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-extrabold text-[#2B1B12] leading-tight">
                                            {user.nombres} {user.apellido_paterno}{" "}
                                            {user.apellido_materno || ""}
                                        </h3>
                                        <p className="text-xs text-[#8B6F5D] mt-1">
                                            ID {user.id.slice(0, 6)}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ===== INFO DE CONTACTO ===== */}
                            <div className="space-y-4 bg-white border border-[#EADACB] rounded-2xl p-5 shadow-sm">
                                {isLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-4 w-60" />
                                        <Skeleton className="h-4 w-44" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                                        <h4 className="font-semibold text-[#BC5F36] text-sm tracking-wide border-b border-[#F3E8DC] pb-2 mb-3">
                                            Información de contacto
                                        </h4>

                                        <div className="space-y-3 text-sm text-[#2B1B12] mt-1">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-[#BC5F36]" />
                                                <span>{user.email}</span>
                                            </div>

                                            {user.telefono && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-[#BC5F36]" />
                                                    <span>{user.telefono}</span>
                                                </div>
                                            )}

                                            {user.ocupacion && (
                                                <div className="flex items-center gap-3">
                                                    <BriefcaseBusiness className="h-4 w-4 text-[#BC5F36]" />
                                                    <span>{user.ocupacion}</span>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-4 w-4 mt-1 text-[#BC5F36]" />
                                                {user.direccion ? (
                                                    <div className="leading-tight">
                                                        <p>
                                                            {user.direccion.calle}{" "}
                                                            {user.direccion.numero_exterior}{" "}
                                                            {user.direccion.colonia}
                                                        </p>
                                                        <p>
                                                            {user.direccion.municipio},{" "}
                                                            {user.direccion.estado},{" "}
                                                            CP {user.direccion.codigo_postal}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-[#8B6F5D]">Sin dirección registrada.</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* ===== MASCOTAS EN PROCESO ===== */}
                            <div className="space-y-3">
                                <h4 className="font-extrabold text-[#2B1B12] text-sm tracking-wide">
                                    Mascotas en proceso de adopción
                                </h4>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(Math.min((solicitudesActivas?.length || 1), 2))].map((_, i) => (
                                            <div key={i} className="flex gap-4 p-4 border border-[#EADACB] bg-white rounded-2xl">
                                                <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                                <div className="space-y-2 w-full">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : solicitudesActivas.length === 0 ? (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#8B6F5D] text-sm">
                                        No tiene solicitudes de adopción activas.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {solicitudesActivas.map((s: any) => (
                                            <div
                                                key={s.id}
                                                className="flex gap-4 border border-[#EADACB] bg-white rounded-2xl p-4 hover:shadow-md transition"
                                            >
                                                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-[#FFF4E7] border border-[#EADACB]">
                                                    {s.mascota?.imagen_url ? (
                                                        <img
                                                            src={
                                                                s.mascota.imagen_url.startsWith("http")
                                                                    ? s.mascota.imagen_url
                                                                    : "/placeholder.png"
                                                            }
                                                            alt={s.mascota.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full grid place-items-center text-[#BC5F36] opacity-70">
                                                            <PawPrint className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="font-semibold text-[#2B1B12] text-sm">{s.mascota?.nombre}</p>
                                                    <p className="text-xs text-[#8B6F5D]">
                                                        Fecha: {new Date(s.fecha_creada).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-[#BC5F36] font-semibold capitalize">
                                                        Estado: {s.estado.replace("_", " ")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* ===== ADOPCIONES ===== */}
                            <div className="space-y-3">
                                <h4 className="font-extrabold text-[#2B1B12] text-sm tracking-wide">
                                    Mascotas adoptadas
                                </h4>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(Math.min((adopciones?.length || 1), 2))].map((_, i) => (
                                            <div key={i} className="flex gap-4 p-4 border border-[#EADACB] bg-white rounded-2xl">
                                                <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                                <div className="space-y-2 w-full">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : adopciones.length === 0 ? (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#8B6F5D] text-sm">
                                        Este usuario no ha adoptado ninguna mascota.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {adopciones.map((a) => (
                                            <div
                                                key={a.id}
                                                className="flex gap-4 border border-[#EADACB] bg-white rounded-2xl p-4 hover:shadow-md transition"
                                            >
                                                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-[#FFF4E7] border border-[#EADACB]">
                                                    {a.imagen_url ? (
                                                        <img
                                                            src={
                                                                a.imagen_url.startsWith("http")
                                                                    ? a.imagen_url
                                                                    : "/placeholder.png"
                                                            }
                                                            alt={a.mascota_nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full grid place-items-center text-[#BC5F36] opacity-70">
                                                            <PawPrint className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="font-semibold text-[#2B1B12] text-sm">{a.mascota_nombre}</p>
                                                    <p className="text-xs text-[#8B6F5D]">Fecha: {a.fecha_adopcion}</p>
                                                    <p className="text-xs text-[#BC5F36] font-semibold capitalize">{a.estado}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
