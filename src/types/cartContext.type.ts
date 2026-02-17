import { Cart } from "./cart.type";

export interface CartContextType {
    /** Total item quantity across all carts */
    count: number;
    /** Full cart data grouped by restaurant */
    carts: Cart[];
    isLoading: boolean;

    /** Re-fetch count from backend */
    refetchCount: () => Promise<void>;
    /** Re-fetch full carts from backend */
    refetchCarts: () => Promise<void>;

    /** Add a dish to the cart (creates restaurant group if needed) */
    addToCart: (mealId: string, quantity: number) => Promise<{ success: boolean; message?: string }>;
    /** Update an existing cart item's quantity (PATCH). Quantity = 0 removes it. */
    updateCartItem: (mealId: string, quantity: number) => Promise<{ success: boolean; message?: string }>;
    /** Delete a single cart item by its id */
    removeCartItem: (cartItemId: string) => Promise<{ success: boolean; message?: string }>;
    /** Delete an entire restaurant cart */
    removeCart: (cartId: string) => Promise<{ success: boolean; message?: string }>;
}