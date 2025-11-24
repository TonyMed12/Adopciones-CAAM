import { Skeleton } from "@/components/ui/Skeleton";

export default function UserTableSkeleton() {
  return (
    <div className="w-full border border-[#EADACB] rounded-xl bg-white p-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Rows skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border border-[#EADACB] rounded-xl p-3"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
