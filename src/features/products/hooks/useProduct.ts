import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/shared/services/api/productsApi";

interface UseProductOptions {
    id: number;
    enabled?: boolean;
}

export function useProduct({ id, enabled = true }: UseProductOptions) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled,
    });
}