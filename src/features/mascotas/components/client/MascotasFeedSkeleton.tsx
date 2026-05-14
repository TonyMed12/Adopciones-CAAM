"use client";

import MascotaCardSkeleton from "./MascotaCardSkeleton";

export default function MascotasFeedSkeleton() {
    return (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <MascotaCardSkeleton key={i} />
            ))}
        </div>
    );
}
