import { useAuthStore } from "@/store/useAuthStore";
import TableProducts from "../components/TableProducts";
import { useProductsTable } from "../hooks/useProductsTable";
import { useProducts } from "../hooks/useProducts";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import { GoStack } from "react-icons/go";
import ProductsFilters from "../components/ProductsFilters";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModal from "@/shared/components/ProductModal";
import DeleteProductModal from "@/shared/components/DeleteProductModal";



export function ProductsPage() {
    const canCreate = useAuthStore((state) => state.canCreateProducts);
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
    const [deletingProductName, setDeletingProductName] = useState<string>("");

    const handleCategoriesChange = (ids: number[]) => {
        setSelectedCategories(ids);
        setPage(0);
    };

    const handleIngredientsChange = (ids: number[]) => {
        setSelectedIngredients(ids);
        setPage(0);
    };

    const handleEditProduct = (productId: number) => {
        setEditingProductId(productId);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingProductId(null);
    };

    const handleDeleteProduct = (productId: number, productName: string) => {
        setDeletingProductId(productId);
        setDeletingProductName(productName);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingProductId(null);
        setDeletingProductName("");
    };

    const handleViewDetails = (productId: number) => {
        navigate(`/productos/${productId}`);
    };

    const {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    } = useProductsTable();

    const { data, isLoading, isError, isFetching, createProduct, updateProduct, deleteProduct } = useProducts({
        page,
        pageSize: 20,
        categoryIds: selectedCategories,
        ingredientIds: selectedIngredients,
    });

    const {
        data: dataAvailable,
        isLoading: isLoadingAvailable,
        isError: isErrorAvailable,
    } = useProducts({
        page,
        pageSize: 20,
        disponible: true,
    });

    const {
        data: dataUnavailable,
        isLoading: isLoadingUnavailable,
        isError: isErrorUnavailable,
    } = useProducts({
        page,
        pageSize: 20,
        disponible: false,
    });

    const cardsItems = [
        {
            Icon: GoStack,
            title: String(data?.total ?? 0),
            description: "Total productos",
            iconColor: "bg-blue-200",
        },
        {
            Icon: GoStack,
            title: String(dataAvailable?.total ?? 0),
            description: "Productos disponibles",
            iconColor: "bg-green-200",
        },
        {
            Icon: GoStack,
            title: String(dataUnavailable?.total ?? 0),
            description: "Deshabilitados",
            iconColor: "bg-gray-200",
        },
    ];

    if (isLoading || isLoadingAvailable || isLoadingUnavailable)
        return <div className="p-6">Cargando productos...</div>;
    if (isError || isErrorAvailable || isErrorUnavailable)
        return (
            <div className="p-6 text-red-600">Error al cargar productos</div>
        );

    const totalPages = data?.pages ?? 1;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.total ?? 0} productos · Página {data?.page ?? 1} de {data?.pages ?? 1}
                    </p>
                </div>
                {canCreate() && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        + Nuevo producto
                    </button>
                )}
            </div>
            <DisplayCardGroup items={cardsItems} />
            <ProductsFilters
                selectedCategories={selectedCategories}
                selectedIngredients={selectedIngredients}
                onCategoriesChange={handleCategoriesChange}
                onIngredientsChange={handleIngredientsChange}
            />
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
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onViewDetails={handleViewDetails}
            />
            <ProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={(formData) => createProduct(formData)}
                mode="create"
            />
            <ProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={async (formData) => {
                    if (editingProductId !== null) {
                        await updateProduct({
                            id: editingProductId,
                            data: formData,
                        });
                    }
                }}
                mode="edit"
                productId={editingProductId ?? undefined}
            />
            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={async () => {
                    if (deletingProductId !== null) {
                        await deleteProduct(deletingProductId);
                    }
                }}
                productName={deletingProductName}
                productId={deletingProductId ?? 0}
            />
        </div>
    );
}
