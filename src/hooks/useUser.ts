"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    address: string | null;
    role: string;
    status: string;
}

export function useUserProfile() {
    const { isAuthenticated, isPending: authPending } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const updateAddress = useCallback(async (address: string) => {
        if (!isAuthenticated) return { success: false, error: "Not authenticated" };

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
                return { success: true, data: data.data };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message || "Failed to update address" };
            }
        } catch (error) {
            console.error("Failed to update address:", error);
            return { success: false, error: "Network error" };
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!authPending) {
            fetchProfile();
        }
    }, [authPending, fetchProfile]);

    return {
        profile,
        isLoading,
        refetch: fetchProfile,
        updateAddress,
    };
}
