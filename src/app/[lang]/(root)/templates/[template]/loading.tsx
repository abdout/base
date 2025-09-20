import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="layout-container min-h-screen">
      <div className="space-y-6 py-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Control bar skeleton */}
        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Preview skeleton */}
        <div className="aspect-video w-full rounded-lg border bg-muted">
          <div className="flex h-full items-center justify-center">
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-12 w-12 rounded-full" />
              <Skeleton className="mx-auto h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}