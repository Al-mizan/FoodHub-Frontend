import { env } from "@/env";

const API_URL = env.API_URL;

export const cousinesService = {
    getAllCousines: async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`, {  // categories and cousines are same
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["cousines"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch cousines: ${res.statusText}` },
                }
            }
            const cousines = await res.json();
            if (cousines.success) {
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