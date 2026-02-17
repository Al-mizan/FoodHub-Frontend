"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/env";
import { Cart, CartContextType } from "@/types";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;


const CartContext = createContext<CartContextType | undefined>(undefined);

/* ── Helper: generic fetch wrapper ── */
async function apiFetch<T = unknown>(
    url: string,
    opts: RequestInit = {},
): Promise<{ ok: boolean; data: T | null; message?: string }> {
    try {
        const res = await fetch(url, {
            credentials: "include",
            headers: { "Content-Type": "application/json", ...opts.headers },
            ...opts,
        });
        const json = await res.json().catch(() => null);
        if (res.ok) return { ok: true, data: json?.data ?? null };
        return { ok: false, data: null, message: json?.message ?? res.statusText };
    } catch {
        return { ok: false, data: null, message: "Network error" };
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isPending: authPending } = useAuth();
    const [count, setCount] = useState(0);
    const [carts, setCarts] = useState<Cart[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /* Prevent duplicate initial fetches */
    const hasFetched = useRef(false);

    /* ── Fetch count from backend ── */
    const fetchCartCount = useCallback(async () => {
        if (!isAuthenticated) { setCount(0); return; }
        const { ok, data } = await apiFetch<{ count: number }>(`${API_BASE_URL}/api/carts/count`);
        if (ok && data) setCount(data.count);
    }, [isAuthenticated]);

    /* ── Fetch full carts from backend ── */
    const fetchCarts = useCallback(async () => {
        if (!isAuthenticated) { setCarts([]); return; }
        const { ok, data } = await apiFetch<Cart[]>(`${API_BASE_URL}/api/carts`);
        if (ok && data) setCarts(data);
    }, [isAuthenticated]);

    /* ── Sync helper: refetch count + carts together ── */
    const syncWithBackend = useCallback(async () => {
        await Promise.all([fetchCartCount(), fetchCarts()]);
    }, [fetchCartCount, fetchCarts]);

    /* ── Initial load ── */
    useEffect(() => {
        if (authPending || hasFetched.current) return;
        hasFetched.current = true;
        setIsLoading(true);
        syncWithBackend().finally(() => setIsLoading(false));
    }, [authPending, syncWithBackend]);

    /* Reset when user logs out */
    useEffect(() => {
        if (!authPending && !isAuthenticated) {
            setCount(0);
            setCarts([]);
            setIsLoading(false);
            hasFetched.current = false;
        }
    }, [authPending, isAuthenticated]);

    /* ── Mutations ── */

    const addToCart = useCallback(
        async (mealId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
            // Optimistic update
            setCount((prev) => prev + quantity);

            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts`, {
                method: "POST",
                body: JSON.stringify({ meal_id: mealId, quantity }),
            });

            // Always sync with backend for truth
            await syncWithBackend();

            if (ok) return { success: true };
            return { success: false, message: message || "Failed to add to cart" };
        },
        [syncWithBackend],
    );

    const updateCartItem = useCallback(
        async (mealId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts`, {
                method: "PATCH",
                body: JSON.stringify({ meal_id: mealId, quantity }),
            });

            await syncWithBackend();

            if (ok) return { success: true };
            return { success: false, message: message || "Failed to update cart" };
        },
        [syncWithBackend],
    );

    const removeCartItem = useCallback(
        async (cartItemId: string): Promise<{ success: boolean; message?: string }> => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts/items/${cartItemId}`, {
                method: "DELETE",
            });

            await syncWithBackend();

            if (ok) return { success: true };
            return { success: false, message: message || "Failed to remove item" };
        },
        [syncWithBackend],
    );

    const removeCart = useCallback(
        async (cartId: string): Promise<{ success: boolean; message?: string }> => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts/${cartId}`, {
                method: "DELETE",
            });

            await syncWithBackend();

            if (ok) return { success: true };
            return { success: false, message: message || "Failed to remove cart" };
        },
        [syncWithBackend],
    );

    return (
        <CartContext.Provider
            value={{
                count,
                carts,
                isLoading,
                refetchCount: fetchCartCount,
                refetchCarts: fetchCarts,
                addToCart,
                updateCartItem,
                removeCartItem,
                removeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
