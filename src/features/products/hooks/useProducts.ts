import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/shared/services/api/productsApi";

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
