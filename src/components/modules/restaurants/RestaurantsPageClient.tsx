"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Restaurant } from "@/types";
import { RestaurantCardSkeleton } from "@/components/modules/homepage/RestaurantCardSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { restaurantsClientService, type PaginatedMeta } from "@/services/restaurants-client.service";

const RestaurantCard = dynamic(
    () => import("@/components/modules/homepage/RestaurantCard").then((mod) => ({ default: mod.RestaurantCard })),
    { loading: () => <RestaurantCardSkeleton /> },
);

interface RestaurantsPageClientProps {
    initialRestaurants: Restaurant[];
    initialMeta: PaginatedMeta;
}

export default function RestaurantsPageClient({
    initialRestaurants,
    initialMeta,
}: RestaurantsPageClientProps) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [meta, setMeta] = useState<PaginatedMeta>(initialMeta);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasMore = meta.page < meta.totalPages;

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        setError(null);

        try {
            const nextPage = meta.page + 1;
            const result = await restaurantsClientService.getRestaurantsPaginated(nextPage, meta.limit);

            setRestaurants((prev) => [...prev, ...result.data]);
            setMeta(result.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more restaurants");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, meta.page, meta.limit]);

    const { sentinelRef } = useInfiniteScroll({
        hasMore,
        isLoading,
        onLoadMore: loadMore,
    });

    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">
                    All Restaurants
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {meta.total} restaurant{meta.total !== 1 ? "s" : ""} available
                </p>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                        <RestaurantCard restaurant={restaurant} />
                    </Link>
                ))}

                {/* Skeleton loading cards */}
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <RestaurantCardSkeleton key={`skeleton-${i}`} />
                    ))}
            </div>

            {/* Error state */}
            {error && (
                <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}

            {/* Empty state */}
            {!isLoading && restaurants.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                        No restaurants found
                    </h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                        No restaurants are available right now.
                    </p>
                </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-1" />}
        </section>
    );
}
