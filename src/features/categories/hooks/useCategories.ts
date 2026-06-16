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

const EMPTY_PAGINATED_RESPONSE = { items: [], total: 0, page: 1, size: 10, pages: 0 };

export function useCategories({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: async () => {
            try {
                // Sumamos +1 porque React Table empieza en 0 y FastAPI en 1
                const response = await getCategories(page + 1, pageSize);
                return response ?? EMPTY_PAGINATED_RESPONSE;
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                return EMPTY_PAGINATED_RESPONSE;
            }
        },
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: false // APAGADO para no saturar
    });
}

export function useCategoriesTree() {
    return useQuery({
        queryKey: ["categories-tree"],
        queryFn: async () => {
            try {
                const response = await getCategoriesTree();
                // El árbol no es paginado, devuelve un { data: [] }
                return response ?? { data: [] };
            } catch (error) {
                console.error("Error al cargar el árbol de categorías:", error);
                return { data: [] };
            }
        },
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });
}

export function useCategory({ id, enabled = true }: UseCategoryOptions) {
    return useQuery({
        queryKey: ["category", id],
        queryFn: async () => {
            const data = await getCategoryById(id);
            if (!data) throw new Error("Categoría no encontrada");
            return data;
        },
        enabled: enabled && id > 0,
        retry: false
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
        mutationFn: ({ id, data }: { id: number; data: UpdateCategoryInput }) => updateCategory(id, data),
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