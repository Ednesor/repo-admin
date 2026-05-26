import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/shared/services/api/categoriesApi";

interface UseCategoryOptions {
    id: number;
    enabled?: boolean;
}

export function useCategory({ id, enabled = true }: UseCategoryOptions) {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => getCategoryById(id),
        enabled,
    });
}