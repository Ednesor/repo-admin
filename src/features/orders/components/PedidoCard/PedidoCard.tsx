import { useState } from "react";
import type { Pedido, EstadoPedido } from "../../types";
import { FiClock, FiChevronRight, FiChevronLeft, FiX, FiAlertTriangle } from "react-icons/fi";
import Modal from "../../../../shared/components/Modal";

interface Props {
    pedido: Pedido;
    onAvanzar: (id: number, nuevoEstado: EstadoPedido, motivo?: string) => void;
    isLoading: boolean;
}

export function PedidoCard({ pedido, onAvanzar, isLoading }: Props) {
    const [isCancelling, setIsCancelling] = useState(false);
    const [motivo, setMotivo] = useState("");

    const handleAvanzar = () => {
        let siguienteEstado: EstadoPedido = 'CONFIRMADO';
        if (pedido.estado_codigo === 'PENDIENTE') siguienteEstado = 'CONFIRMADO';
        if (pedido.estado_codigo === 'CONFIRMADO') siguienteEstado = 'EN_PREP';
        if (pedido.estado_codigo === 'EN_PREP') siguienteEstado = 'EN_CAMINO';
        if (pedido.estado_codigo === 'EN_CAMINO') siguienteEstado = 'ENTREGADO';

        onAvanzar(pedido.id, siguienteEstado);
    };

    const handleRetroceder = () => {
        let anteriorEstado: EstadoPedido = 'PENDIENTE';
        if (pedido.estado_codigo === 'CONFIRMADO') anteriorEstado = 'PENDIENTE';
        if (pedido.estado_codigo === 'EN_PREP') anteriorEstado = 'CONFIRMADO';
        if (pedido.estado_codigo === 'EN_CAMINO') anteriorEstado = 'EN_PREP';

        onAvanzar(pedido.id, anteriorEstado);
    };

    const confirmCancelar = () => {
        if (motivo.trim().length === 0) {
            alert("El motivo es obligatorio para cancelar.");
            return;
        }
        onAvanzar(pedido.id, 'CANCELADO', motivo);
        setIsCancelling(false);
        setMotivo("");
    };

    const cancelCancelar = () => {
        setIsCancelling(false);
        setMotivo("");
    };



    // Mostramos la hora
    const hora = new Date(pedido.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Asignamos el color del borde izquierdo según el estado
    const borderColors = {
        PENDIENTE: 'border-red-500',
        CONFIRMADO: 'border-yellow-500',
        EN_PREP: 'border-blue-500',
        EN_CAMINO: 'border-indigo-500',
        ENTREGADO: 'border-green-500',
        CANCELADO: 'border-gray-500',
    };

    const borderColor = borderColors[pedido.estado_codigo] || 'border-gray-300';
    const isTerminado = pedido.estado_codigo === 'ENTREGADO' || pedido.estado_codigo === 'CANCELADO';

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${borderColor} transition-transform hover:-translate-y-1 hover:shadow-md ${isTerminado ? 'opacity-75' : ''}`}>

            <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-orange-700">#{pedido.id}</span>
                <span className="text-gray-500 text-xs flex items-center gap-1 font-semibold">
                    <FiClock className="text-[14px]" />
                    {hora}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">{pedido.cliente_nombre || `Cliente #${pedido.usuario_id}`}</h3>
            
            <div className="mb-4">
                {(!pedido.items || pedido.items.length === 0) ? (
                    <p className="text-gray-400 text-sm italic">Sin items</p>
                ) : (
                    <ul className="text-gray-600 text-sm flex flex-col gap-1">
                        {pedido.items.map((item, idx) => (
                            <li key={idx}>
                                <div className="font-medium">
                                    {item.cantidad}x {item.nombre_snapshot}
                                </div>
                                {item.personalizacion_snapshot && item.personalizacion_snapshot.length > 0 && (
                                    <ul className="pl-4 text-xs text-red-500 italic mt-0.5">
                                        {item.personalizacion_snapshot.map((ing, iIdx) => (
                                            <li key={iIdx}>- Sin {ing}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-orange-700">${Number(pedido.total).toLocaleString('es-AR')}</span>

                {!isTerminado && (
                    <div className="flex gap-2">
                        {pedido.estado_codigo !== 'PENDIENTE' && (
                            <button
                                onClick={handleRetroceder}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-300 transition-all disabled:opacity-50"
                                title="Volver al estado anterior"
                            >
                                <FiChevronLeft className="text-[18px]" />
                            </button>
                        )}
                        <button
                            onClick={() => setIsCancelling(true)}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            title="Cancelar pedido"
                        >
                            <FiX className="text-[18px]" />
                        </button>
                        <button
                            onClick={handleAvanzar}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-800 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                            title="Avanzar estado"
                        >
                            <FiChevronRight className="text-[18px]" />
                        </button>
                    </div>
                )}
            </div>

            <Modal isOpen={isCancelling} onClose={cancelCancelar}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <FiAlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Cancelar Pedido #{pedido.id}
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Por favor, indicá el motivo de la cancelación.
                    </p>
                    <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Motivo de la cancelación..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none outline-none mb-4"
                        rows={3}
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={cancelCancelar}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            Atrás
                        </button>
                        <button
                            type="button"
                            onClick={confirmCancelar}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            Confirmar Cancelación
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
