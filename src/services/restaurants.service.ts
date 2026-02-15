import { env } from "@/env";

const API_URL = env.API_URL;

export const restaurantsService = {
    getRestaurants: async () => {
        try {
            const res = await fetch(`${API_URL}/api/providers`, {
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["restaurants"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch restaurants: ${res.statusText}` },
                }
            }
            const restaurants = await res.json();
            if (restaurants.success) {
                return {
                    data: restaurants.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch restaurants" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch restaurants" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    }
}