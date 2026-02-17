import { CartItemMeal } from "./cartItemMeal.type";

export interface CartItem {
    id: string;
    cart_id: string;
    meal_id: string;
    meal: CartItemMeal;
    quantity: number;
    unit_price: number;
    sub_total_amount: number;
}