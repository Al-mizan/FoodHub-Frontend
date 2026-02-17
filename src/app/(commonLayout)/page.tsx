import { Suspense } from "react";
import Cuisines from "../../components/modules/homepage/Cuisines";
import Dishes from "../../components/modules/homepage/Dishes";
import Restaurants from "../../components/modules/homepage/Restaurants";
import SearchBar from "../../components/modules/homepage/SearchBar";
import { HomeProps } from "@/types";


export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;
    const cuisineSlug = typeof params.cuisines === "string" ? params.cuisines : undefined;
    const search = typeof params.search === "string" ? params.search : undefined;
    const isFiltering = !!(cuisineSlug || search);

    return (
        <div className="space-y-2">
            {/* Search Bar */}
            <Suspense>
                <SearchBar />
            </Suspense>

            {/* Cuisines — always visible */}
            <Cuisines activeCuisine={cuisineSlug} />

            {/* When filtering: show only Dishes. Otherwise: show Restaurants + Dishes */}
            {!isFiltering && <Restaurants />}

            <Dishes cuisineSlug={cuisineSlug} search={search} />
        </div>
    );
}
