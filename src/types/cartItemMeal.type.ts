export interface CartItemMeal {
    id: string;
    name: string;
    image_url: string;
    price: number;
    discount_percentage?: number | null;
    discount_price?: number | null;
}