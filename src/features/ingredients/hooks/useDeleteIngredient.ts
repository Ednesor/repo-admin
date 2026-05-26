import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIngredient } from "@/shared/services/api/ingredientsApi";

export function useDeleteIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}