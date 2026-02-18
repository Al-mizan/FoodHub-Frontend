"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/env";
import { Cart, CartContextType } from "@/types";
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ── Helper: generic fetch wrapper ── */
async function apiFetch<T = unknown>(
    url: string,
    opts: RequestInit = {},
): Promise<{ ok: boolean; data: T | null; message?: string }> {
    try {
        const { headers: optHeaders, ...restOpts } = opts;
        const res = await fetch(url, {
            credentials: "include",
            headers: { "Content-Type": "application/json", ...(optHeaders as Record<string, string>) },
            ...restOpts,
        });
        const json = await res.json().catch(() => null);
        if (res.ok) return { ok: true, data: json?.data ?? null };
        return { ok: false, data: null, message: json?.error || json?.message || res.statusText };
    } catch {
        return { ok: false, data: null, message: "Network error" };
    }
}

const cartsKey = ["carts", "me"] as const;
const countKey = ["cartCount", "me"] as const;

function findCartItemByMealId(carts: Cart[], mealId: string) {
    for (let cartIndex = 0; cartIndex < carts.length; cartIndex++) {
        const cart = carts[cartIndex];
        const items = cart.cartItems ?? [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];
            if (item.meal_id === mealId || item.meal?.id === mealId) {
                return { cartIndex, itemIndex, item };
            }
        }
    }
    return null;
}

function findCartItemById(carts: Cart[], cartItemId: string) {
    for (let cartIndex = 0; cartIndex < carts.length; cartIndex++) {
        const cart = carts[cartIndex];
        const items = cart.cartItems ?? [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];
            if (item.id === cartItemId) {
                return { cartIndex, itemIndex, item };
            }
        }
    }
    return null;
}

