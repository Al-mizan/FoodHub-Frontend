"use client";

import { env } from "@/env";
import { Dish } from "@/types";

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

export const dishesClientService = {
    getDishesPaginated: async (
        page: number = 1,
        limit: number = 9,
        params?: Record<string, string>,
    ): Promise<PaginatedResponse<Dish>> => {
        const url = new URL(`${API_URL}/api/meals`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(limit));
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.set(key, value);
            });
        }

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`Failed to fetch dishes: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error("Failed to fetch dishes");
        }

        const data = (json.data as Dish[]).map((dish) => {
            const isNew = new Date(dish.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return { ...dish, isNew };
        });

        return { data, meta: json.meta as PaginatedMeta };
    },

    getDishesByRestaurantPaginated: async (
        restaurantId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResponse<Dish>> => {
        const url = new URL(`${API_URL}/api/providers/${restaurantId}/meals`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(limit));

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`Failed to fetch dishes: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error("Failed to fetch dishes");
        }

        // Mark dishes created within last 30 days as new
        const data = (json.data as Dish[]).map((dish) => {
            const isNew = new Date(dish.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return { ...dish, isNew };
        });

        return { data, meta: json.meta as PaginatedMeta };
    },
};
