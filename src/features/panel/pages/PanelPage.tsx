import { useState } from "react";
import { usePanel } from "@/features/panel/hooks/usePanel";
import { MdFilterList, MdTrendingUp, MdShoppingBag, MdRestaurant, MdPayments } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Pie, PieChart, Legend } from "recharts";

// Colores para el gráfico de torta
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function PanelPage() {
    // Manejamos lo que ves en pantalla mientras tocás los inputs de fecha
    const [desdeInput, setDesdeInput] = useState("2026-01-01");
    const [hastaInput, setHastaInput] = useState("2026-06-15");

    // Esta es la fecha que dispara las búsquedas a la API. Solo cambia al darle a "Filtrar"
    const [desde, setDesde] = useState("2026-01-01");
    const [hasta, setHasta] = useState("2026-06-15");

    // Nos traemos toda la data del panel. Fija que este hook reacciona a la fecha oficial
    const {
        resumenData,
        ventasData,
        productosTopData,
        pedidosEstadoData,
        ingresosData,
        isLoading
    } = usePanel({ desde, hasta });

    const aplicarFechas = () => {
        setDesde(desdeInput);
        setHasta(hastaInput);
    };

    // Le inyectamos el color a cada porción de la torta directamente en la data para que Recharts no reniegue
    const pedidosEstadoConColor = pedidosEstadoData?.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
    })) || [];

    if (isLoading) return <div className="p-10 text-center">Cargando estadísticas...</div>
    return (
        <div className="w-full max-w-[1600px] mx-auto pb-10">
            {/* Cabecera del Panel */}
            <header className="flex justify-between items-center w-full mb-10">
                <div className="flex flex-col">
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Panel de Administración</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Bienvenido de nuevo, Admin Gourmet</p>
                </div>
            </header>

            {/* Filtros de Fechas */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl elegant-shadow mb-8 flex flex-col md:flex-row items-end gap-gutter border border-white/50">
                <div className="w-full md:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Desde</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={desdeInput}
                                onChange={(e) => setDesdeInput(e.target.value)}
                                className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface font-body-md"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hasta</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={hastaInput}
                                onChange={(e) => setHastaInput(e.target.value)}
                                className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface font-body-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Dispara la búsqueda oficial de las fechas */}
                <button
                    onClick={aplicarFechas}
                    className="bg-amber-600 text-white px-8 py-3 rounded-xl font-label-md text-label-md flex items-center gap-2 hover:bg-amber-700 active:scale-95 transition-all shadow-md shadow-amber-600/20"
                >
                    <MdFilterList className="text-[20px]" />
                    Filtrar Fechas
                </button>
            </section>

            {/* Tarjetas de Resumen Rápido (KPIs) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-8">
                <div className="bg-surface-container-lowest p-6 rounded-2xl elegant-shadow card-hover border border-white/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <MdTrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-on-surface-variant font-label-md text-label-md mb-1">Ventas de Hoy</p>
                    <h3 className="text-headline-md font-headline-md text-on-surface">${Number(resumenData?.ventas_hoy || 0).toFixed(2)}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl elegant-shadow card-hover border border-white/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                            <MdShoppingBag size={24} />
                        </div>
                    </div>
                    <p className="text-on-surface-variant font-label-md text-label-md mb-1">Ticket Promedio</p>
                    <h3 className="text-headline-md font-headline-md text-on-surface">${Number(resumenData?.ticket_promedio || 0).toFixed(2)}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl elegant-shadow card-hover border border-white/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-tertiary/10 text-tertiary">
                            <MdRestaurant size={24} />
                        </div>
                    </div>
                    <p className="text-on-surface-variant font-label-md text-label-md mb-1">Pedidos Activos</p>
                    <h3 className="text-headline-md font-headline-md text-on-surface">{resumenData?.pedidos_activos || 0}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl elegant-shadow card-hover border border-white/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant">
                            <MdPayments size={24} />
                        </div>
                    </div>
                    <p className="text-on-surface-variant font-label-md text-label-md mb-1">Ingresos del Mes</p>
                    <h3 className="text-headline-md font-headline-md text-on-surface">${Number(resumenData?.ingresos_mes || 0).toFixed(2)}</h3>
                </div>
            </section>

            {/* Zona de Gráficos: Metimos todo en una grilla CSS de 3 columnas para aprovechar mejor el espacio vertical */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">

                {/* El gráfico de líneas principal toma todo el ancho de arriba */}
                <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl elegant-shadow border border-white/50 overflow-hidden">
                    <div className="p-3 border-b border-surface-container">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">Ventas por Período</h4>
                    </div>
                    <div className="p-4 h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ventasData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="total_ventas" stroke="#3525cd" strokeWidth={3} name="Total ($)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="cantidad_pedidos" stroke="#8127cf" strokeWidth={2} strokeDasharray="6 4" name="Cant. Pedidos" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAFICO: Top Productos */}
                <div className="bg-surface-container-lowest rounded-2xl elegant-shadow border border-white/50 overflow-hidden h-[280px] flex flex-col">
                    <div className="p-3 border-b border-surface-container">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">Top Productos</h4>
                    </div>
                    <div className="p-3 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productosTopData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="ingresos" fill="#3525cd" radius={[4, 4, 0, 0]} name="Ingresos ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAFICO: Pedidos por Estado */}
                <div className="bg-surface-container-lowest rounded-2xl elegant-shadow border border-white/50 overflow-hidden h-[280px] flex flex-col">
                    <div className="p-3 border-b border-surface-container">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">Distribución por Estado</h4>
                    </div>
                    <div className="p-3 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pedidosEstadoConColor}
                                    dataKey="cantidad"
                                    nameKey="estado_codigo"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    stroke="none"
                                    label={({ name, value }) => `${name}: ${value}`}
                                    labelLine={true}
                                />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAFICO: Ingresos por Forma de Pago */}
                <div className="bg-surface-container-lowest rounded-2xl elegant-shadow border border-white/50 overflow-hidden h-[280px] flex flex-col">
                    <div className="p-3 border-b border-surface-container">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">Ingresos por Forma de Pago</h4>
                    </div>
                    <div className="p-3 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={ingresosData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis dataKey="forma_pago_codigo" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="total" fill="#005338" radius={[0, 4, 4, 0]} name="Total ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div >
    )
}
