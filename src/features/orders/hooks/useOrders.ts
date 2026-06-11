import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/ordersApi";
import type { AvanzarEstadoRequest } from "../types";

export interface UseOrdersOptions {
    offset?: number;
    limit?: number;
    enabled?: boolean;
}

export function useOrders({ offset = 0, limit = 100, enabled = true }: UseOrdersOptions = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    const query = useQuery({
        queryKey: ["orders", offset, limit],
        queryFn: () => ordersService.getAll(offset, limit),
        refetchInterval: 15000,
        enabled,
    });

    // --- MUTATIONS (POST, PUT, DELETE) ---
    const cambiarEstadoMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AvanzarEstadoRequest }) =>
            ordersService.cambiarEstado(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    return {
        // Datos
        data: query.data,
        
        // Carga y recarga
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        
        // Acciones
        cambiarEstadoPedido: cambiarEstadoMutation.mutateAsync,
        isChangingState: cambiarEstadoMutation.isPending,
    };
}
