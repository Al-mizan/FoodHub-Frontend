"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Cuisine } from "@/types";
import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

function AppSidebarInner() {
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);

    useEffect(() => {
        async function fetchCuisines() {
            try {
                const res = await fetch(`${API_URL}/api/categories`, {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) {
                    setCuisines(
                        data.data.filter((c: Cuisine) => c.is_active)
                    );
                }
            } catch (error) {
                console.error("Failed to fetch cuisines for sidebar:", error);
            }
        }
        fetchCuisines();
    }, []);

    return <AppSidebar cuisines={cuisines} />;
}

export function AppSidebarWrapper() {
    return (
        <Suspense fallback={<div className="w-64 shrink-0" />}>
            <AppSidebarInner />
        </Suspense>
    );
}
