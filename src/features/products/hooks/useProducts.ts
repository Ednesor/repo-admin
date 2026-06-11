import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput,UpdateProductInput  } from "@/types/products.types";


interface Props {
    id?: number;
    page?: number;
    pageSize?: number;
    avaliable?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
    enabled?: boolean;
}

export function useProducts({
    page = 0,
    pageSize = 100,
    avaliable = true,
    categoryIds,
    ingredientIds,
    id,
    enabled = true
}: Props = {}) {     
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Lista paginada (Get All)
    const productsQuery = useQuery({
        queryKey: ["products", page, pageSize, avaliable, categoryIds, ingredientIds],
        queryFn: () => getProducts({
            offset: page * pageSize,
            limit: pageSize,
            include_only_active: avaliable,
            categoria_ids: categoryIds,
            ingrediente_ids: ingredientIds,
        }),
        enabled: enabled && !id,
        placeholderData: (previousData) => previousData,
    });

    // 2. Un solo producto por ID (Get By Id)
    const productByIdQuery = useQuery({
        queryKey: ["product", id],
        queryFn: () => id ? getProductById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id, // Solo ejecuta si ID existe
    });

    // --- MUTATIONS (POST, PUT, DELETE) ---
    // 3. Create (POST)
    const createMutation = useMutation({
        mutationFn: (data: CreateProductInput) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // 4. Update (PUT/PATCH)
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateProductInput }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // 5. Delete (DELETE)
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        // Datos
        data: productsQuery.data,
        singleData: productByIdQuery.data,
        
        // Carga y recarga
        isLoading: productsQuery.isLoading || productByIdQuery.isLoading,
        isFetching: productsQuery.isFetching || productByIdQuery.isFetching,
        isError: productsQuery.isError || productByIdQuery.isError,
        refetch: productsQuery.refetch,
        refetchById: productByIdQuery.refetch,
        
        // Acciones
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
    };
}