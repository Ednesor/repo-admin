import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/shared/services/api/productsApi";

interface Props {
    page: number;
    pageSize: number;
    avaliable?: boolean;
    categoryId?: number[];
    ingredientId?: number[]
}

export function useProducts({ page, pageSize, avaliable, categoryId, ingredientId }: Props) {
    return useQuery({
        queryKey: ["products", page, pageSize, avaliable, categoryId, ingredientId],
        queryFn: () =>
            getProducts({
                offset: page * pageSize,
                limit: pageSize,
                include_only_active: avaliable,
                categoria_ids: categoryId,
                ingrediente_ids: ingredientId
            }),
    });
}