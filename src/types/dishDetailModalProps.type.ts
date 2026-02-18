import { Dish } from "./dish.type";

export interface DishDetailModalProps {
    dish: Dish;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}