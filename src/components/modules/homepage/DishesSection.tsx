"use client";

import { useState, useCallback } from "react";
import { Dish } from "@/types";
import { dishesClientService, type PaginatedMeta } from "@/services/dishes-client.service";
import Dishes from "./Dishes";

interface DishesSectionProps {
    initialDishes: Dish[];
    initialMeta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    emptyMessage?: string;
    filterParams?: Record<string, string>;
}

export default function DishesSection({
    initialDishes,
    initialMeta,
    emptyMessage,
    filterParams,
}: DishesSectionProps) {
    const [dishes, setDishes] = useState<Dish[]>(initialDishes);
    const [meta, setMeta] = useState<PaginatedMeta>(
        initialMeta ?? { total: initialDishes.length, page: 1, limit: 9, totalPages: 1 }
    );
    const [isLoading, setIsLoading] = useState(false);

    const hasMore = meta.page < meta.totalPages;

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const nextPage = meta.page + 1;
            const result = await dishesClientService.getDishesPaginated(
                nextPage,
                meta.limit,
                filterParams,
            );
            setDishes((prev) => [...prev, ...result.data]);
            setMeta(result.meta);
        } catch (err) {
            console.error("Failed to load more dishes:", err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, meta.page, meta.limit, filterParams]);

    return (
        <Dishes
            meals={dishes}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
        />
    );
}
