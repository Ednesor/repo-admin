export type EstadoPedido =
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREP'
    | 'ENTREGADO'
    | 'CANCELADO';

export interface DetallePedido {
    pedido_id: number;
    producto_id: number;
    cantidad: number;
    nombre_snapshot: string;
    precio_snapshot: number;
    subtotal_snapshot: number;
    personalizacion?: number[] | null;
    personalizacion_snapshot?: string[] | null;
    created_at: string;
}
export interface Pedido {
    id: number;
    usuario_id: number;
    cliente_nombre?: string;
    estado_codigo: EstadoPedido;
    forma_pago_codigo: string;
    subtotal: number;
    descuento: number;
    costo_envio: number;
    total: number;
    notas?: string | null;
    items?: DetallePedido[];
    created_at: string;
}
export interface PedidoListResponse {
    data: Pedido[];
    total: number;
}

export interface AvanzarEstadoRequest {
    estado_hacia: EstadoPedido;
    motivo?: string;
}
