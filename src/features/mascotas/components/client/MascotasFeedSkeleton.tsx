"use client";

import MascotaCardSkeleton from "./MascotaCardSkeleton";

export default function MascotasFeedSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <MascotaCardSkeleton key={i} />
            ))}
        </div>
    );
}
