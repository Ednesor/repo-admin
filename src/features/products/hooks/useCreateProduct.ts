import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProductInput) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}