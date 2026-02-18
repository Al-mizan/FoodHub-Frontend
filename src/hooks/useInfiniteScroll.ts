"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    rootMargin?: string;
    threshold?: number;
}

export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = "300px",
    threshold = 0,
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const onLoadMoreRef = useRef(onLoadMore);
    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    });

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMoreRef.current();
                }
            },
            { rootMargin, threshold },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoading, rootMargin, threshold]);

    return { sentinelRef };
}
