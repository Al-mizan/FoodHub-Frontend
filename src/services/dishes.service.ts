import { env } from "@/env";
import { Dish } from "@/types";

const API_URL = env.API_URL;

interface GetDishesParams {
    search?: string;
    cuisine_slug?: string;  // search by cuisine slug
    page?: string;
    limit?: string;
}

export const dishesService = {
    getAllDishes: async (params?: GetDishesParams,) => {
        try {
            const url = new URL(`${API_URL}/api/meals`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        url.searchParams.append(key, String(value));
                    }
                });
            }
            const res = await fetch(url.toString(), {
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
                // if created_at is within last 30 days, then it's new
                dishes.data = dishes?.data?.map((dish: Dish) => {
                    const isNew = new Date(dish.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    return { ...dish, isNew };
                });
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

    getDishesByRestaurant: async (restaurantId: string) => {
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

    getDishesByIdOfRestaurant: async (restaurantId: string, dishId: string) => {
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
    },
}