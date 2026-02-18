"use server";

import { revalidateTag } from "next/cache";

export async function revalidateDishesAndRestaurants() {
    revalidateTag("dishes", 'max');
    revalidateTag("restaurants", 'max');
}
