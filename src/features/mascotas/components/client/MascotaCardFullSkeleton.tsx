"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export default function MascotaCardFullSkeleton() {
    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-[#FFF8F2] rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border-[4px] border-[#FF8414]"
        >
            {/* Imagen */}
            <div className="relative h-full bg-[#F4E5D5]">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>

                <Skeleton className="h-6 w-52 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-40" />
                </div>

                <Skeleton className="h-6 w-44 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </motion.article>
    );
}
