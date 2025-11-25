"use client";

import { useEffect } from "react";

export function useBodyScrollLock(active: boolean) {
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        if (!active) {
            const prevY = Number(body.dataset.scrollY || 0);
            body.style.position = "";
            body.style.top = "";
            body.style.overflow = "";
            html.style.overscrollBehavior = "";
            delete body.dataset.scrollY;
            if (!isNaN(prevY)) window.scrollTo(0, prevY);
            return;
        }

        const scrollY = window.scrollY;
        body.dataset.scrollY = String(scrollY);
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";
    }, [active]);
}
