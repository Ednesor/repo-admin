import { useState } from "react";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function useUsersTable() {
    const [page, setPage] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    return {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    };
}
