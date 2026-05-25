import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "@/shared/services/api/ingredientsApi";

export function useIngredients() {
    return useQuery({
        queryKey: ["ingredients"],

        queryFn: getIngredients,
    });
}
