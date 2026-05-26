import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/shared/services/api/categoriesApi";
import type { CreateCategoryInput } from "@/types/categoria.types";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryInput) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}