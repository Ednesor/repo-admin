import { useAuthStore } from "@/store/useAuthStore";
import TableCategories from "../components/TableCategories";
import { useCategoriesTable } from "../hooks/useCategoriesTable";
import { useCategories } from "../hooks/useCategories";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import { GoStack } from "react-icons/go";
import CategoriesFilters from "../components/CategoriesFilters";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "@/shared/components/CategoryModal";
import DeleteCategoryModal from "@/shared/components/DeleteCategoryModal";

const PAGE_SIZE = 10;

export default function CategoriesPage() {
    const role = useAuthStore((state) =>
        state.hasRole("ADMIN") ? "Admin" : "User",
    );
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
    const [deletingCategoryName, setDeletingCategoryName] = useState<string>("");

    const handleEditCategory = (categoryId: number) => {
        setEditingCategoryId(categoryId);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCategoryId(null);
    };

    const handleDeleteCategory = (categoryId: number, categoryName: string) => {
        setDeletingCategoryId(categoryId);
        setDeletingCategoryName(categoryName);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCategoryId(null);
        setDeletingCategoryName("");
    };

    const handleViewDetails = (categoryId: number) => {
        navigate(`/categorias/${categoryId}`);
    };

    const {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    } = useCategoriesTable();

    const { data, isLoading, isError, isFetching, create, update, remove } = useCategories({
        page,
        pageSize: PAGE_SIZE,
    });

    const { data: dataAll } = useCategories({
        page: 0,
        pageSize: 1000,
    });

    const totalParent = dataAll?.data.filter((c) => c.parent_id === null).length ?? 0;
    const totalSubcategories = dataAll?.data.filter((c) => c.parent_id !== null).length ?? 0;
    const totalWithProducts = dataAll?.data.filter((c) => (c.productos?.length ?? 0) > 0).length ?? 0;

    const cardsItems = [
        {
            Icon: GoStack,
            title: String(data?.total ?? 0),
            description: "Total categorías",
            iconColor: "bg-blue-200",
        },
        {
            Icon: GoStack,
            title: String(totalParent),
            description: "Categorías principales",
            iconColor: "bg-orange-200",
        },
        {
            Icon: GoStack,
            title: String(totalSubcategories),
            description: "Subcategorías",
            iconColor: "bg-purple-200",
        },
        {
            Icon: GoStack,
            title: String(totalWithProducts),
            description: "Con productos",
            iconColor: "bg-green-200",
        },
    ];

    if (isLoading) return <div className="p-6">Cargando categorías...</div>;
    if (isError) return <div className="p-6 text-red-600">Error al cargar categorías</div>;

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Categorías</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.total ?? 0} categorías · Página {page + 1} de{" "}
                        {totalPages}
                    </p>
                </div>
                {role === "Admin" && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        + Nueva categoría
                    </button>
                )}
            </div>
            <DisplayCardGroup items={cardsItems} />
            <CategoriesFilters />
            <TableCategories
                sorting={sorting}
                columnFilters={columnFilters}
                data={data}
                isFetching={isFetching}
                setSorting={setSorting}
                setColumnFilters={setColumnFilters}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onViewDetails={handleViewDetails}
            />
            <CategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={(formData) => create(formData)}
                mode="create"
            />
            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={async (formData) => {
                    if (editingCategoryId !== null) {
                        await update({
                            id: editingCategoryId,
                            data: formData,
                        });
                    }
                }}
                mode="edit"
                categoryId={editingCategoryId ?? undefined}
            />
            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={async () => {
                    if (deletingCategoryId !== null) {
                        await remove(deletingCategoryId);
                    }
                }}
                categoryName={deletingCategoryName}
                categoryId={deletingCategoryId ?? 0}
            />
        </div>
    );
}