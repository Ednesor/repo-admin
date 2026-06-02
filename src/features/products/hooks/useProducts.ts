import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/shared/services/api/productsApi";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";


interface Props {
    page: number;
    pageSize: number;
    avaliable?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
}

export function useProducts({
    page,
    pageSize,
    avaliable = true,
    categoryIds,
    ingredientIds,
}: Props) {
    const queryClient = useQueryClient();
    const productsQuery = useQuery({
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

    // create Product
    const createProductMutation = useMutation({
        mutationFn: (data: CreateProductInput) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // update Product
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: CreateProductInput }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // delete Product
    const deleteProductMutation = useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return { productsQuery, createProductMutation, updateProductMutation, deleteProductMutation };
}
