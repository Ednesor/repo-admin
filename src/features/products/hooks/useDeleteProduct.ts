import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/shared/services/api/productsApi";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}