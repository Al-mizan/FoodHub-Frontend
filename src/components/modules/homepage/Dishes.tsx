"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dish } from "@/types";
import { DishCardInteractive } from "./DishCardInteractive";
import { DishCardSkeleton } from "./DishCardSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface DishesProps {
    meals: Dish[];
    isLoading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    emptyMessage?: string;
}

export default function Dishes({
    meals,
    isLoading = false,
    hasMore = false,
    onLoadMore,
    emptyMessage = "No dishes available right now.",
}: DishesProps) {
    const { sentinelRef } = useInfiniteScroll({
        hasMore: hasMore && !!onLoadMore,
        isLoading,
        onLoadMore: onLoadMore ?? (() => {}),
    });

    return (
        <>
            {/* Dishes Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {meals.map((dish: Dish) => (
                    <DishCardInteractive key={dish.id} dish={dish} />
                ))}

                {/* Skeleton loading cards */}
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <DishCardSkeleton key={`dish-skeleton-${i}`} />
                    ))}
            </div>

            {/* Empty state */}
            {!isLoading && meals.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <SearchX className="size-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">
                        No dishes found
                    </h3>
                    <p className="text-sm text-muted-foreground/70 mt-1 max-w-md">
                        {emptyMessage}
                    </p>
                    <Link href="/" className="mt-4">
                        <Button variant="outline" size="sm">
                            Browse All Meals
                        </Button>
                    </Link>
                </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && onLoadMore && (
                <div ref={sentinelRef} className="h-1" />
            )}
        </>
    );
}
