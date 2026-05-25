import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: CreateProductInput;
        }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}