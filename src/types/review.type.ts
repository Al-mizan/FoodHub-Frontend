export interface Review {
    id: string;
    user_id: string;
    meal_id: string;
    order_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user?: { id: string; name: string; image: string | null };
    meal?: { id: string; name: string; image_url: string };
}
