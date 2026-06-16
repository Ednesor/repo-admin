import { useQuery } from "@tanstack/react-query";
import { getResumen, getVentasPeriodo, getProductosTop, getPedidosEstado, getIngresos } from "@/shared/services/api/panelApi";

interface Props {
    enabled?: boolean;
    desde?: string;
    hasta?: string;
}

export function usePanel({
    enabled = true,
    desde = "",
    hasta = "",
}: Props = {}) {
    // --- QUERIES (GET) ---
    // 1. Get Resumen
    const resumen = useQuery({
        queryKey: ["resumen"],
        queryFn: () => getResumen(),
        enabled: enabled && !!desde && !!hasta,
    });

    // 2. Get Ventas Periodo
    const ventas = useQuery({
        queryKey: ["ventas", desde, hasta],
        queryFn: () => getVentasPeriodo(desde, hasta),
        enabled: enabled && !!desde && !!hasta,
    });

    // 3. Get Productos Top
    const productosTop = useQuery({
        queryKey: ["productos-top", desde, hasta],
        queryFn: () => getProductosTop(desde, hasta),
        enabled: enabled && !!desde && !!hasta,
    });

    // 4. Get Pedidos Estado
    const pedidosEstado = useQuery({
        queryKey: ["pedidos-estado"],
        queryFn: () => getPedidosEstado(),
        enabled: enabled && !!desde && !!hasta,
    });

    // 5. Get Ingresos
    const ingresos = useQuery({
        queryKey: ["ingresos", desde, hasta],
        queryFn: () => getIngresos(desde, hasta),
        enabled: enabled && !!desde && !!hasta,
    });

    return {
        // Datos
        resumenData: resumen.data,
        ventasData: ventas.data,
        productosTopData: productosTop.data,
        pedidosEstadoData: pedidosEstado.data,
        ingresosData: ingresos.data,

        // Carga y recarga
        isLoading: resumen.isLoading || ventas.isLoading || productosTop.isLoading || pedidosEstado.isLoading || ingresos.isLoading,
        isFetching: resumen.isFetching || ventas.isFetching || productosTop.isFetching || pedidosEstado.isFetching || ingresos.isFetching,
        isError: resumen.isError || ventas.isError || productosTop.isError || pedidosEstado.isError || ingresos.isError,
        refetch: () => {
            resumen.refetch();
            ventas.refetch();
            productosTop.refetch();
            pedidosEstado.refetch();
            ingresos.refetch();
        },
    };
}