import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsList, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from "@/shared/services/api/ingredientsApi";
import type { CreateIngredientInput, UpdateIngredientInput } from "@/types/ingredients.types";

interface Props {
    page?: number;
    pageSize?: number;
    id?: number;
    fetchAll?: boolean;
    enabled?: boolean;
}

export function useIngredients({
    page = 0,
    pageSize = 100,
    id,
    fetchAll = false,
    enabled = true,
}: Props = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Listar ingredientes (Paginados)
    const ingredientsQuery = useQuery({
        queryKey: ["ingredients", page, pageSize],
        queryFn: () => getIngredientsList(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
        enabled: enabled && !id && !fetchAll, // Se apaga si se pide un ID especifico o se piden TODOS
    });

    // 2. Listar TODOS los ingredientes
    const allIngredientsQuery = useQuery({
        queryKey: ["ingredients", "all"],
        queryFn: () => getIngredientsList(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        enabled: enabled && fetchAll,
    });

    // 3. Obtener ingrediente por ID
    const ingredientByIdQuery = useQuery({
        queryKey: ["ingredient", id],
        queryFn: () => id ? getIngredientById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id, // Solo se ejecuta si el salvavidas esta activo y hay ID
    });

    // --- MUTATIONS (POST/PUT/DELETE) ---
    // 4. Crear ingrediente
    const createMutation = useMutation({
        mutationFn: (data: CreateIngredientInput) => createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });

    // 5. Actualizar ingrediente
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateIngredientInput }) =>
            updateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
            queryClient.invalidateQueries({ queryKey: ["ingredient"] }); // Invalida el individual tambien
        },
    });

    // 6. Eliminar ingrediente
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });

    return {
        // Datos
        data: ingredientsQuery.data,
        allData: allIngredientsQuery.data,
        singleData: ingredientByIdQuery.data,
        
        // Carga y recarga
        isLoading: ingredientsQuery.isLoading || ingredientByIdQuery.isLoading || allIngredientsQuery.isLoading,
        isFetching: ingredientsQuery.isFetching || ingredientByIdQuery.isFetching || allIngredientsQuery.isFetching,
        isError: ingredientsQuery.isError || ingredientByIdQuery.isError || allIngredientsQuery.isError,
        refetch: ingredientsQuery.refetch,
        refetchById: ingredientByIdQuery.refetch,
        refetchAll: allIngredientsQuery.refetch,
        
        // Acciones
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
    };
}
