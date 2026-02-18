import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DishCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-xl border bg-background p-0 gap-0">
            {/* Image skeleton */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content skeleton */}
            <CardContent className="space-y-2 px-4 py-3">
                {/* Title */}
                <Skeleton className="h-4 w-3/4" />

                {/* Price row */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="size-4 rounded-full" />
                    ))}
                    <Skeleton className="ml-1 h-3 w-6" />
                </div>

                {/* Restaurant & delivery */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </CardContent>

            {/* Footer skeleton */}
            <CardFooter className="px-4 pt-0 pb-4">
                <Skeleton className="h-8 w-full rounded-lg" />
            </CardFooter>
        </Card>
    );
}
