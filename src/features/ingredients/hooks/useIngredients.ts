import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsList, getIngredientById, createIngredient as apiCreateIngredient, updateIngredient as apiUpdateIngredient, deleteIngredient as apiDeleteIngredient } from "@/shared/services/api/ingredientsApi";
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
    const getIngredientsAll = useQuery({
        queryKey: ["ingredients", page, pageSize],
        queryFn: () => getIngredientsList(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
        enabled: enabled && !id && !fetchAll, // Se apaga si se pide un ID especifico o se piden TODOS
    });

    // 2. Listar TODOS los ingredientes
    const getIngredientsFullList = useQuery({
        queryKey: ["ingredients", "all"],
        queryFn: () => getIngredientsList(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        enabled: enabled && fetchAll,
    });

    // 3. Obtener ingrediente por ID
    const ingredientById = useQuery({
        queryKey: ["ingredient", id],
        queryFn: () => id ? getIngredientById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id, // Solo se ejecuta si el salvavidas esta activo y hay ID
    });

    // --- MUTATIONS (POST/PUT/DELETE) ---
    // 4. Crear ingrediente
    const createIngredient = useMutation({
        mutationFn: (data: CreateIngredientInput) => apiCreateIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });

    // 5. Actualizar ingrediente
    const updateIngredient = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateIngredientInput }) =>
            apiUpdateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
            queryClient.invalidateQueries({ queryKey: ["ingredient"] }); // Invalida el individual tambien
        },
    });

    // 6. Eliminar ingrediente
    const deleteIngredient = useMutation({
        mutationFn: (id: number) => apiDeleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });

    return {
        // Datos
        data: getIngredientsAll.data,
        allData: getIngredientsFullList.data,
        singleData: ingredientById.data,

        // Carga y recarga
        isLoading: getIngredientsAll.isLoading || ingredientById.isLoading || getIngredientsFullList.isLoading,
        isFetching: getIngredientsAll.isFetching || ingredientById.isFetching || getIngredientsFullList.isFetching,
        isError: getIngredientsAll.isError || ingredientById.isError || getIngredientsFullList.isError,
        refetch: getIngredientsAll.refetch,
        refetchById: ingredientById.refetch,
        refetchAll: getIngredientsFullList.refetch,

        // Acciones
        createIngredient: createIngredient.mutateAsync,
        updateIngredient: updateIngredient.mutateAsync,
        deleteIngredient: deleteIngredient.mutateAsync,
    };
}
