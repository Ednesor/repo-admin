import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "@/shared/services/api/ingredientsApi";

export function useIngredients() {
    return useQuery({
        queryKey: ["ingredients", "filters"],
        queryFn: async () => {
            try {
                // getIngredients ahora devuelve un array plano (Promise<IngredientsPublic[]>)
                const response = await getIngredients();
                return response ?? [];
            } catch (error) {
                console.error("Error al cargar ingredientes para filtros:", error);
                return []; // Fallback de seguridad
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });
}