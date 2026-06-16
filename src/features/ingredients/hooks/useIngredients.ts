import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsList, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from "@/shared/services/api/ingredientsApi";
import type { CreateIngredientInput, UpdateIngredientInput } from "@/types/ingredients.types";

interface Props {
    page: number;
    pageSize: number;
}

export interface UseIngredientOptions {
    id: number;
    enabled?: boolean;
}

const EMPTY_PAGINATED_RESPONSE = { items: [], total: 0, page: 1, size: 10, pages: 0 };

export function useIngredients({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["ingredients", page, pageSize],
        queryFn: async () => {
            try {
                // Sumamos +1 para FastAPI
                const response = await getIngredientsList(page + 1, pageSize);
                return response ?? EMPTY_PAGINATED_RESPONSE;
            } catch (error) {
                console.error("Error al cargar ingredientes:", error);
                return EMPTY_PAGINATED_RESPONSE; 
            }
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false // APAGADO
    });
}

// Esta función pide TODOS los ingredientes (la usás a veces para filtros)
export function useIngredientsAll() {
    return useQuery({
        queryKey: ["ingredients", "all"],
        queryFn: async () => {
            try {
                // Pedimos una página gigante
                const response = await getIngredientsList(1, 1000);
                return response ?? EMPTY_PAGINATED_RESPONSE; 
            } catch (error) {
                console.error("Error al cargar todos los ingredientes:", error);
                return EMPTY_PAGINATED_RESPONSE;
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });
}

export function useIngredient({ id, enabled = true }: UseIngredientOptions) {
    return useQuery({
        queryKey: ["ingredient", id],
        queryFn: async () => {
            const data = await getIngredientById(id);
            return data || null;
        },
        enabled: enabled && !!id,
        staleTime: 60 * 1000,
        retry: false
    });
}

// Create Ingredient
export function useCreateIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateIngredientInput) => createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}

// Update Ingredient
export function useUpdateIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateIngredientInput }) => updateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}

// Delete Ingredient
export function useDeleteIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}