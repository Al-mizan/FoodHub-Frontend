import { Suspense } from "react";
import Cuisines from "../../components/modules/homepage/Cuisines";
import Dishes from "../../components/modules/homepage/Dishes";
import Restaurants from "../../components/modules/homepage/Restaurants";
import SearchBar from "../../components/modules/homepage/SearchBar";
import { dishesService } from "@/services/dishes.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeProps, Dish } from "@/types";


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

    // Fetch dishes data server-side
    const dishesData = await dishesService.getAllDishes({
        ...(effectiveCuisine ? { cuisine: effectiveCuisine } : {}),
        ...(search ? { name: search } : {}),
        ...(minPrice ? { minPrice } : {}),
        ...(maxPrice ? { maxPrice } : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(sortOrder ? { sortOrder } : {}),
    });

    const dishes: Dish[] = dishesData?.data ?? [];

    const title = search
        ? `Results for "${search}"`
        : effectiveCuisine
            ? `Dishes — ${effectiveCuisine.replace(/-/g, " ").replace(/,/g, ", ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`
            : "Featured Dishes";

    const emptyMessage = search
        ? `We couldn't find any dishes matching "${search}". Try a different search term.`
        : "No dishes available for this cuisine right now.";

    return (
        <div className="space-y-2">
            {/* Search Bar */}
            <Suspense>
                <SearchBar />
            </Suspense>

            {/* Cuisines — always visible */}
            <Cuisines activeCuisine={cuisineSlug} />

            {/* When filtering: show only Dishes. Otherwise: show Restaurants + Dishes */}
            {!isFiltering && <Restaurants />}

            {/* Dishes Section */}
            <section className="py-8">
                {/* Section Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-medium tracking-tight">
                            {title}
                        </h2>
                        {isFiltering && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {dishes.length} dish{dishes.length !== 1 ? "es" : ""} found
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

                {/* Dishes grid (pure UI component) */}
                <Dishes meals={dishes} emptyMessage={emptyMessage} />
            </section>
        </div>
    );
}
