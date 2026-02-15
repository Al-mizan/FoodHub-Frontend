export interface Restaurant {
    id: string;
    user_id: string;
    restaurant_name: string;
    description?: string | null;
    address: string;
    opening_time: string;  // "10:00:00"
    closing_time: string;
    discount_percent: number;
    discount_thereshold: number;
    is_open: boolean;
    freeDeliveryAmount: number;
    logo_url?: string | null;
    banner_url?: string | null;
    rating_avg: number;
    created_at: string;
    updated_at: string;
}