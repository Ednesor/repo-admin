import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/ordersApi";
import type { AvanzarEstadoRequest } from "../types";

export function useOrders(offset = 0, limit = 100) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["orders", offset, limit],
        queryFn: () => ordersService.getAll(offset, limit),
        refetchInterval: 15000,
    });

    const cambiarEstadoMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AvanzarEstadoRequest }) =>
            ordersService.cambiarEstado(id, payload),
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    return {
        pedidos: query.data?.data ?? [],
        total: query.data?.total ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        cambiarEstado: cambiarEstadoMutation.mutate,
        isChangingState: cambiarEstadoMutation.isPending,
    };
}
