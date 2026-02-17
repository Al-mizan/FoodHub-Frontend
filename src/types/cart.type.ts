import { CartItem } from "./cartItem.type";

export interface Cart {
    id: string;
    user_id: string;
    provider_id: string;
    provider: {
        id: string;
        name: string;
        providerProfile: { restaurant_name: string } | null;
    };
    status: string;
    total_price: number;
    cartItems: CartItem[];
    created_at: string;
    updated_at: string;
}