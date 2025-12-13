"use client";

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header */}
            <div>
                <div className="h-7 w-64 bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-80 bg-slate-200 rounded"></div>
            </div>

            {/* Botones rápidos */}
            <div className="flex flex-wrap gap-3">
                <div className="h-8 w-32 bg-slate-200 rounded"></div>
                <div className="h-8 w-32 bg-slate-200 rounded"></div>
                <div className="h-8 w-32 bg-slate-200 rounded"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-24 bg-slate-200 rounded-xl"></div>
            </div>

            {/* Pendientes */}
            <div className="rounded-2xl border border-slate-200 p-6">
                <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                </div>
            </div>

            {/* Actividad */}
            <div className="rounded-2xl border border-slate-200 p-6">
                <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
