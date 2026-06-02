import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/ordersApi";
import type { AvanzarEstadoRequest } from "../types";

export interface UseOrdersOptions {
    offset?: number;
    limit?: number;
}

export function useOrders({ offset = 0, limit = 100 }: UseOrdersOptions = {}) {
    return useQuery({
        queryKey: ["orders", offset, limit],
        queryFn: () => ordersService.getAll(offset, limit),
        //TODO : Deuda técnica - Polling cada 15 segundos (`refetchInterval: 15000`) es ineficiente para una tabla de pedidos que puede tener cientos de registros. Cada 15s se hace un GET completo de TODOS los pedidos (limit=100). Se debería usar WebSockets o al menos aumentar el intervalo y usar staleTime.
        refetchInterval: 15000,
    });
}

export function useCambiarEstadoPedido() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AvanzarEstadoRequest }) =>
            ordersService.cambiarEstado(id, payload),
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}
