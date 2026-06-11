import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoriesTree, getCategoryById, createCategory, updateCategory, deleteCategory } from "@/shared/services/api/categoriesApi";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/categoria.types";

interface Props {
    id?: number;
    page?: number;
    pageSize?: number;
    enabled?: boolean;   // Opcional, false para apagar los GETs
}

export function useCategories({ id, page = 0, pageSize = 100, enabled = true }: Props = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Get All (Lista paginada)
    const query = useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: () => getCategories(page * pageSize, pageSize),
        enabled: enabled && !id, // Si pasaste un ID, asumimos que no querés la lista entera
    });

    // 2. Get Tree
    const treeQuery = useQuery({
        queryKey: ["categories-tree"],
        queryFn: getCategoriesTree,
        enabled: enabled && !id,
    });

    // 3. Get By ID (Una sola categoría)
    const byIdQuery = useQuery({
        queryKey: ["category", id],
        queryFn: () => id ? getCategoryById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id, // Solo se ejecuta si pasaste un ID válido
    });

    // --- MUTATIONS (POST, PUT, DELETE) ---
    const createMutation = useMutation({
        mutationFn: (data: CreateCategoryInput) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateCategoryInput }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
            queryClient.invalidateQueries({ queryKey: ["category"] }); // Invalidamos el individual también
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });

    return {
        // Datos
        data: query.data,
        treeData: treeQuery.data,
        singleData: byIdQuery.data, // Acá esta GetById
        
        // Estados de carga y error
        isLoading: query.isLoading || treeQuery.isLoading || byIdQuery.isLoading,
        isFetching: query.isFetching || treeQuery.isFetching || byIdQuery.isFetching,
        isError: query.isError || treeQuery.isError || byIdQuery.isError,
        refetch: query.refetch,
        refetchById: byIdQuery.refetch,
        
        // Acciones
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
    };
}
