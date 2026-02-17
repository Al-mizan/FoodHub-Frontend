import { dishesService } from "@/services/dishes.service";
import { IdProps } from "@/types";

export default async function SpecificMeal({ params }: IdProps) {
    const { id } = await params;
    const { data: meal } = await dishesService.getDishById(id);
    console.log(meal);
    return (
        <div>This is SpecificMeal component for meal with id: {meal?.id}</div>
    );
}