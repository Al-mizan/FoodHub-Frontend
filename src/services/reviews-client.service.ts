import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const reviewsClientService = {
    createReview: async (data: {
        meal_id: string;
        order_id: string;
        rating: number;
        comment?: string;
    }) => {
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to submit review");
        return json.data;
    },

    getReviewsByOrder: async (orderId: string) => {
        const res = await fetch(`${API_URL}/api/reviews/order/${orderId}`, {
            credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch reviews");
        return json.data;
    },

    getReviewsByMeal: async (mealId: string) => {
        const res = await fetch(`${API_URL}/api/reviews/meal/${mealId}`);
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch reviews");
        return json.data;
    },
};
