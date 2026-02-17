import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { dishesService } from "@/services/dishes.service";
import { Dish } from "@/types";
import { DishCardInteractive } from "./DishCardInteractive";



interface DishesProps {
    cuisineSlug?: string;
    search?: string;
}

export default async function Dishes({ cuisineSlug, search }: DishesProps) {
    const isFiltering = !!(cuisineSlug || search);

    const dishesData = await dishesService.getAllDishes({
        ...(cuisineSlug ? { cuisine_slug: cuisineSlug } : {}),
        ...(search ? { search } : {}),
    });

    const title = search
        ? `Results for "${search}"`
        : cuisineSlug
            ? `Dishes — ${cuisineSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
            : "Featured Dishes";

    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-medium tracking-tight">
                        {title}
                    </h2>
                    {isFiltering && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {dishesData?.data?.length ?? 0} dish{(dishesData?.data?.length ?? 0) !== 1 ? "es" : ""} found
                        </p>
                    )}
                </div>
                {!isFiltering && (
                    <Link href="/meals" className="hidden sm:inline-flex">
                        <Button variant="outline" className="cursor-pointer">
                            View All
                        </Button>
                    </Link>
                )}
                {isFiltering && (
                    <Link href="/">
                        <Button variant="outline" className="cursor-pointer">
                            Clear Filters
                        </Button>
                    </Link>
                )}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* if the message is error  */}
                {dishesData?.error?.message ? (
                    <p className="text-red-500">{dishesData?.error?.message}</p>
                ) : null}

                {dishesData?.data && dishesData.data.length > 0 ? (
                    dishesData.data.map((dish: Dish) => (
                        <DishCardInteractive key={dish.id} dish={dish} />
                    ))
                ) : (
                    !dishesData?.error?.message && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <SearchX className="size-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                No dishes found
                            </h3>
                            <p className="text-sm text-muted-foreground/70 mt-1 max-w-md">
                                {search
                                    ? `We couldn't find any dishes matching "${search}". Try a different search term.`
                                    : "No dishes available for this cuisine right now."}
                            </p>
                            <Link href="/" className="mt-4">
                                <Button variant="outline" size="sm">
                                    Browse All Meals
                                </Button>
                            </Link>
                        </div>
                    )
                )}
            </div>

            {/* Mobile View All Button — only when not filtering */}
            {!isFiltering && (
                <div className="mt-6 flex justify-center sm:hidden">
                    <Link href="/meals" className="w-full max-w-xs">
                        <Button variant="outline" className="w-full">
                            View All Dishes
                        </Button>
                    </Link>
                </div>
            )}
        </section>
    );
}