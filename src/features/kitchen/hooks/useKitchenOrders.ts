import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenService } from "../services/kitchenApi";
import type { AvanzarEstadoRequest } from "../types";

export interface UseKitchenOrdersOptions {
    offset?: number;
    limit?: number;
    enabled?: boolean;
}

export function useKitchenOrders({ offset = 0, limit = 100, enabled = true }: UseKitchenOrdersOptions = {}) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["kitchen-orders", offset, limit],
        queryFn: () => kitchenService.getCocinaOrders(offset, limit),
        refetchInterval: 30000,
        enabled,
    });

    const cambiarEstadoMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AvanzarEstadoRequest }) =>
            kitchenService.cambiarEstado(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        cambiarEstadoPedido: cambiarEstadoMutation.mutateAsync,
        isChangingState: cambiarEstadoMutation.isPending,
    };
}
