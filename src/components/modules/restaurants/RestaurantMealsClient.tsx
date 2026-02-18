"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Dish, Restaurant } from "@/types";
import { DishCardSkeleton } from "@/components/modules/homepage/DishCardSkeleton";
import { dishesClientService, type PaginatedMeta } from "@/services/dishes-client.service";

const Dishes = dynamic(
    () => import("@/components/modules/homepage/Dishes"),
    {
        loading: () => (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <DishCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
        ),
    },
);

interface RestaurantMealsClientProps {
    restaurant: Restaurant;
    initialMeals: Dish[];
    initialMeta: PaginatedMeta;
}

export default function RestaurantMealsClient({
    restaurant,
    initialMeals,
    initialMeta,
}: RestaurantMealsClientProps) {
    const [meals, setMeals] = useState<Dish[]>(initialMeals);
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
            const result = await dishesClientService.getDishesByRestaurantPaginated(
                restaurant.user_id,
                nextPage,
                meta.limit,
            );

            // Add restaurant_name to each dish
            const mealsWithRestaurant = result.data.map((dish) => ({
                ...dish,
                restaurant_name: dish.restaurant_name ?? restaurant.restaurant_name,
            }));

            setMeals((prev) => [...prev, ...mealsWithRestaurant]);
            setMeta(result.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more dishes");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, meta.page, meta.limit, restaurant.user_id, restaurant.restaurant_name]);

    return (
        <section className="py-8">
            {/* Restaurant Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-medium tracking-tight">
                    {restaurant.restaurant_name}
                </h2>
                {restaurant.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {restaurant.description}
                    </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                    {meta.total} dish{meta.total !== 1 ? "es" : ""} available
                </p>
            </div>

            {/* Dishes Grid (reusable component) */}
            <Dishes
                meals={meals}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                emptyMessage={`No dishes available from ${restaurant.restaurant_name} right now.`}
            />

            {/* Error state */}
            {error && (
                <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}
        </section>
    );
}
