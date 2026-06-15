import type {VentasPeriodoItem, ProductoTopItem, PedidosEstadoItem, ResumenResponse, IngresosResponse} from "@/types/estadisticas.types"
import apiClient from "./axiosInstance"

const PANEL = "/api/v1/estadisticas/"

export async function getResumen(): Promise<ResumenResponse> {
    const response = await apiClient.get(PANEL + "resumen")
    return response.data
}

export async function getVentasPeriodo(desde: string, hasta: string): Promise<VentasPeriodoItem[]> {
    const response = await apiClient.get(PANEL + `ventas?desde=${desde}&hasta=${hasta}`)
    return response.data
}

export async function getProductosTop(desde: string, hasta: string): Promise<ProductoTopItem[]> {
    const response = await apiClient.get(PANEL + `productos-top?desde=${desde}&hasta=${hasta}`)
    return response.data
}

export async function getPedidosEstado(): Promise<PedidosEstadoItem[]> {
    const response = await apiClient.get(PANEL + "pedidos-por-estado")
    return response.data
}

export async function getIngresos(desde: string, hasta: string): Promise<IngresosResponse[]> {
    const response = await apiClient.get(PANEL + `ingresos?desde=${desde}&hasta=${hasta}`)
    return response.data
}
