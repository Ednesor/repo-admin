import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput, UpdateProductInput } from "@/types/products.types";


interface Props {
    id?: number;
    page?: number;
    pageSize?: number;
    disponible?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
    enabled?: boolean;
}

export function useProducts({
    page = 0,
    pageSize = 100,
    disponible = true,
    categoryIds,
    ingredientIds,
    id,
    enabled = true
}: Props = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Lista paginada (Get All)
    const getProductsAll = useQuery({
        queryKey: ["products", page, pageSize, disponible, categoryIds, ingredientIds],
        queryFn: () => getProducts({
            offset: page * pageSize,
            limit: pageSize,
            disponible: disponible,
            categoria_ids: categoryIds,
            ingrediente_ids: ingredientIds,
        }),
        enabled: enabled && !id,
        placeholderData: (previousData) => previousData,
    });

    // 2. Un solo producto por ID (Get By Id)
    const productById = useQuery({
        queryKey: ["product", id],
        queryFn: () => id ? getProductById(id) : Promise.reject("No ID provided"),
        enabled: enabled && !!id, // Solo ejecuta si ID existe
    });

    // --- MUTATIONS (POST, PUT, DELETE) ---
    // 3. Create (POST)
    const createProduct = useMutation({
        mutationFn: (data: CreateProductInput) => apiCreateProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // 4. Update (PUT/PATCH)
    const updateProduct = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateProductInput }) => apiUpdateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // 5. Delete (DELETE)
    const deleteProduct = useMutation({
        mutationFn: (id: number) => apiDeleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        // Datos
        data: getProductsAll.data,
        singleData: productById.data,

        // Carga y recarga
        isLoading: getProductsAll.isLoading || productById.isLoading,
        isFetching: getProductsAll.isFetching || productById.isFetching,
        isError: getProductsAll.isError || productById.isError,
        refetch: getProductsAll.refetch,
        refetchById: productById.refetch,

        // Acciones
        createProduct: createProduct.mutateAsync,
        updateProduct: updateProduct.mutateAsync,
        deleteProduct: deleteProduct.mutateAsync,
    };
}