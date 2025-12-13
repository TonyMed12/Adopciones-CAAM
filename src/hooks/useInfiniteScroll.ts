"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollParams = {
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
};

export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: UseInfiniteScrollParams) {
    const ref = useRef<HTMLDivElement | null>(null);
    const locked = useRef(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage &&
                    !locked.current
                ) {
                    locked.current = true;
                    onLoadMore();
                }
            },
            {
                root: null,
                rootMargin: "500px 0px",
                threshold: 0,
            }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    useEffect(() => {
        if (!isFetchingNextPage) {
            locked.current = false;
        }
    }, [isFetchingNextPage]);

    return ref;
}
