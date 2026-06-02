import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";


interface Props {
    page: number;
    pageSize: number;
    avaliable?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
}

export interface UseProductOptions {
    id: number;
    enabled?: boolean;
}

export function useProducts({
    page,
    pageSize,
    avaliable = true,
    categoryIds,
    ingredientIds,
}: Props) {
    return useQuery({
        queryKey: [
            "products",
            page,
            pageSize,
            avaliable,
            categoryIds,
            ingredientIds,
        ],
        queryFn: () =>
            getProducts({
                offset: page * pageSize,
                limit: pageSize,
                include_only_active: avaliable,
                categoria_ids: categoryIds,
                ingrediente_ids: ingredientIds,
            }),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}

export function useProduct({ id, enabled = true }: UseProductOptions) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled,
    });
}

    // create Product
    export function useCreateProduct() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (data: CreateProductInput) => createProduct(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
            },
        });
    }

    // update Product
    //TODO : Deuda técnica - `useUpdateProduct` usa `CreateProductInput` como tipo del payload de edición, en lugar de usar un tipo específico `UpdateProductInput` con todos los campos opcionales. Esto obliga a enviar TODOS los campos al editar, aunque el backend soporta PATCH parcial. Además, el tipo `CreateProductInput` tiene `ingrediente_ids: number[]` que es incompatible con el backend.
    export function useUpdateProduct() { 
        const queryClient = useQueryClient();
        return useMutation({
        mutationFn: ({ id, data }: { id: number, data: CreateProductInput }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });}

    // delete Product
    export function useDeleteProduct() { 
        const queryClient = useQueryClient();
        return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });}

