"use client";

export default function MascotaCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden animate-pulse">
            {/* Imagen */}
            <div className="h-48 bg-slate-200" />

            {/* Contenido */}
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />

                <div className="pt-3">
                    <div className="h-9 bg-slate-200 rounded-lg w-full" />
                </div>
            </div>
        </div>
    );
}
