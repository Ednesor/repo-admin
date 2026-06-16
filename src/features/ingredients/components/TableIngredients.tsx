import type { GetIngredientsResponse, IngredientsPublic } from "@/types/ingredients.types";
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
import RowActions from "./RowActions";

interface Props {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    data: GetIngredientsResponse | undefined;
    isFetching: boolean;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    totalPages: number;
    onEditIngredient?: (ingredientId: number) => void;
    onDeleteIngredient?: (ingredientId: number, ingredientName: string) => void;
    onViewDetails?: (ingredientId: number) => void;
}

export default function TableIngredients({
    sorting,
    columnFilters,
    data,
    isFetching,
    setSorting,
    setColumnFilters,
    setPage,
    page,
    totalPages,
    onEditIngredient,
    onDeleteIngredient,
    onViewDetails,
}: Props) {
    const columnHelper = createColumnHelper<IngredientsPublic>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("nombre", {
                header: "NOMBRE",
                cell: (info) => {
                    const ingredient = info.row.original;

                    return (
                        <div className="min-w-65">
                            <p className="font-semibold text-gray-800">
                                {ingredient.nombre}
                            </p>
                        </div>
                    );
                },
            }),

            columnHelper.accessor("es_alergeno", {
                header: "ALÉRGENO",
                cell: (info) => (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                            info.getValue()
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {info.getValue() ? "Sí" : "No"}
                    </span>
                ),
            }),

            columnHelper.display({
                id: "actions",
                header: "",
                cell: (info) => (
                    <RowActions
                        productId={info.row.original.id}
                        productName={info.row.original.nombre}
                        onEdit={onEditIngredient}
                        onDetails={onViewDetails}
                        onDelete={onDeleteIngredient}
                    />
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: data?.items ?? [],
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
    })

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