import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KitchenSocket } from "@/shared/services/websocket/kitchenSocket";
import type { Pedido } from "@/features/orders/types";

export function useOrdersSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = KitchenSocket.getInstance();
        socket.joinRoom();

        const invalidate = () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        };

        const unsubs = [
            socket.on<Pedido>("NUEVO_PEDIDO", invalidate),
            socket.on<Pedido>("PEDIDO_CONFIRMADO", invalidate),
            socket.on<Pedido>("PEDIDO_EN_PREPARACION", invalidate),
            socket.on<Pedido>("PEDIDO_CANCELADO", invalidate),
            socket.on<Pedido>("ESTADO_ACTUALIZADO", invalidate),
        ];

        return () => {
            unsubs.forEach((off) => off());
            socket.leaveRoom();
        };
    }, [queryClient]);
}
