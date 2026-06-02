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

export function useIngredients({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["ingredients", page, pageSize],
        queryFn: () => getIngredientsList(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}

export function useIngredientsAll() {
    return useQuery({
        queryKey: ["ingredients"],
        queryFn: () => getIngredientsList(),
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}

export function useIngredient({ id, enabled = true }: UseIngredientOptions) {
    return useQuery({
        queryKey: ["ingredient", id],
        queryFn: () => getIngredientById(id),
        enabled,
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

