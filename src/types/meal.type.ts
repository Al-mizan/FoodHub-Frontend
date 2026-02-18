export interface Meal {
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: string;
    is_available?: boolean;
}