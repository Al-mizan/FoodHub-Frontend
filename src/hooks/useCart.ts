"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { env } from "@/env";

const API_BASE_URL = env.API_URL;

export function useCartCount() {
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

    return {
        count,
        isLoading,
        refetch: fetchCartCount,
    };
}
