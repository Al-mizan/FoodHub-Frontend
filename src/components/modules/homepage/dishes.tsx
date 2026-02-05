import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Clock, Store, TrendingUp } from "lucide-react";

// Sample dishes data - replace with your actual data
const dishesData = [
    {
        id: 1,
        name: "Grilled Salmon with Herbs",
        image: "/images/dishes/salmon.jpg",
        price: 24.99,
        originalPrice: 32.99,
        discount: 24,
        rating: 4.8,
        ordersThisWeek: 234,
        restaurant: "Ocean Delights",
        deliveryTime: "25-30 min",
        isNew: true,
    },
    {
        id: 2,
        name: "Classic Margherita Pizza",
        image: "/images/dishes/pizza.jpg",
        price: 18.99,
        originalPrice: 24.99,
        discount: 24,
        rating: 4.7,
        ordersThisWeek: 189,
        restaurant: "Italian Kitchen",
        deliveryTime: "20-25 min",
        isNew: true,
    },
    {
        id: 3,
        name: "Spicy Thai Green Curry",
        image: "/images/dishes/curry.jpg",
        price: 16.99,
        originalPrice: 21.99,
        discount: 23,
        rating: 4.5,
        ordersThisWeek: 154,
        restaurant: "Thai Express",
        deliveryTime: "30-35 min",
        isNew: false,
    },
    {
        id: 4,
        name: "Gourmet Beef Burger",
        image: "/images/dishes/burger.jpg",
        price: 14.99,
        originalPrice: 18.99,
        discount: 21,
        rating: 4.6,
        ordersThisWeek: 312,
        restaurant: "Burger House",
        deliveryTime: "15-20 min",
        isNew: true,
    },
    {
        id: 5,
        name: "Fresh Caesar Salad",
        image: "/images/dishes/salad.jpg",
        price: 12.99,
        originalPrice: 15.99,
        discount: 19,
        rating: 4.4,
        ordersThisWeek: 98,
        restaurant: "Green Kitchen",
        deliveryTime: "10-15 min",
        isNew: false,
    },
    {
        id: 6,
        name: "Sushi Platter Deluxe",
        image: "/images/dishes/sushi.jpg",
        price: 34.99,
        originalPrice: 44.99,
        discount: 22,
        rating: 4.9,
        ordersThisWeek: 176,
        restaurant: "Tokyo Sushi",
        deliveryTime: "35-40 min",
        isNew: true,
    },
];

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
    dish: (typeof dishesData)[0];
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
                    <span className="text-xs text-muted-foreground">Dish Image</span>
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
                        <span className="text-lg font-bold text-primary">
                            ${dish.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                            ${dish.originalPrice.toFixed(2)}
                        </span>
                    </div>

                    <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-rose-600 text-[11px] font-semibold"
                    >
                        -{dish.discount}%
                    </Badge>
                </div>

                {/* Rating + Orders */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <StarRating rating={dish.rating} />

                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="size-4" />
                        <span>{dish.ordersThisWeek}/week</span>
                    </div>
                </div>

                {/* Restaurant & Delivery */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Store className="size-4" />
                        <span className="line-clamp-1">{dish.restaurant}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        <span>{dish.deliveryTime}</span>
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
                <Button variant="outline" className="hidden sm:flex">
                    View All
                </Button>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dishesData.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-6 flex justify-center sm:hidden">
                <Button variant="outline" className="w-full max-w-xs">
                    View All Dishes
                </Button>
            </div>
        </section>
    );
}