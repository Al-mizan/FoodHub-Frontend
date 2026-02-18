"use client";

import { useCart } from "@/providers/CartProvider";

export function useCartCount() {
    const { count, isLoading, refetchCount } = useCart();

    return {
        count,
        isLoading,
        refetch: refetchCount,
    };
}
