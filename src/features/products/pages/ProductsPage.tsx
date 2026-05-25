import { useAuthStore } from "@/store/useAuthStore";
import TableProducts from "../components/TableProducts";
import { useProductsTable } from "../hooks/useProductsTable";
import { useProducts } from "../hooks/useProducts";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import { GoStack } from "react-icons/go";

const PAGE_SIZE = 3;

export function ProductsPage() {
    const role = useAuthStore((state) =>
        state.hasRole("admin") ? "Admin" : "User",
    );

    const {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    } = useProductsTable();

    //Listar todo
    const { data, isLoading, isError, isFetching } = useProducts({
        page,
        pageSize: PAGE_SIZE,
    });

    const {
        data: dataAvailable,
        isLoading: isLoadingAvailable,
        isError: isErrorAvailable,
    } = useProducts({
        page,
        pageSize: PAGE_SIZE,
        avaliable: true,
    });
    const {
        data: dataUnavailable,
        isLoading: isLoadingUnavailable,
        isError: isErrorUnavailable,
    } = useProducts({
        page,
        pageSize: PAGE_SIZE,
        avaliable: false,
    });

    const cardsItems = [
        {
            Icon: GoStack,
            title: String(data?.total ?? 0),
            description: "Total productos",
            iconColor: "bg-blue-200"
        },
        {
            Icon: GoStack,
            title: String(dataAvailable?.total ?? 0),
            description: "Productos disponibles",
            iconColor: "bg-green-200"
        },
        {
            Icon: GoStack,
            title: "1",
            description: "Sin stock",
            iconColor: "bg-red-200"
        },
        {
            Icon: GoStack,
            title: String(dataUnavailable?.total ?? 0),
            description: "Deshabilitaods",
            iconColor: "bg-gray-200"
        },
        
    ];

    if (isLoading || isLoadingAvailable || isLoadingUnavailable)
        return <div className="p-6">Cargando productos...</div>;
    if (isError || isErrorAvailable || isErrorUnavailable)
        return (
            <div className="p-6 text-red-600">Error al cargar productos</div>
        );

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Productos</h1>
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
            <DisplayCardGroup items={cardsItems} />
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
