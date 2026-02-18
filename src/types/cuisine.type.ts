export interface Cuisine {
    id: string;
    name: string
    slug: string // for linking to cuisine page
    icon_url: string
    is_active: boolean
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
}