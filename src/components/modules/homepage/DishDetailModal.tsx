"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Clock, Store, Star } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/hooks/useAuth";
import { DishDetailModalProps } from "@/types";


export const DishDetailModal = memo(function DishDetailModal({
    dish,
    open,
    onOpenChange,
}: DishDetailModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const rating = Number(dish.rating_sum) / Number(dish.rating_count) || 0;

    // dish.price is the final selling price; recover original when discounted
    const hasDiscount = !!dish.discount_percentage;
    const originalPrice = hasDiscount
        ? dish.price / (1 - dish.discount_percentage! / 100)
        : null;
    const sellingPrice = dish.price;
    const subtotal = sellingPrice * quantity;

    const increment = useCallback(() => setQuantity((q) => q + 1), []);
    const decrement = useCallback(
        () => setQuantity((q) => Math.max(1, q - 1)),
        []
    );

    const handleAddToCart = useCallback(async () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }

        setIsAdding(true);
        try {
            const result = await addToCart(dish.id, quantity);

            if (result.success) {
                toast.success(`Added ${quantity}× ${dish.name} to cart`);
                setQuantity(1);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to add to cart");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsAdding(false);
        }
    }, [dish.id, dish.name, quantity, isAuthenticated, addToCart, onOpenChange]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setQuantity(1);
                onOpenChange(isOpen);
            }}
        >
            <DialogContent className="max-h-[90dvh] overflow-hidden p-0 gap-0 sm:max-w-xl rounded-2xl">
                {/* Scrollable area */}
                <div className="overflow-y-auto max-h-[calc(90dvh-100px)]">
                    {/* Hero image */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                        <Image
                            src={dish.image_url}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 640px) 100vw, 576px"
                        />
                        {dish.isNew && (
                            <Badge className="absolute left-3 top-3 z-10 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 shadow">
                                New
                            </Badge>
                        )}
                        {hasDiscount && (
                            <Badge className="absolute left-3 bottom-3 z-10 border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold px-2.5 py-1 shadow">
                                -{dish.discount_percentage}% OFF
                            </Badge>
                        )}
                        {
                            dish.discount_price != null && dish.discount_price > 0 && (
                                <Badge
                                    variant="outline"
                                    className="absolute left-3 bottom-3 z-10 border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold px-2.5 py-1 shadow"
                                >
                                    -&#2547;{dish.discount_price.toFixed(2)}
                                </Badge>
                            )
                        }
                    </div>

                    {/* Details */}
                    <div className="space-y-4 p-5 sm:p-6">
                        <DialogHeader className="gap-1">
                            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                                {dish.name}
                            </DialogTitle>
                            {dish.restaurant_name && (
                                <DialogDescription asChild>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Store className="size-4 shrink-0" />
                                        <span>{dish.restaurant_name}</span>
                                    </div>
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-primary">
                                ৳{sellingPrice.toFixed(2)}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    ৳{originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Meta: Rating & Prep time */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                            {rating > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium text-foreground">
                                        {rating.toFixed(1)}
                                    </span>
                                    <span>({dish.rating_count} ratings)</span>
                                </div>
                            )}
                            {dish.preparation_time > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="size-4" />
                                    <span>{dish.preparation_time} min</span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Description */}
                        {dish.description && (
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">
                                    Description
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {dish.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky footer — quantity + add to cart */}
                <div className="border-t bg-background px-5 py-4 sm:px-6 -mt-4">
                    <div className="flex items-center justify-between mb-3">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-9 rounded-full cursor-pointer"
                                onClick={decrement}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <Minus className="size-4" />
                            </Button>
                            <span className="w-8 text-center text-lg font-semibold tabular-nums">
                                {quantity}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-9 rounded-full cursor-pointer"
                                onClick={increment}
                                aria-label="Increase quantity"
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>

                        {/* Live subtotal */}
                        <span className="text-lg font-bold tabular-nums">
                            ৳{subtotal.toFixed(2)}
                        </span>
                    </div>

                    <Button
                        className="w-full gap-2 rounded-xl text-base -mt-1 cursor-pointer"
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                    >
                        <ShoppingCart className="size-5" />
                        {isAdding ? "Adding…" : "Add to Cart"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
});
