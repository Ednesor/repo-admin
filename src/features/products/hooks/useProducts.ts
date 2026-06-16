import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";

interface Props {
    page: number;
    pageSize: number;
    avaliable?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
}

export interface UseProductOptions {
    id: number;
    enabled?: boolean;
}

const EMPTY_PAGINATED_RESPONSE = { items: [], total: 0, page: 1, size: 10, pages: 0 };

export function useProducts({
    page,
    pageSize,
    avaliable = true, // Conservamos tu typo original para no romper la vista
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
        queryFn: async () => {
            try {
                const response = await getProducts({
                    page: page + 1, // FastAPI empieza en 1
                    size: pageSize,
                    disponible: avaliable, // Mapeamos el typo 'avaliable' a 'disponible' del backend
                    categoria_ids: categoryIds,
                    ingrediente_ids: ingredientIds,
                });
                return response ?? EMPTY_PAGINATED_RESPONSE;
            } catch (error) {
                console.error("Error al cargar productos:", error);
                return EMPTY_PAGINATED_RESPONSE;
            }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false, // APAGADO
        placeholderData: (previousData) => previousData,
    });
}

export function useProduct({ id, enabled = true }: UseProductOptions) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled,
        retry: false,
    });
}

// create Product
export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductInput) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// update Product
export function useUpdateProduct() { 
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: CreateProductInput }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// delete Product
export function useDeleteProduct() { 
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}