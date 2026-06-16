import { useAuthStore } from "@/store/useAuthStore";
import TableProducts from "../components/TableProducts";
import { useProductsTable } from "../hooks/useProductsTable";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import { GoStack } from "react-icons/go";
import ProductsFilters from "../components/ProductsFilters";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModal from "@/shared/components/ProductModal";
import DeleteProductModal from "@/shared/components/DeleteProductModal";

const PAGE_SIZE = 10;

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

    const { data, isLoading, isError, isFetching } = useProducts({
        page,
        pageSize: PAGE_SIZE,
        categoryIds: selectedCategories,
        ingredientIds: selectedIngredients,
    });

    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();

    const pageItems = data?.items ?? []; 
    const disponiblesEnPagina = pageItems.filter(p => p.disponible).length;

    const cardsItems = [
        {
            Icon: GoStack,
            title: String(data?.total ?? 0),
            description: "Total productos",
            iconColor: "bg-blue-200",
        },
        {
            Icon: GoStack,
            title: String(disponiblesEnPagina),
            description: "Disponibles (en esta pág)",
            iconColor: "bg-green-200",
        },
        {
            Icon: GoStack,
            title: "-", 
            description: "Sin stock",
            iconColor: "bg-red-200",
        },
        {
            Icon: GoStack,
            title: String(pageItems.length - disponiblesEnPagina),
            description: "Deshabilitados (en esta pág)",
            iconColor: "bg-gray-200",
        },
    ];

    if (isLoading) return <div className="p-6">Cargando productos...</div>;
    if (isError) return <div className="p-6 text-red-600">Error al cargar productos</div>;

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
                onSubmit={(formData) =>
                    createProductMutation.mutateAsync(formData)
                }
                mode="create"
            />
            <ProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={async (formData) => {
                    if (editingProductId !== null) {
                        await updateProductMutation.mutateAsync({
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
                        await deleteProductMutation.mutateAsync(deletingProductId);
                    }
                }}
                productName={deletingProductName}
                productId={deletingProductId ?? 0}
            />
        </div>
    );
}