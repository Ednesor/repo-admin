import type { GetProductsResponse } from "@/types/api.types";
import type { ProductsPublic } from "@/types/products.types";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type ColumnFiltersState,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { SlOptions } from "react-icons/sl";

interface Props {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    data: GetProductsResponse | undefined;
    isFetching: boolean;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    totalPages: number;
}

export default function TableProducts({
    sorting,
    columnFilters,
    data,
    isFetching,
    setSorting,
    setColumnFilters,
    setPage,
    page,
    totalPages,
}: Props) {
    const columnHelper = createColumnHelper<ProductsPublic>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("imagenes_url", {
                header: "IMAGEN",
                cell: (info) => {
                    const urls = info.getValue();
                    const src = urls?.[0];

                    return (
                        <div className="w-14">
                            {src ? (
                                <img
                                    src={src}
                                    alt="producto"
                                    className="w-12 h-12 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-semibold flex items-center justify-center">
                                    {info.row.original.nombre
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>
                    );
                },
            }),

            columnHelper.accessor("nombre", {
                header: "PRODUCTO",
                cell: (info) => {
                    const product = info.row.original;

                    return (
                        <div className="min-w-65">
                            <p className="font-semibold text-gray-800">
                                {product.nombre}
                            </p>

                            <p className="text-sm text-gray-400 truncate max-w-[320px]">
                                {product.descripcion}
                            </p>
                        </div>
                    );
                },
            }),

            columnHelper.accessor("categorias", {
                header: "CATEGORÍA",
                cell: (info) => {
                    const cats = info.getValue();

                    if (!cats?.length) {
                        return (
                            <span className="text-gray-400">Sin categoría</span>
                        );
                    }

                    return (
                        <div className="flex flex-wrap gap-2">
                            {cats.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                    • {cat.nombre}
                                </span>
                            ))}
                        </div>
                    );
                },
            }),

            columnHelper.accessor("precio_base", {
                header: "PRECIO BASE",
                cell: (info) => (
                    <div className="">
                        <p className="font-bold text-gray-800">
                            ${info.getValue().toString()}
                        </p>
                        <p className="text-sm font-medium text-gray-400">por unidad</p>
                    </div>
                ),
            }),

            columnHelper.accessor("stock_cantidad", {
                header: "STOCK",
                cell: (info) => (
                    <div className="text-center">
                        <p className="font-semibold text-gray-700">
                            {info.getValue()}
                        </p>

                        <p className="text-xs text-gray-400">un</p>
                    </div>
                ),
            }),

            columnHelper.accessor("disponible", {
                header: "ESTADO",
                cell: (info) => (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            info.getValue()
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />

                        {info.getValue() ? "Disponible" : "No disponible"}
                    </span>
                ),
            }),

            columnHelper.display({
                id: "actions",
                header: "",
                cell: () => (
                    <button className="text-gray-500 hover:text-black transition-colors">
                        <SlOptions size={18} />
                    </button>
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="px-6 py-4 text-left text-xs font-bold tracking-wide text-gray-400 cursor-pointer select-none"
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}

                                            {{
                                                asc: "↑",
                                                desc: "↓",
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 align-middle"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(0)}
                        disabled={page === 0 || isFetching}
                        className="h-9 w-9 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        «
                    </button>

                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0 || isFetching}
                        className="h-9 w-9 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        ‹
                    </button>

                    <div className="px-3 text-sm font-medium text-gray-600">
                        Página {page + 1} de {totalPages}
                    </div>

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={page >= totalPages - 1 || isFetching}
                        className="h-9 w-9 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        ›
                    </button>

                    <button
                        onClick={() => setPage(totalPages - 1)}
                        disabled={page >= totalPages - 1 || isFetching}
                        className="h-9 w-9 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        »
                    </button>
                </div>

                {isFetching && (
                    <span className="text-sm text-gray-500">Cargando...</span>
                )}
            </div>
        </div>
    );
}
