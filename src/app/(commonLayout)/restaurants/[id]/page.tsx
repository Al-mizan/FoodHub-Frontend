import { notFound } from "next/navigation";
import { restaurantsService } from "@/services/restaurants.service";
import { dishesService } from "@/services/dishes.service";
import { Dish, IdProps } from "@/types";
import RestaurantMealsClient from "@/components/modules/restaurants/RestaurantMealsClient";

export default async function SpecificRestaurant({ params }: IdProps) {
    const { id } = await params;

    const [restaurantResult, mealsResult] = await Promise.all([
        restaurantsService.getRestaurantById(id),
        dishesService.getDishesByRestaurant(id, { page: "1", limit: "10" }),
    ]);

    if (restaurantResult.error || !restaurantResult.data) {
        notFound();
    }

    const restaurant = restaurantResult.data;
    const initialMeals: Dish[] = (mealsResult.data ?? []).map((dish: Dish) => ({
        ...dish,
        restaurant_name: dish.restaurant_name ?? restaurant.restaurant_name,
    }));
    const initialMeta = mealsResult.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 };

    return (
        <RestaurantMealsClient
            restaurant={restaurant}
            initialMeals={initialMeals}
            initialMeta={initialMeta}
        />
    );
}