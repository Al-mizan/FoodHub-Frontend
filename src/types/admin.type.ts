export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string | null;
    image?: string | null;
    emailVerified: boolean;
    createdAt: string;
}

export interface AdminOrder {
    id: string;
    user_id: string;
    provider_id: string;
    total_amount: number;
    status: string;
    payment_status: string;
    delivery_address: string;
    created_at: string;
    user: { id: string; name: string; email: string; phone?: string | null };
    provider: {
        id: string;
        name: string;
        providerProfile?: { restaurant_name: string } | null;
    };
    orderItems: {
        id: string;
        meal_id: string;
        quantity: number;
        unit_price: number;
        sub_total_amount: number;
        meal: { id: string; name: string; image_url?: string | null };
    }[];
}

export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    icon_url?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}