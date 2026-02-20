import { env } from "@/env";
import { Cuisine } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const cousinesService = {
    getAllCousines: async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`, {  // categories and cousines are same
                cache: "no-store",
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch cousines: ${res.statusText}` },
                }
            }
            const cousines = await res.json();
            if (cousines.success) {
                // remove categories with is_active = false
                cousines.data = cousines.data.filter((cuisine: Cuisine) => cuisine.is_active);
                return {
                    data: cousines.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch cousines" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch cousines" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    },
};