import { env } from "@/env";

const API_URL = env.API_URL;

export const dishesService = {
    getAllDishes: async () => {
        try {
            const res = await fetch(`${API_URL}/api/meals`, {
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["dishes"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch dishes: ${res.statusText}` },
                }
            }
            const dishes = await res.json();
            if (dishes.success) {
                return {
                    data: dishes.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch dishes" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch dishes" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    },
    getDishById: async (dishId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/meals/${dishId}`, {
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["dishes"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch dish: ${res.statusText}` },
                }
            }
            const dish = await res.json();
            if (dish.success) {
                return {
                    data: dish.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch dish" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch dish" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    },
    getDisheByRestaurant: async (restaurantId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/providers/${restaurantId}/meals`, {
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["dishes"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch dishes: ${res.statusText}` },
                }
            }
            const dishes = await res.json();
            if (dishes.success) {
                return {
                    data: dishes.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch dishes" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch dishes" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    },
    getDisheByIdOfRestaurant: async (restaurantId: string, dishId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/providers/${restaurantId}/meals/${dishId}`, {
                cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
                next:
                    process.env.NODE_ENV === "development"
                        ? undefined
                        : { revalidate: 10, tags: ["dishes"] },
            });
            if (!(res.ok)) {
                return {
                    data: null,
                    error: { message: `Failed to fetch dish: ${res.statusText}` },
                }
            }
            const dish = await res.json();
            if (dish.success) {
                return {
                    data: dish.data,
                    error: null,
                }
            }
            else {
                return {
                    data: null,
                    error: { message: "Failed to fetch dish" },
                }
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch dish" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    }
}