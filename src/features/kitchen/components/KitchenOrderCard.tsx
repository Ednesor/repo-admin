import type { EstadoPedido, Pedido, DetallePedido } from "../types";
import { FiClock } from "react-icons/fi";

interface Props {
    pedido: Pedido;
    onAvanzar: (id: number, nuevoEstado: EstadoPedido) => void;
    isLoading: boolean;
}

export function KitchenOrderCard({ pedido, onAvanzar, isLoading }: Props) {
    const isConfirmed = pedido.estado_codigo === "CONFIRMADO";
    const actionText = isConfirmed ? "Cocinar" : "Despachar";
    const nextState: EstadoPedido = isConfirmed ? "EN_PREP" : "EN_CAMINO";

    const hora = new Date(pedido.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const itemsText =
        pedido.items && pedido.items.length > 0
            ? pedido.items
                  .map((i: DetallePedido) => `${i.cantidad}x ${i.nombre_snapshot}`)
                  .join(" · ")
            : pedido.notas || "Sin descripción";

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-orange-700">#{pedido.id}</span>
                <span className="text-gray-500 text-xs flex items-center gap-1 font-semibold">
                    <FiClock className="text-[14px]" />
                    {hora}
                </span>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-1">
                {pedido.cliente_nombre || `Cliente #${pedido.usuario_id}`}
            </h3>

            <div className="mb-4 text-sm text-gray-600 bg-gray-50 rounded-md p-2 border-l-2 border-orange-400">
                {itemsText}
            </div>

            <div className="flex justify-between items-center">
                <span className="font-bold text-orange-700">
                    ${Number(pedido.total).toLocaleString("es-AR")}
                </span>

                <button
                    onClick={() => onAvanzar(pedido.id, nextState)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 ${
                        isConfirmed
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {actionText}
                </button>
            </div>
        </div>
    );
}
