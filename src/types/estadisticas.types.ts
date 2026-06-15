export interface VentasPeriodoItem {
    fecha: string
    total_ventas: number
    cantidad_pedidos: number
}

export interface ProductoTopItem {
    nombre: string
    ingresos: number
    cantidad_vendida: number
}

export interface PedidosEstadoItem {
    estado_codigo: string
    cantidad: number
}

export interface ResumenResponse {
    ventas_hoy: number
    ticket_promedio: number
    pedidos_activos: number
    ingresos_mes: number
}

export interface IngresosResponse {
    forma_pago_codigo: string
    total: number
    cantidad: number
}