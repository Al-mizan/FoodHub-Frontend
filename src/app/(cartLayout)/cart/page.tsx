"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

import { useCart } from "@/providers/CartProvider";
import { ordersClientService } from "@/services/orders-client.service";
import {
    calculateTotals,
    formatCurrency,
    type CartItemDisplay,
} from "@/lib/cart-utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ── Map backend Cart[] to flat CartItemDisplay[] ── */
function useCartItems(): CartItemDisplay[] {
    const { carts } = useCart();

    return useMemo(() => {
        const items: CartItemDisplay[] = [];
        for (const cart of carts) {
            for (const ci of cart.cartItems ?? []) {
                const meal = ci.meal;
                if (!meal) continue;
                const price = ci.unit_price ?? meal.discount_price ?? meal.price ?? 0;
                items.push({
                    id: ci.id,
                    mealId: ci.meal_id ?? meal.id,
                    name: meal.name,
                    price,
                    quantity: ci.quantity,
                    image: meal.image_url || "/placeholder.png",
                });
            }
        }
        return items;
    }, [carts]);
}

/* ── Cart Item Row (quantity stepper, remove, subtotal) ── */
function CartItemRow({
    item,
    onUpdate,
    onRemove,
    isUpdating,
}: {
    item: CartItemDisplay;
    onUpdate: (mealId: string, qty: number) => void;
    onRemove: (cartItemId: string) => void;
    isUpdating: boolean;
}) {
    const mealId = item.mealId ?? "";
    const handleDecrease = () => {
        if (item.quantity <= 1) return;
        onUpdate(mealId, item.quantity - 1);
    };
    const handleIncrease = () => onUpdate(mealId, item.quantity + 1);

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 rounded-lg border bg-card p-3 sm:p-4 transition-all duration-300",
                isUpdating && "opacity-70"
            )}
        >
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 sm:w-20 shrink-0">
                    <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="size-full object-cover"
                        />
                    </AspectRatio>
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-sm sm:text-base">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatCurrency(item.price)} each
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive sm:hidden"
                    onClick={() => onRemove(item.id)}
                    disabled={isUpdating}
                    aria-label="Remove item"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={handleDecrease}
                        disabled={item.quantity <= 1 || isUpdating}
                        aria-label="Decrease quantity"
                    >
                        <Minus className="size-4" />
                    </Button>
                    <span className="min-w-[2ch] text-center font-medium tabular-nums">
                        {item.quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={handleIncrease}
                        disabled={isUpdating}
                        aria-label="Increase quantity"
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>

                <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:inline-flex shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(item.id)}
                    disabled={isUpdating}
                    aria-label="Remove item"
                >
                    <X className="size-4" />
                </Button>
            </div>
        </div>
    );
}

/* ── Order Summary Checkout Panel ── */
function CheckoutPanel({
    cartItems,
    isEmpty,
}: {
    cartItems: CartItemDisplay[];
    isEmpty: boolean;
}) {
    const { subtotal, delivery, total } = calculateTotals(cartItems);
    const { carts, refetchCarts } = useCart();
    const router = useRouter();
    const [isPlacing, setIsPlacing] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const handlePlaceOrder = useCallback(async () => {
        if (!deliveryAddress.trim()) {
            toast.error("Please enter a delivery address");
            setDeliveryOpen(true);
            return;
        }

        setIsPlacing(true);
        try {
            // Get unique provider IDs from active carts
            const providerIds = [...new Set(carts.map((c) => c.provider_id))];

            // Place an order for each provider's cart
            await Promise.all(
                providerIds.map((pid) =>
                    ordersClientService.placeOrder(pid, deliveryAddress.trim())
                )
            );

            toast.success("Order placed successfully!");
            await refetchCarts();
            router.push("/orders");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to place order"
            );
        } finally {
            setIsPlacing(false);
        }
    }, [carts, deliveryAddress, refetchCarts, router]);

    return (
        <aside
            className={cn(
                "order-2 flex flex-col lg:order-1 lg:col-span-2",
                "rounded-2xl border bg-background p-4 sm:p-6 shadow-lg space-y-4 sm:space-y-6",
                "lg:sticky lg:top-24 lg:h-fit"
            )}
        >
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                        {formatCurrency(subtotal)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium tabular-nums">
                        {formatCurrency(delivery)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium tabular-nums">—</span>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>

            <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                    >
                        <span>Delivery Info</span>
                        {deliveryOpen ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="delivery-address">Delivery Address *</Label>
                            <Input
                                id="delivery-address"
                                placeholder="Enter your full delivery address"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Payment Method - COD Only */}
            <div className="space-y-2">
                <Label className="text-base font-semibold">Payment Method</Label>

                <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 cursor-not-allowed">
                    <Input
                        type="radio"
                        id="cod"
                        name="payment-method"
                        value="cod"
                        defaultChecked
                        disabled
                        className="size-4"
                    />
                    <Label
                        htmlFor="cod"
                        className="flex flex-col items-start text-left leading-none cursor-not-allowed"
                    >
                        <span className="font-medium text-sm text-left">
                            Cash on Delivery (COD)
                        </span>
                        <span className="text-xs text-muted-foreground text-left">
                            Pay with cash when your order arrives
                        </span>
                    </Label>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <Button
                    className="w-full"
                    size="lg"
                    disabled={isEmpty || isPlacing}
                    onClick={handlePlaceOrder}
                >
                    {isPlacing ? "Placing Order…" : "Place Order"}
                </Button>
            </div>
        </aside>
    );
}

/* ── Shopping Cart Section ── */
function ShoppingCartSection({ cartItems }: { cartItems: CartItemDisplay[] }) {
    const { updateCartItem, removeCartItem, isLoading } = useCart();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleUpdate = useCallback(
        async (mealId: string, quantity: number) => {
            setUpdatingId(mealId);
            await updateCartItem(mealId, quantity);
            setUpdatingId(null);
        },
        [updateCartItem]
    );

    const handleRemove = useCallback(
        async (cartItemId: string) => {
            setUpdatingId(cartItemId);
            await removeCartItem(cartItemId);
            setUpdatingId(null);
        },
        [removeCartItem]
    );

    const isEmpty = cartItems.length === 0;

    if (isLoading) {
        return (
            <section className="order-1 lg:order-2 lg:col-span-3">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border bg-card p-3 sm:p-4">
                            <Skeleton className="h-20 w-20 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-4 w-6" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (isEmpty) {
        return (
            <section className="order-1 lg:order-2 lg:col-span-3">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
                    <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
                    <p className="mb-6 text-muted-foreground">
                        Add items from the menu to get started.
                    </p>
                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="order-1 lg:order-2 lg:col-span-3">
            <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">
                Shopping Cart
            </h1>
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <CartItemRow
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdate}
                        onRemove={handleRemove}
                        isUpdating={
                            updatingId === item.id || updatingId === item.mealId
                        }
                    />
                ))}
            </div>
        </section>
    );
}

/* ── Page ── */
export default function CartPage() {
    const cartItems = useCartItems();
    const isEmpty = cartItems.length === 0;

    return (
        <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-10">
            <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-5">
                <CheckoutPanel cartItems={cartItems} isEmpty={isEmpty} />
                <ShoppingCartSection cartItems={cartItems} />
            </div>
        </div>
    );
}
