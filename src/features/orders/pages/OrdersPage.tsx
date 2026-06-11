import { useOrders } from "../hooks/useOrders";
import { PedidoCard } from "../components/PedidoCard/PedidoCard";
import type { EstadoPedido, Pedido } from "../types";

const COLUMNAS: { estado: EstadoPedido; titulo: string; colorDot: string }[] = [
    { estado: 'PENDIENTE', titulo: 'Pendientes', colorDot: 'bg-red-500' },
    { estado: 'CONFIRMADO', titulo: 'Confirmados', colorDot: 'bg-yellow-500' },
    { estado: 'EN_PREP', titulo: 'En Preparación', colorDot: 'bg-blue-500' },
    { estado: 'EN_CAMINO', titulo: 'En Camino', colorDot: 'bg-indigo-500' },
    { estado: 'ENTREGADO', titulo: 'Entregados', colorDot: 'bg-green-500' },
    { estado: 'CANCELADO', titulo: 'Cancelados', colorDot: 'bg-red-800' },
];

export function OrdersPage() {
    const { data, isLoading, isError, cambiarEstadoPedido, isChangingState } = useOrders();
    const pedidos = data?.data ?? [];

    if (isLoading) return <div className="p-6">Cargando tablero...</div>;
    if (isError) return <div className="p-6 text-red-500">Error al cargar los pedidos. Revisá la red.</div>;

    const getPedidosPorEstado = (estado: EstadoPedido) => {
        return pedidos.filter(p => p.estado_codigo === estado);
    };

    return (
        <div className="p-6 h-[calc(100vh-160px)] flex flex-col bg-orange-50/30 rounded-2xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tablero de Pedidos</h1>
            
            <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
                {COLUMNAS.map(col => {
                    const pedidosColumna = getPedidosPorEstado(col.estado);
                    return (
                        <div key={col.estado} className="flex flex-col gap-3 min-w-[220px] flex-1">
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
                                    <PedidoCard 
                                        key={p.id} 
                                        pedido={p} 
                                        onAvanzar={(id, estado, motivo) => cambiarEstadoPedido({ id, payload: { estado_hacia: estado, motivo }})} 
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