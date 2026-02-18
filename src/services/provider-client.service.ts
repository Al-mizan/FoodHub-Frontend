import { env } from "@/env";
import { Meal, ProviderProfile } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const providerClientService = {
    createProviderProfile: async (data: ProviderProfile) => {
        const res = await fetch(`${API_URL}/api/providers/provider-profile`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to create provider profile");
        return json.data;
    },

    getMyMeals: async (providerId: string) => {
        const res = await fetch(`${API_URL}/api/providers/${providerId}/meals`, {
            credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch meals");
        return { data: json.data, meta: json.meta };
    },

    createMeal: async (
        providerId: string,
        data: Meal
    ) => {
        const res = await fetch(`${API_URL}/api/providers/${providerId}/meals`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to create meal");
        return json.data;
    },

    updateMeal: async (
        providerId: string,
        mealId: string,
        data: Record<string, unknown>
    ) => {
        const res = await fetch(
            `${API_URL}/api/providers/${providerId}/meals/${mealId}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to update meal");
        return json.data;
    },

    deleteMeal: async (providerId: string, mealId: string) => {
        const res = await fetch(
            `${API_URL}/api/providers/${providerId}/meals/${mealId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to delete meal");
        return json.data;
    },
};
