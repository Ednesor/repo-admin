import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/shared/services/api/categoriesApi";
import type { UpdateCategoryInput } from "@/types/categoria.types";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateCategoryInput;
        }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}