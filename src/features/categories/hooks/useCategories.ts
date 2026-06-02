import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoriesTree, getCategoryById, createCategory, updateCategory, deleteCategory } from "@/shared/services/api/categoriesApi";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/categoria.types";

interface Props {
    page: number;
    pageSize: number;
}

export interface UseCategoryOptions {
    id: number;
    enabled?: boolean;
}

export function useCategories({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: () => getCategories(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}

export function useCategoriesTree() {
    return useQuery({
        queryKey: ["categories-tree"],
        queryFn: getCategoriesTree,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}

export function useCategory({ id, enabled = true }: UseCategoryOptions) {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => getCategoryById(id),
        enabled,
    });
}


// Create Category
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

// Update category

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

// Delete category

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}

