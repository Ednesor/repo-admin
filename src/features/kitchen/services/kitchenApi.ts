import apiClient from "@/shared/services/api/axiosInstance";
import type { AvanzarEstadoRequest, Pedido, PedidoListResponse } from "../types";

const COCINA = "/api/v1/pedidos/cocina";

export const kitchenService = {
    getCocinaOrders: async (offset = 0, limit = 100): Promise<PedidoListResponse> => {
        const { data } = await apiClient.get<PedidoListResponse>(`${COCINA}/pedidos`, {
            params: { offset, limit },
        });
        return data;
    },

    cambiarEstado: async (id: number, payload: AvanzarEstadoRequest): Promise<Pedido> => {
        const { data } = await apiClient.patch<Pedido>(`/api/v1/pedidos/${id}/estado`, payload);
        return data;
    },
};
