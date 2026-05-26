import type { GetCategoriesResponse, CategoriaPublic } from "@/types/categoria.types";
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
import { useMemo } from "react";
import RowActions from "@/features/products/components/RowActions";

interface Props {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    data: GetCategoriesResponse | undefined;
    isFetching: boolean;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    totalPages: number;
    onEditCategory?: (categoryId: number) => void;
    onDeleteCategory?: (categoryId: number, categoryName: string) => void;
    onViewDetails?: (categoryId: number) => void;
}

export default function TableCategories({
    sorting,
    columnFilters,
    data,
    isFetching,
    setSorting,
    setColumnFilters,
    setPage,
    page,
    totalPages,
    onEditCategory,
    onDeleteCategory,
    onViewDetails,
}: Props) {
    const columnHelper = createColumnHelper<CategoriaPublic>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("imagen_url", {
                header: "IMAGEN",
                cell: (info) => {
                    const src = info.getValue();
                    return src ? (
                        <img
                            src={src}
                            alt={info.row.original.nombre}
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 font-semibold flex items-center justify-center text-xs">
                            {info.row.original.nombre.slice(0, 2).toUpperCase()}
                        </div>
                    );
                },
            }),

            columnHelper.accessor("nombre", {
                header: "NOMBRE",
                cell: (info) => {
                    const category = info.row.original;

                    return (
                        <div className="min-w-65">
                            <p className="font-semibold text-gray-800">
                                {category.nombre}
                            </p>
                            <p className="text-sm text-gray-400 truncate max-w-[280px]">
                                {category.descripcion || "Sin descripción"}
                            </p>
                        </div>
                    );
                },
            }),

            columnHelper.accessor("parent_id", {
                header: "CATEGORÍA PADRE",
                cell: (info) => {
                    const parentId = info.getValue();
                    if (parentId === null) {
                        return (
                            <span className="text-gray-400">Categoría principal</span>
                        );
                    }
                    return (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium">
                            Subcategoría
                        </span>
                    );
                },
            }),

            columnHelper.accessor("productos", {
                header: "PRODUCTOS",
                cell: (info) => {
                    const productos = info.getValue();
                    const count = productos?.length ?? 0;
                    return (
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">{count}</p>
                        </div>
                    );
                },
            }),

            columnHelper.accessor("subcategorias", {
                header: "SUBCATEGORÍAS",
                cell: (info) => {
                    const subcats = info.getValue();
                    const count = subcats?.length ?? 0;
                    return (
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">{count}</p>
                        </div>
                    );
                },
            }),

            columnHelper.display({
                id: "actions",
                header: "",
                cell: (info) => (
                    <RowActions
                        productId={info.row.original.id}
                        productName={info.row.original.nombre}
                        onEdit={onEditCategory}
                        onDetails={onViewDetails}
                        onDelete={onDeleteCategory}
                    />
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