import { useQuery } from "@tanstack/react-query";
import { getIngredientById } from "@/shared/services/api/ingredientsApi";

interface UseIngredientOptions {
    id: number;
    enabled?: boolean;
}

export function useIngredient({ id, enabled = true }: UseIngredientOptions) {
    return useQuery({
        queryKey: ["ingredient", id],
        queryFn: () => getIngredientById(id),
        enabled,
    });
}