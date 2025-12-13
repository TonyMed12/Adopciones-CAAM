"use client";

import { Card } from "@/components/ui/card";

function Line({ w = "w-full" }: { w?: string }) {
    return (
        <div className={`h-4 ${w} rounded-md bg-[#ead7c6] animate-pulse`} />
    );
}

function Title() {
    return (
        <div className="h-6 w-48 rounded-md bg-[#e2cbb3] animate-pulse mb-4" />
    );
}

export default function PerfilSkeleton() {
    return (
        <div className="space-y-6">
            {/* ===== Datos personales ===== */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <Title />
                    <div className="h-9 w-24 rounded-full bg-[#e2cbb3] animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Line w="w-40" />
                    <Line w="w-48" />
                    <Line w="w-32" />
                    <Line w="w-56" />
                    <Line w="w-36" />
                    <Line w="w-44" />
                    <Line w="w-40" />
                </div>
            </Card>

            {/* ===== Dirección ===== */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <Title />
                    <div className="h-9 w-24 rounded-full bg-[#e2cbb3] animate-pulse" />
                </div>

                <div className="space-y-2">
                    <Line w="w-3/4" />
                    <Line w="w-2/3" />
                    <Line w="w-24" />
                </div>
            </Card>

            {/* ===== Solicitudes ===== */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <Title />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 rounded-xl bg-[#ead7c6] animate-pulse"
                        />
                    ))}
                </div>
            </Card>

            {/* ===== Mascotas ===== */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <Title />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 rounded-2xl bg-[#ead7c6] animate-pulse"
                        />
                    ))}
                </div>
            </Card>

            {/* ===== Documentos ===== */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <Title />
                <div className="grid sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 rounded-lg bg-[#ead7c6] animate-pulse"
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
