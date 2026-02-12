"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/env";

const API_BASE_URL = env.API_URL;

interface CartContextType {
    count: number;
    isLoading: boolean;
    refetchCount: () => Promise<void>;
    incrementCount: (amount?: number) => void;
    decrementCount: (amount?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isPending: authPending } = useAuth();
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCartCount = useCallback(async () => {
        if (!isAuthenticated) {
            setCount(0);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/carts/count`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCount(data.data?.count ?? 0);
            } else {
                setCount(0);
            }
        } catch (error) {
            console.error("Failed to fetch cart count:", error);
            setCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!authPending) {
            fetchCartCount();
        }
    }, [authPending, fetchCartCount]);

    const incrementCount = useCallback((amount: number = 1) => {
        setCount((prev) => prev + amount);
    }, []);

    const decrementCount = useCallback((amount: number = 1) => {
        setCount((prev) => Math.max(0, prev - amount));
    }, []);

    return (
        <CartContext.Provider
            value={{
                count,
                isLoading,
                refetchCount: fetchCartCount,
                incrementCount,
                decrementCount,
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
