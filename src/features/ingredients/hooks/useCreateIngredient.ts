import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIngredient } from "@/shared/services/api/ingredientsApi";
import type { CreateIngredientInput } from "@/types/ingredients.types";

export function useCreateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateIngredientInput) => createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}