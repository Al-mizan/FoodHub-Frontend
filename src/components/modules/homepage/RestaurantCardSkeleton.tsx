import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-xl border bg-background p-0 gap-0 shadow-none">
            {/* Image skeleton */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-2 pt-3 p-4">
                {/* Name & rating */}
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-1 shrink-0">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                </div>

                {/* Delivery + free delivery row */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
        </Card>
    );
}
