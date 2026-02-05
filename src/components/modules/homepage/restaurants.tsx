import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Clock, Bike } from "lucide-react";

// Sample restaurants data - replace with your actual data
const restaurantsData = [
    {
        id: 1,
        name: "Arabika Coffee",
        location: "Gulshan",
        image: "/images/restaurants/arabika.jpg",
        rating: 4.8,
        reviewCount: "100+",
        deliveryTime: "10-35 min",
        priceRange: "৳৳৳",
        cuisine: "Cafe",
        freeDeliveryAmount: 35,
        offerText: "Tk. 150 off Tk. 450: ...",
        discountPercent: null,
        isAd: true,
        isFavorite: false,
    },
    {
        id: 2,
        name: "Pagla Baburchi",
        location: "Banani",
        image: "/images/restaurants/pagla.jpg",
        rating: 4.9,
        reviewCount: "5000+",
        deliveryTime: "10-35 min",
        priceRange: "৳৳৳",
        cuisine: "Bangladeshi",
        freeDeliveryAmount: 44,
        offerText: "Tk. 150 off Tk. 550: ...",
        discountPercent: null,
        isAd: true,
        isFavorite: false,
    },
    {
        id: 3,
        name: "Almajlis Arabian Restaurant",
        location: null,
        image: "/images/restaurants/almajlis.jpg",
        rating: 4.9,
        reviewCount: "100+",
        deliveryTime: "10-35 min",
        priceRange: "৳৳৳",
        cuisine: "Middle Eastern",
        freeDeliveryAmount: 35,
        offerText: null,
        discountPercent: null,
        isAd: true,
        isFavorite: false,
    },
    {
        id: 4,
        name: "Delifrance",
        location: "Casablanca",
        image: "/images/restaurants/delifrance.jpg",
        rating: 4.9,
        reviewCount: "1000+",
        deliveryTime: "10-35 min",
        priceRange: "৳৳৳",
        cuisine: "Cakes",
        freeDeliveryAmount: 44,
        offerText: "Tk. 150 off Tk. 450: ...",
        discountPercent: 16,
        isAd: true,
        isFavorite: false,
    },
    {
        id: 5,
        name: "Special Bhai Bhai Biriyani House",
        location: null,
        image: "/images/restaurants/bhaibhai.jpg",
        rating: 4.1,
        reviewCount: "1000+",
        deliveryTime: "25-50 min",
        priceRange: "৳৳",
        cuisine: "Biryani",
        freeDeliveryAmount: 44,
        offerText: "15% off Tk. 50",
        discountPercent: null,
        isAd: true,
        isFavorite: false,
    },
    {
        id: 6,
        name: "Royal Treat – By Ascott Palace",
        location: null,
        image: "/images/restaurants/royal.jpg",
        rating: 5,
        reviewCount: "500+",
        deliveryTime: "25-50 min",
        priceRange: "৳৳৳",
        cuisine: "Asian",
        freeDeliveryAmount: 25,
        offerText: null,
        discountPercent: null,
        isAd: true,
        isFavorite: false,
    },
];

// Restaurant Card Component
function RestaurantCard({
    restaurant,
}: {
    restaurant: (typeof restaurantsData)[0];
}) {
    return (
        <Card className="group overflow-hidden rounded-xl border-0 bg-background p-0 gap-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                {/* Offer Badge - Top Left
                {restaurant.offerText && (
                    <Badge className="absolute left-3 top-3 z-10 bg-rose-500 hover:bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        🏷️ {restaurant.offerText}
                    </Badge>
                )} */}

                {/* Discount Badge - Below Offer */}
                {restaurant.discountPercent && (
                    <Badge className="absolute left-3 top-3 z-10 bg-rose-500 hover:bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        ✓ Up to {restaurant.discountPercent}% off
                    </Badge>
                )}

                {/* Favorite Button - Top Right */}
                {/* <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3 z-10 size-9 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110"
                >
                    <Heart className="size-5 text-gray-600 hover:text-rose-500 transition-colors" />
                    <span className="sr-only">Add to favorites</span>
                </Button> */}

                {/* Ad Badge - Bottom Right */}
                {/* {restaurant.isAd && (
                    <Badge className="absolute right-3 bottom-3 z-10 bg-gray-800/70 hover:bg-gray-800/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                        Ad
                    </Badge>
                )} */}

                {/* Placeholder Image */}
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/70">
                    <span className="text-sm text-muted-foreground">Restaurant Image</span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
            </div>

            {/* Content */}
            <div className="space-y-1.5 pt-3 p-4">
                {/* Restaurant Name & Rating Row */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base leading-tight line-clamp-1 flex items-center gap-1.5">
                        <span className="text-lg">🍽️</span>
                        <span>
                            {restaurant.name}
                            {restaurant.location && (
                                <span className="text-muted-foreground font-normal">
                                    {" "}– {restaurant.location}
                                </span>
                            )}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                        {/* <span className="text-sm text-muted-foreground">
                            ({restaurant.reviewCount})
                        </span> */}
                    </div>
                </div>

                {/* Delivery Time, Price Range, Cuisine */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>{restaurant.deliveryTime}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{restaurant.priceRange}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{restaurant.cuisine}</span>
                </div>

                {/* Free Delivery Info */}
                <div className="flex items-center gap-1.5 text-sm">
                    <Bike className="size-4 text-rose-500" />
                    <span className="text-rose-500 font-medium">
                        Tk{restaurant.freeDeliveryAmount}
                    </span>
                    <span className="text-rose-500">Free for first order</span>
                </div>
            </div>
        </Card>
    );
}

export default function Restaurants() {
    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        All restaurants
                    </h2>
                </div>
                <Button variant="outline" className="hidden sm:flex">
                    View All
                </Button>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurantsData.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-6 flex justify-center sm:hidden">
                <Button variant="outline" className="w-full max-w-xs">
                    View All Restaurants
                </Button>
            </div>
        </section>
    );
}