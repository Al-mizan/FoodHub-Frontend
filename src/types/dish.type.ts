interface DietaryType {
    VEG: 'VEG'; // vegetarian
    HALAL: 'HALAL';
    VEGAN: 'VEGAN'; // vegan
    MIX: 'MIX';
}

export interface Dish {
    id: string;
    providerId: string;
    categoryId: string;

    name: string;
    description: string;
    price: number;
    discount_percentage?: number | null;
    discount_price?: number | null;

    restaurant_name: string | null;
    image_url: string;
    preparation_time: number;

    dietaryType: DietaryType;
    isAvailable: boolean;

    rating_sum: number;
    rating_count: number;
    isNew?: boolean;

    created_at: Date;
    updated_at: Date;
}
