"use client";

import React from "react";

export function StatCard({
    label,
    value,
    icon,
    color,
    onClick,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void;
}) {
    const hasAlert = value > 0 && label !== "Mascotas adoptables";

    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border p-5 transition hover:shadow-md cursor-pointer ${hasAlert
                ? "border-[#BC5F36]/40 bg-[#fff8f4]"
                : "border-slate-100 bg-white"
                }`}
            style={{ boxShadow: "0 10px 30px rgba(2,6,23,.05)" }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm">{label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                </div>

                <div
                    className={`p-3 rounded-xl ${color ?? "bg-orange-100 text-[#BC5F36]"}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
