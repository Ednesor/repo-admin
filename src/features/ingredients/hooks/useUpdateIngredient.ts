import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIngredient } from "@/shared/services/api/ingredientsApi";
import type { UpdateIngredientInput } from "@/types/ingredients.types";

export function useUpdateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateIngredientInput;
        }) => updateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}