"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function UserModalSkeleton({ open, onClose }: { open: boolean; onClose: () => void }) {
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
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </header>

                        {/* CONTENT */}
                        <div className="px-6 py-6 max-h-[72vh] overflow-y-auto space-y-10">
                            
                            {/* PERFIL */}
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>

                            {/* INFO DE CONTACTO */}
                            <div className="space-y-4 bg-white border border-[#EADACB] rounded-2xl p-5 shadow-sm">
                                <Skeleton className="h-4 w-48 mb-2" />

                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-60" />
                                    <Skeleton className="h-4 w-44" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>

                            {/* SOLICITUDES ACTIVAS */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-48" />
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="flex gap-4 border border-[#EADACB] bg-white rounded-2xl p-4"
                                        >
                                            <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ADOPCIONES */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-48" />
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="flex gap-4 border border-[#EADACB] bg-white rounded-2xl p-4"
                                        >
                                            <Skeleton className="h-[80px] w-[80px] rounded-xl" />
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
