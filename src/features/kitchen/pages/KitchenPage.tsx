import { useMemo } from "react";
import { useKitchenOrders } from "../hooks/useKitchenOrders";
import { useKitchenSocket } from "../hooks/useKitchenSocket";
import { KitchenOrderCard } from "../components/KitchenOrderCard";
import type { EstadoPedido, Pedido } from "../types";

const COLUMNAS: { estado: EstadoPedido; titulo: string; colorDot: string }[] = [
    { estado: "CONFIRMADO", titulo: "Confirmados", colorDot: "bg-yellow-500" },
    { estado: "EN_PREP", titulo: "En Preparación", colorDot: "bg-blue-500" },
];

export function KitchenPage() {
    useKitchenSocket();

    const { data, isLoading, isError, cambiarEstadoPedido, isChangingState } = useKitchenOrders();
    const pedidos = useMemo(() => data?.data ?? [], [data]);

    if (isLoading) return <div className="p-6">Cargando tablero de cocina...</div>;
    if (isError) return <div className="p-6 text-red-500">Error al cargar los pedidos. Revisá la red.</div>;

    const getPedidosPorEstado = (estado: EstadoPedido) => {
        return pedidos.filter((p: Pedido) => p.estado_codigo === estado);
    };

    return (
        <div className="p-6 h-[calc(100vh-160px)] flex flex-col bg-orange-50/30 rounded-2xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tablero de Cocina (KDS)</h1>

            <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
                {COLUMNAS.map((col) => {
                    const pedidosColumna = getPedidosPorEstado(col.estado);
                    return (
                        <div key={col.estado} className="flex flex-col gap-3 min-w-[280px] flex-1">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${col.colorDot}`}></div>
                                    <h2 className="text-lg font-bold text-gray-800">{col.titulo}</h2>
                                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                        {pedidosColumna.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 pb-2 custom-scrollbar">
                                {pedidosColumna.map((p: Pedido) => (
                                    <KitchenOrderCard
                                        key={p.id}
                                        pedido={p}
                                        onAvanzar={(id, estado) =>
                                            cambiarEstadoPedido({ id, payload: { estado_hacia: estado } })
                                        }
                                        isLoading={isChangingState}
                                    />
                                ))}
                                {pedidosColumna.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-400 text-sm">
                                        Sin pedidos
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
