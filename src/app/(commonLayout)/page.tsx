import { Suspense } from "react";
import Cuisines from "../../components/modules/homepage/Cuisines";
import DishesSection from "../../components/modules/homepage/DishesSection";
import Restaurants from "../../components/modules/homepage/Restaurants";
import SearchBar from "../../components/modules/homepage/SearchBar";
import { dishesService } from "@/services/dishes.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeProps, Dish } from "@/types";
import { RestaurantCardSkeleton } from "@/components/modules/homepage/RestaurantCardSkeleton";


export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;
    const cuisineSlug = typeof params.cuisines === "string" ? params.cuisines : undefined;
    const search = typeof params.search === "string" ? params.search : undefined;

    // Sidebar filter params (synced from URL by AppSidebar)
    const cuisine = typeof params.cuisine === "string" ? params.cuisine : undefined;
    const minPrice = typeof params.minPrice === "string" ? params.minPrice : undefined;
    const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : undefined;
    const sortBy = typeof params.sortBy === "string" ? params.sortBy : undefined;
    const sortOrder = typeof params.sortOrder === "string" ? params.sortOrder : undefined;

    // Combine cuisine sources: Cuisines chip bar uses `cuisines`, sidebar uses `cuisine`
    const effectiveCuisine = cuisine ?? cuisineSlug;

    const isFiltering = !!(effectiveCuisine || search || minPrice || maxPrice || sortBy);

    // Build filter params for client-side pagination continuation
    const filterParams: Record<string, string> = {};
    if (effectiveCuisine) filterParams.cuisine = effectiveCuisine;
    if (search) filterParams.name = search;
    if (minPrice) filterParams.minPrice = minPrice;
    if (maxPrice) filterParams.maxPrice = maxPrice;
    if (sortBy) filterParams.sortBy = sortBy;
    if (sortOrder) filterParams.sortOrder = sortOrder;

    // Fetch dishes data server-side (limit to 9 for initial load)
    const dishesData = await dishesService.getAllDishes({
        ...filterParams,
        limit: "9",
    });

    const dishes: Dish[] = dishesData?.data ?? [];
    const dishesMeta = dishesData?.meta ?? null;

    const title = search
        ? `Results for "${search}"`
        : effectiveCuisine
            ? `Dishes — ${effectiveCuisine.replace(/-/g, " ").replace(/,/g, ", ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`
            : "Featured Dishes";

    const emptyMessage = search
        ? `We couldn't find any dishes matching "${search}". Try a different search term.`
        : "No dishes available for this cuisine right now.";

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <Suspense>
                <SearchBar />
            </Suspense>

            {/* Cuisines — always visible */}
            <Cuisines activeCuisine={cuisineSlug} />

            {/* When filtering: show only Dishes. Otherwise: show Restaurants + Dishes */}
            {!isFiltering && (
                <Suspense fallback={
                    <section className="py-8">
                        <div className="mb-6">
                            <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <RestaurantCardSkeleton key={i} />
                            ))}
                        </div>
                    </section>
                }>
                    <Restaurants />
                </Suspense>
            )}

            {/* Dishes Section */}
            <section className="py-4 sm:py-8">
                {/* Section Header */}
                <div className="mb-4 sm:mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">
                            {title}
                        </h2>
                        {isFiltering && dishesMeta && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {dishesMeta.total} dish{dishesMeta.total !== 1 ? "es" : ""} found
                            </p>
                        )}
                    </div>
                    {isFiltering && (
                        <Link href="/">
                            <Button variant="outline" className="cursor-pointer">
                                Clear Filters
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Error message */}
                {dishesData?.error?.message && (
                    <p className="text-red-500 mb-4">{dishesData.error.message}</p>
                )}

                {/* Dishes grid with lazy loading */}
                <DishesSection
                    key={JSON.stringify(filterParams)}
                    initialDishes={dishes}
                    initialMeta={dishesMeta}
                    emptyMessage={emptyMessage}
                    filterParams={Object.keys(filterParams).length > 0 ? filterParams : undefined}
                />
            </section>
        </div>
    );
}
