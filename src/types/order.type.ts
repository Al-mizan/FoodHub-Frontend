export type OrderStatus = "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PAID" | "UNPAID" | "REFUNDED";

export interface OrderItem {
    id: string;
    order_id: string;
    meal_id: string;
    quantity: number;
    unit_price: number;
    sub_total_amount: number;
    meal: {
        id: string;
        name: string;
        image_url: string;
    };
}

export interface OrderReview {
    id: string;
    meal_id: string;
    rating: number;
    comment?: string | null;
}

export interface Order {
    id: string;
    user_id: string;
    provider_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    delivery_address: string;
    created_at: string;
    updated_at: string;
    provider?: {
        id: string;
        name: string;
        providerProfile: { restaurant_name: string } | null;
    };
    orderItems: OrderItem[];
    reviews?: OrderReview[];
}

export interface ProviderOrder {
    id: string;
    user_id: string;
    provider_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    delivery_address: string;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
    };
    orderItems: OrderItem[];
}
