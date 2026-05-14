"use client";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MascotaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#eadacb] bg-white shadow-sm overflow-hidden">
      <Skeleton className="aspect-[5/4] rounded-none" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
