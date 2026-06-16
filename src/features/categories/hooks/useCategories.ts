import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoriesTree, getCategoryById, createCategory as apiCreateCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from "@/shared/services/api/categoriesApi";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/categoria.types";

interface Props {
    id?: number;
    page?: number;
    pageSize?: number;
    enabled?: boolean;
}

export function useCategories({ id, page = 0, pageSize = 100, enabled = true }: Props = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Get All (Lista paginada)
    const getCategoriesAll = useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: () => getCategories(page * pageSize, pageSize),
        enabled: enabled && !id,
    });

    // 2. Get Tree
    const categoriesTree = useQuery({
        queryKey: ["categories-tree"],
        queryFn: getCategoriesTree,
        enabled: enabled && !id,
    });

    // 3. Get By ID (Una sola categoría)
    const categoryById = useQuery({
        queryKey: ["category", id],
        queryFn: () => id ? getCategoryById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id,
    });

    // --- MUTATIONS (POST, PUT, DELETE) ---
    const createCategory = useMutation({
        mutationFn: (data: CreateCategoryInput) => apiCreateCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });

    const updateCategory = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateCategoryInput }) => apiUpdateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
            queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });

    const deleteCategory = useMutation({
        mutationFn: (id: number) => apiDeleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });

    return {
        // Datos
        data: getCategoriesAll.data,
        treeData: categoriesTree.data,
        singleData: categoryById.data,
        
        // Estados de carga y error
        isLoading: getCategoriesAll.isLoading || categoriesTree.isLoading || categoryById.isLoading,
        isFetching: getCategoriesAll.isFetching || categoriesTree.isFetching || categoryById.isFetching,
        isError: getCategoriesAll.isError || categoriesTree.isError || categoryById.isError,
        refetch: getCategoriesAll.refetch,
        refetchById: categoryById.refetch,
        
        // Acciones
        createCategory: createCategory.mutateAsync,
        updateCategory: updateCategory.mutateAsync,
        deleteCategory: deleteCategory.mutateAsync,
    };
}
