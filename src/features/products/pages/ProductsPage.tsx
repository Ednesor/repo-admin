import { useState } from "react";
import {
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { getProducts } from "@/shared/services/api/productsApi";
import TableProducts from "../components/TableProducts";

const PAGE_SIZE = 3;

export function ProductsPage() {
    const role = useAuthStore((state) =>
        state.hasRole("admin") ? "Admin" : "User",
    );

    const [page, setPage] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["products", page],
        queryFn: () =>
            getProducts({
                offset: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                include_only_active: false,
            }),
    });

    if (isLoading) return <div className="p-6">Cargando productos...</div>;
    if (isError)
        return (
            <div className="p-6 text-red-600">Error al cargar productos</div>
        );

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.total ?? 0} productos · Página {page + 1} de{" "}
                        {totalPages}
                    </p>
                </div>
                {role === "Admin" && (
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        + Nuevo producto
                    </button>
                )}
            </div>
            <TableProducts
                sorting={sorting}
                columnFilters={columnFilters}
                data={data}
                isFetching={isFetching}
                setSorting={setSorting}
                setColumnFilters={setColumnFilters}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
            />
        </div>
    );
}