function CartProviderInner({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isPending: authPending } = useAuth();
    const queryClient = useQueryClient();
    const enabled = !authPending && isAuthenticated;

    // When user logs out (or auth resolves unauthenticated), immediately clear global cart cache
    useEffect(() => {
        if (authPending) return;
        if (!isAuthenticated) {
            queryClient.setQueryData(cartsKey, []);
            queryClient.setQueryData(countKey, 0);
        }
    }, [authPending, isAuthenticated, queryClient]);

    /* ── Queries ── */
    // FIX: Removed initialData so isPending properly reflects first fetch.
    //      Set staleTime to 0 so invalidateQueries always triggers a re-fetch.
    //      Use placeholderData for non-blocking fallback values.
    const cartsQuery = useQuery({
        queryKey: cartsKey,
        enabled,
        placeholderData: [] as Cart[],
        staleTime: 0,
        refetchOnWindowFocus: true,
        queryFn: async () => {
            const { ok, data, message } = await apiFetch<Cart[]>(
                `${API_BASE_URL}/api/carts`,
            );
            if (!ok) throw new Error(message || "Failed to fetch cart");
            return data ?? [];
        },
    });

    const countQuery = useQuery({
        queryKey: countKey,
        enabled,
        placeholderData: 0,
        staleTime: 0,
        refetchOnWindowFocus: true,
        queryFn: async () => {
            const { ok, data, message } = await apiFetch<{ count: number }>(
                `${API_BASE_URL}/api/carts/count`,
            );
            if (!ok) throw new Error(message || "Failed to fetch cart count");
            return data?.count ?? 0;
        },
    });

    const invalidateCart = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: cartsKey }),
            queryClient.invalidateQueries({ queryKey: countKey }),
        ]);
    }, [queryClient]);

    /* ── Mutations ── */

    const addMutation = useMutation({
        mutationFn: async (vars: { mealId: string; quantity: number }) => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts`, {
                method: "POST",
                body: JSON.stringify({ meal_id: vars.mealId, quantity: vars.quantity }),
            });
            if (!ok) throw new Error(message || "Failed to add to cart");
        },
        onMutate: async (vars) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: countKey }),
                queryClient.cancelQueries({ queryKey: cartsKey }),
            ]);

            const prevCount = queryClient.getQueryData<number>(countKey) ?? 0;
            const prevCarts = queryClient.getQueryData<Cart[]>(cartsKey) ?? [];

            queryClient.setQueryData<number>(countKey, prevCount + vars.quantity);

            // If this meal already exists in cache, update quantity optimistically
            const found = findCartItemByMealId(prevCarts, vars.mealId);
            if (found) {
                const next = prevCarts.map((c, ci) => {
                    if (ci !== found.cartIndex) return c;
                    const items = (c.cartItems ?? []).map((it, ii) => {
                        if (ii !== found.itemIndex) return it;
                        const newQty = it.quantity + vars.quantity;
                        const newSub = it.unit_price * newQty;
                        return {
                            ...it,
                            quantity: newQty,
                            sub_total_amount: newSub,
                        };
                    });
                    const oldItem = (c.cartItems ?? [])[found.itemIndex];
                    const oldSub = oldItem?.sub_total_amount ?? 0;
                    const newSub = items[found.itemIndex]?.sub_total_amount ?? oldSub;
                    return {
                        ...c,
                        cartItems: items,
                        total_price: (c.total_price ?? 0) + (newSub - oldSub),
                    };
                });
                queryClient.setQueryData<Cart[]>(cartsKey, next);
            }

            return { prevCount, prevCarts };
        },
        onError: (_err, _vars, ctx) => {
            if (!ctx) return;
            queryClient.setQueryData<number>(countKey, ctx.prevCount);
            queryClient.setQueryData<Cart[]>(cartsKey, ctx.prevCarts);
        },
        onSettled: () => {
            void invalidateCart();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (vars: { mealId: string; quantity: number }) => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts`, {
                method: "PATCH",
                body: JSON.stringify({ meal_id: vars.mealId, quantity: vars.quantity }),
            });
            if (!ok) throw new Error(message || "Failed to update cart");
        },
        onMutate: async (vars) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: countKey }),
                queryClient.cancelQueries({ queryKey: cartsKey }),
            ]);

            const prevCount = queryClient.getQueryData<number>(countKey) ?? 0;
            const prevCarts = queryClient.getQueryData<Cart[]>(cartsKey) ?? [];

            const found = findCartItemByMealId(prevCarts, vars.mealId);
            if (!found) return { prevCount, prevCarts };

            const oldQty = found.item.quantity;
            const newQty = vars.quantity;
            const deltaQty = newQty - oldQty;
            queryClient.setQueryData<number>(countKey, prevCount + deltaQty);

            const nextCarts = prevCarts
                .map((c, ci) => {
                    if (ci !== found.cartIndex) return c;

                    const oldItem = (c.cartItems ?? [])[found.itemIndex];
                    if (!oldItem) return c;

                    if (newQty <= 0) {
                        const remaining = (c.cartItems ?? []).filter((_, ii) => ii !== found.itemIndex);
                        const nextTotal = (c.total_price ?? 0) - (oldItem.sub_total_amount ?? 0);
                        return { ...c, cartItems: remaining, total_price: Math.max(0, nextTotal) };
                    }

                    const newSubTotal = oldItem.unit_price * newQty;
                    const diff = newSubTotal - (oldItem.sub_total_amount ?? 0);
                    const nextItems = (c.cartItems ?? []).map((it, ii) =>
                        ii === found.itemIndex
                            ? { ...it, quantity: newQty, sub_total_amount: newSubTotal }
                            : it,
                    );
                    return { ...c, cartItems: nextItems, total_price: (c.total_price ?? 0) + diff };
                })
                .filter((c) => (c.cartItems ?? []).length > 0);

            queryClient.setQueryData<Cart[]>(cartsKey, nextCarts);
            return { prevCount, prevCarts };
        },
        onError: (_err, _vars, ctx) => {
            if (!ctx) return;
            queryClient.setQueryData<number>(countKey, ctx.prevCount);
            queryClient.setQueryData<Cart[]>(cartsKey, ctx.prevCarts);
        },
        onSettled: () => {
            void invalidateCart();
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: async (vars: { cartItemId: string }) => {
            const { ok, message } = await apiFetch(
                `${API_BASE_URL}/api/carts/items/${vars.cartItemId}`,
                { method: "DELETE" },
            );
            if (!ok) throw new Error(message || "Failed to remove item");
        },
        onMutate: async (vars) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: countKey }),
                queryClient.cancelQueries({ queryKey: cartsKey }),
            ]);

            const prevCount = queryClient.getQueryData<number>(countKey) ?? 0;
            const prevCarts = queryClient.getQueryData<Cart[]>(cartsKey) ?? [];

            const found = findCartItemById(prevCarts, vars.cartItemId);
            if (!found) return { prevCount, prevCarts };

            queryClient.setQueryData<number>(countKey, prevCount - found.item.quantity);

            const nextCarts = prevCarts
                .map((c, ci) => {
                    if (ci !== found.cartIndex) return c;
                    const oldItem = (c.cartItems ?? [])[found.itemIndex];
                    if (!oldItem) return c;
                    const remaining = (c.cartItems ?? []).filter((_, ii) => ii !== found.itemIndex);
                    const nextTotal = (c.total_price ?? 0) - (oldItem.sub_total_amount ?? 0);
                    return { ...c, cartItems: remaining, total_price: Math.max(0, nextTotal) };
                })
                .filter((c) => (c.cartItems ?? []).length > 0);

            queryClient.setQueryData<Cart[]>(cartsKey, nextCarts);
            return { prevCount, prevCarts };
        },
        onError: (_err, _vars, ctx) => {
            if (!ctx) return;
            queryClient.setQueryData<number>(countKey, ctx.prevCount);
            queryClient.setQueryData<Cart[]>(cartsKey, ctx.prevCarts);
        },
        onSettled: () => {
            void invalidateCart();
        },
    });

    const removeCartMutation = useMutation({
        mutationFn: async (vars: { cartId: string }) => {
            const { ok, message } = await apiFetch(`${API_BASE_URL}/api/carts/${vars.cartId}`, {
                method: "DELETE",
            });
            if (!ok) throw new Error(message || "Failed to remove cart");
        },
        onMutate: async (vars) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: countKey }),
                queryClient.cancelQueries({ queryKey: cartsKey }),
            ]);

            const prevCount = queryClient.getQueryData<number>(countKey) ?? 0;
            const prevCarts = queryClient.getQueryData<Cart[]>(cartsKey) ?? [];

            const cart = prevCarts.find((c) => c.id === vars.cartId);
            const qtyToRemove =
                cart?.cartItems?.reduce((sum, it) => sum + (it.quantity ?? 0), 0) ?? 0;

            queryClient.setQueryData<number>(countKey, prevCount - qtyToRemove);
            queryClient.setQueryData<Cart[]>(
                cartsKey,
                prevCarts.filter((c) => c.id !== vars.cartId),
            );

            return { prevCount, prevCarts };
        },
        onError: (_err, _vars, ctx) => {
            if (!ctx) return;
            queryClient.setQueryData<number>(countKey, ctx.prevCount);
            queryClient.setQueryData<Cart[]>(cartsKey, ctx.prevCarts);
        },
        onSettled: () => {
            void invalidateCart();
        },
    });

    /* ── Derived state ── */

    // Stable data references for useMemo
    const carts = cartsQuery.data ?? [];
    const count = countQuery.data ?? 0;

    const isLoading =
        authPending || (isAuthenticated && (cartsQuery.isPending || countQuery.isPending));

    // FIX: Stable context value — deps use primitive/data values, not entire query/mutation objects
    const ctxValue: CartContextType = useMemo(
        () => ({
            count: isAuthenticated ? count : 0,
            carts: isAuthenticated ? carts : [],
            isLoading,
            refetchCount: async () => {
                await countQuery.refetch();
            },
            refetchCarts: async () => {
                await cartsQuery.refetch();
            },
            addToCart: async (mealId: string, quantity: number) => {
                try {
                    await addMutation.mutateAsync({ mealId, quantity });
                    return { success: true };
                } catch (err) {
                    return { success: false, message: err instanceof Error ? err.message : "Failed to add to cart" };
                }
            },
            updateCartItem: async (mealId: string, quantity: number) => {
                try {
                    await updateMutation.mutateAsync({ mealId, quantity });
                    return { success: true };
                } catch (err) {
                    return { success: false, message: err instanceof Error ? err.message : "Failed to update cart" };
                }
            },
            removeCartItem: async (cartItemId: string) => {
                try {
                    await removeItemMutation.mutateAsync({ cartItemId });
                    return { success: true };
                } catch (err) {
                    return { success: false, message: err instanceof Error ? err.message : "Failed to remove item" };
                }
            },
            removeCart: async (cartId: string) => {
                try {
                    await removeCartMutation.mutateAsync({ cartId });
                    return { success: true };
                } catch (err) {
                    return { success: false, message: err instanceof Error ? err.message : "Failed to remove cart" };
                }
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isLoading, isAuthenticated, count, carts],
    );

    return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        staleTime: 0,
                        refetchOnReconnect: true,
                        refetchOnWindowFocus: true,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <CartProviderInner>{children}</CartProviderInner>
        </QueryClientProvider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
