import { restaurantsService } from "@/services/restaurants.service";
import RestaurantsPageClient from "@/components/modules/restaurants/RestaurantsPageClient";

export default async function RestaurantPage() {
    const result = await restaurantsService.getRestaurantsPaginated(1, 12);

    const initialRestaurants = result.data ?? [];
    const initialMeta = result.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 };

    return (
        <RestaurantsPageClient
            initialRestaurants={initialRestaurants}
            initialMeta={initialMeta}
        />
    );
}