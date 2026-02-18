"use client";

import { env } from "@/env";
import { Restaurant } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export interface PaginatedMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginatedMeta;
}

export const restaurantsClientService = {
    getRestaurantsPaginated: async (
        page: number = 1,
        limit: number = 12,
    ): Promise<PaginatedResponse<Restaurant>> => {
        const url = new URL(`${API_URL}/api/providers`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(limit));

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`Failed to fetch restaurants: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error("Failed to fetch restaurants");
        }

        return { data: json.data as Restaurant[], meta: json.meta as PaginatedMeta };
    },

    getRestaurantById: async (id: string): Promise<Restaurant> => {
        const res = await fetch(`${API_URL}/api/providers/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch restaurant: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error("Failed to fetch restaurant");
        }

        return json.data as Restaurant;
    },
};
