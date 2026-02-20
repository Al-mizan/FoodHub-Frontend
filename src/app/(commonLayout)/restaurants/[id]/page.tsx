import { notFound } from "next/navigation";
import { restaurantsService } from "@/services/restaurants.service";
import { dishesService } from "@/services/dishes.service";
import { Dish, IdProps } from "@/types";
import RestaurantMealsClient from "@/components/modules/restaurants/RestaurantMealsClient";

export const dynamic = "force-dynamic";

export default async function SpecificRestaurant({ params }: IdProps) {
    const { id } = await params;

    const restaurantResult = await restaurantsService.getRestaurantById(id);

    if (restaurantResult.error || !restaurantResult.data) {
        notFound();
    }

    const restaurant = restaurantResult.data;

    // Use user_id (not profile id) since meals.provider_id references the User model
    const mealsResult = await dishesService.getDishesByRestaurant(restaurant.user_id, { page: "1", limit: "10" });

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