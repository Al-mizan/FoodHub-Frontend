import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, Store } from "lucide-react";
import Link from "next/link";
import { dishesService } from "@/services/dishes.service";
import Image from "next/image";
import { Dish } from "@/types";


const dishesData = await dishesService.getAllDishes();

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

                    {/* <div className="flex items-center gap-1.5">
                        <TrendingUp className="size-4" />
                        <span>{dish.ordersThisWeek}/week</span>
                    </div> */}
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


export default function Dishes() {
    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-medium tracking-tight">
                        Featured Dishes
                    </h2>
                </div>
                <Link href="/meals" className="hidden sm:inline-flex">
                    <Button variant="outline" className="cursor-pointer">
                        View All
                    </Button>
                </Link>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* if the message is error  */}
                {dishesData?.error?.message ? (
                    <p className="text-red-500">{dishesData?.error?.message}</p>
                ) : null}

                {dishesData?.data?.map((dish: Dish) => (
                    <Link key={dish.id} href={`/dishes/${dish.id}`}>
                        <DishCard key={dish.id} dish={dish} />
                    </Link>
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-6 flex justify-center sm:hidden">
                <Link href="/meals" className="w-full max-w-xs">
                    <Button variant="outline" className="w-full">
                        View All Dishes
                    </Button>
                </Link>
            </div>
        </section>
    );
}