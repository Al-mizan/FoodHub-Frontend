export interface Meal {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    discount_percentage?: number | null;
    discount_price?: number | null;
    image_url?: string | null;
    is_available: boolean;
    preparation_time?: number | null;
    rating_sum: number;
    rating_count: number;
    category_id?: string | null;
    category?: { id: string; name: string } | null;
}