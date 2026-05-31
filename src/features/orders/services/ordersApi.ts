import api from "@/shared/services/api/axiosInstance";
import type { Pedido, PedidoListResponse, AvanzarEstadoRequest } from "../types";

export const ordersService = {
    getAll: async (offset = 0, limit = 20) => {
        const { data } = await api.get<PedidoListResponse>("/api/v1/pedidos/", {
            params: { offset, limit },
        });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<Pedido>(`/api/v1/pedidos/${id}`);
        return data;
    },

    cambiarEstado: async (id: number, payload: AvanzarEstadoRequest) => {
        const { data } = await api.patch<Pedido>(`/api/v1/pedidos/${id}/estado`, payload);
        return data;
    },
};
