import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, Store, SearchX } from "lucide-react";
import Link from "next/link";
import { dishesService } from "@/services/dishes.service";
import Image from "next/image";
import { Dish } from "@/types";


// Star rating component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`size-4 ${star <= Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : star - 0.5 <= rating
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "fill-muted text-muted-foreground"
                        }`}
                />
            ))}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
                {rating}
            </span>
        </div>
    );
}

// Dish Card Component
function DishCard({
    dish,
}: {
    dish: Dish;
}) {

    return (
        <Card className="group overflow-hidden rounded-xl border bg-background p-0 gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">

                {dish.isNew && (
                    <Badge className="absolute left-3 top-3 z-10 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1">
                        New
                    </Badge>
                )}

                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/70">
                    <Image
                        src={dish.image_url}
                        alt={dish.name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        width={400}
                        height={250}
                    />
                </div>

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </div>



            {/* Content */}
            <CardContent className="space-y-1 px-4 py-3">
                {/* Title */}
                <h3 className="line-clamp-1 text-sm font-semibold">
                    {dish.name}
                </h3>

                {/* Price Row (Left / Right) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {dish.discount_percentage ? (
                            <span className="text-lg font-bold text-primary">
                                ৳{((dish.price) / (1 - dish.discount_percentage / 100)).toFixed(2)}
                            </span>) : null
                        }
                        <span className={`${dish.discount_percentage ? "text-xs text-muted-foreground line-through" : "text-lg font-bold text-primary"}`}>
                            ৳{dish.price.toFixed(2)}
                        </span>
                    </div>
                    {
                        dish.discount_percentage ? (<Badge
                            variant="outline"
                            className="border-rose-200 bg-rose-50 text-rose-600 text-[11px] font-semibold"
                        >
                            -{dish.discount_percentage}%
                        </Badge>) : null
                    }
                </div>

                {/* Rating + Orders */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <StarRating rating={(Number(dish.rating_sum) / Number(dish.rating_count)) || 0} />
                </div>

                {/* Restaurant & Delivery */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Store className="size-4" />
                        <span className="line-clamp-1">{dish.restaurant_name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        <span>{dish.preparation_time}</span>
                    </div>
                </div>
            </CardContent>

            {/* Actions */}
            <CardFooter className="flex gap-2 px-4 pt-0 pb-4">
                <Button
                    size="sm"
                    className="flex-1 gap-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                >
                    <ShoppingCart className="size-4" />
                    Add
                </Button>
            </CardFooter>
        </Card>
    );
}


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
                        <Link key={dish.id} href={`/meals/${dish.id}`}>
                            <DishCard key={dish.id} dish={dish} />
                        </Link>
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