import { Button } from "@/components/ui/button";
import { restaurantsService } from "@/services/restaurants.service";
import { Restaurant } from "@/types";
import Link from "next/link";
import { RestaurantCard } from "./RestaurantCard";

export default async function Restaurants() {
    const restaurants = await restaurantsService.getRestaurants();
    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-medium tracking-tight">
                        All restaurants
                    </h2>
                </div>
                <Link href="/restaurants" className="hidden sm:inline-flex">
                    <Button variant="outline" className="cursor-pointer">
                        View All
                    </Button>
                </Link>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants?.error?.message ? (
                    <p className="text-red-500">{restaurants?.error?.message}</p>
                ) : null}
                {restaurants?.data?.map((restaurant: Restaurant) => (
                    <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                        <RestaurantCard restaurant={restaurant} />
                    </Link>
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-6 flex justify-center sm:hidden">
                <Link href="/restaurants">
                    <Button variant="outline" className="w-full max-w-xs">
                        View All Restaurants
                    </Button>
                </Link>
            </div>
        </section>
    );
}