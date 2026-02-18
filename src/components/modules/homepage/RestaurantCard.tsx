"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Bike } from "lucide-react";
import Image from "next/image";
import { Restaurant } from "@/types";

export const RestaurantCard = memo(function RestaurantCard({
    restaurant,
}: {
    restaurant: Restaurant;
}) {
    return (
        <Card className="group overflow-hidden rounded-xl border bg-background p-0 gap-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted">
                {/* Discount Badge */}
                {restaurant?.discount_percent ? (
                    <Badge className="absolute left-3 top-3 z-10 bg-rose-500 hover:bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        ✓ Up to {restaurant.discount_percent}% off
                    </Badge>
                ) : null}

                {/* Image */}
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/70">
                    {restaurant?.banner_url && (
                        <Image
                            src={restaurant.banner_url}
                            alt={restaurant.restaurant_name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            width={400}
                            height={250}
                        />
                    )}
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
                            {restaurant.restaurant_name}
                            {restaurant.address && (
                                <span className="text-muted-foreground font-normal">
                                    {" "}– {restaurant.address}
                                </span>
                            )}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{restaurant.rating_avg}</span>
                    </div>
                </div>

                {/* Delivery + Free Delivery Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                    {/* Delivery Time */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>10-35 min</span>
                    </div>

                    {/* Free Delivery Info */}
                    <div className="flex items-center gap-1.5 font-medium text-rose-500">
                        <Bike className="size-4" />
                        <span>Tk{restaurant.freeDeliveryAmount}</span>
                        <span className="font-normal">Free for first order</span>
                    </div>
                </div>
            </div>
        </Card>
    );
});
