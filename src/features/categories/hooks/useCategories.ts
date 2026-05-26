import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoriesTree } from "@/shared/services/api/categoriesApi";

interface Props {
    page: number;
    pageSize: number;
}

export function useCategories({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: () => getCategories(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}

export function useCategoriesTree() {
    return useQuery({
        queryKey: ["categories-tree"],
        queryFn: getCategoriesTree,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}