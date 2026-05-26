import { useQuery } from "@tanstack/react-query";
import { getIngredientsList } from "@/shared/services/api/ingredientsApi";

interface Props {
    page: number;
    pageSize: number;
}

export function useIngredients({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["ingredients", page, pageSize],
        queryFn: () => getIngredientsList(page * pageSize, pageSize),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
    });
}

export function useIngredientsAll() {
    return useQuery({
        queryKey: ["ingredients"],
        queryFn: () => getIngredientsList(),
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}