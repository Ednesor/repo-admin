// src/features/categories/hooks/useCategoriesTree.ts

import { useQuery } from "@tanstack/react-query";
import { getCategoriesTree } from "@/shared/services/api/categoriesApi";

export function useCategoriesTree() {
    return useQuery({
        queryKey: ["categories-tree"],

        queryFn: getCategoriesTree,
    });
}