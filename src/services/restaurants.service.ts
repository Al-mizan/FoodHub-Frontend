import { env } from "@/env";
import { Restaurant } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface PaginatedMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const restaurantsService = {
    getRestaurants: async () => {
        try {
            const res = await fetch(`${API_URL}/api/providers`, {
                cache: "no-store",
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
    },

    getRestaurantsPaginated: async (page: number = 1, limit: number = 12): Promise<{
        data: Restaurant[] | null;
        meta: PaginatedMeta | null;
        error: { message: string } | null;
    }> => {
        try {
            const url = new URL(`${API_URL}/api/providers`);
            url.searchParams.set("page", String(page));
            url.searchParams.set("limit", String(limit));

            const res = await fetch(url.toString(), {
                cache: "no-store",
            });

            if (!res.ok) {
                return { data: null, meta: null, error: { message: `Failed to fetch restaurants: ${res.statusText}` } };
            }

            const json = await res.json();
            if (json.success) {
                return { data: json.data as Restaurant[], meta: json.meta as PaginatedMeta, error: null };
            }

            return { data: null, meta: null, error: { message: "Failed to fetch restaurants" } };
        } catch (error) {
            console.error(error);
            return { data: null, meta: null, error: { message: "Failed to fetch restaurants" } };
        }
    },

    getRestaurantById: async (id: string): Promise<{
        data: Restaurant | null;
        error: { message: string } | null;
    }> => {
        try {
            const res = await fetch(`${API_URL}/api/providers/${id}`, {
                cache: "no-store",
            });

            if (!res.ok) {
                return { data: null, error: { message: `Failed to fetch restaurant: ${res.statusText}` } };
            }

            const json = await res.json();
            if (json.success) {
                return { data: json.data as Restaurant, error: null };
            }

            return { data: null, error: { message: "Failed to fetch restaurant" } };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Failed to fetch restaurant" } };
        }
    },
}