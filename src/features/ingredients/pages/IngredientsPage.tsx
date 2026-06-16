import { useAuthStore } from "@/store/useAuthStore";
import TableIngredients from "../components/TableIngredients";
import { useIngredientsTable } from "../hooks/useIngredientsTable";
import { useIngredients } from "../hooks/useIngredients";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import { GoStack } from "react-icons/go";
import IngredientsFilters from "../components/IngredientsFilters";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IngredientModal from "@/shared/components/IngredientModal";
import DeleteIngredientModal from "@/shared/components/DeleteIngredientModal";
import { useCreateIngredient, useUpdateIngredient, useDeleteIngredient } from "../hooks/useIngredients";

const PAGE_SIZE = 10;

export default function IngredientsPage() {
    const role = useAuthStore((state) =>
        state.hasRole("ADMIN") ? "Admin" : "User",
    );
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingIngredientId, setDeletingIngredientId] = useState<number | null>(null);
    const [deletingIngredientName, setDeletingIngredientName] = useState<string>("");

    const createIngredientMutation = useCreateIngredient();
    const updateIngredientMutation = useUpdateIngredient();
    const deleteIngredientMutation = useDeleteIngredient();

    const handleEditIngredient = (ingredientId: number) => {
        setEditingIngredientId(ingredientId);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingIngredientId(null);
    };

    const handleDeleteIngredient = (ingredientId: number, ingredientName: string) => {
        setDeletingIngredientId(ingredientId);
        setDeletingIngredientName(ingredientName);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingIngredientId(null);
        setDeletingIngredientName("");
    };

    const handleViewDetails = (ingredientId: number) => {
        navigate(`/ingredientes/${ingredientId}`);
    };

    const {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    } = useIngredientsTable();

    // HACEMOS UNA SOLA LLAMADA AL BACKEND
    const { data, isLoading, isError, isFetching } = useIngredients({
        page,
        pageSize: PAGE_SIZE,
    });

    // Usamos los items de la página actual para que las cards no exploten.
    const pageItems = data?.items ?? [];

    const totalAllergenic = pageItems.filter((i) => i.es_alergeno).length;
    const totalNonAllergenic = pageItems.filter((i) => !i.es_alergeno).length;

    const cardsItems = [
        {
            Icon: GoStack,
            title: String(data?.total ?? 0),
            description: "Total ingredientes",
            iconColor: "bg-blue-200",
        },
        {
            Icon: GoStack,
            title: String(totalAllergenic),
            description: "Alergénicos (en esta pág)",
            iconColor: "bg-red-200",
        },
        {
            Icon: GoStack,
            title: String(totalNonAllergenic),
            description: "No alergénicos (en esta pág)",
            iconColor: "bg-green-200",
        },
        {
            Icon: GoStack,
            title: String(pageItems.length),
            description: "En esta página",
            iconColor: "bg-gray-200",
        },
    ];

    if (isLoading) return <div className="p-6">Cargando ingredientes...</div>;
    if (isError) return <div className="p-6 text-red-600">Error al cargar ingredientes</div>;

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Ingredientes</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.total ?? 0} ingredientes · Página {page + 1} de{" "}
                        {totalPages}
                    </p>
                </div>
                {role !== "Admin" && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        + Nuevo ingrediente
                    </button>
                )}
            </div>
            <DisplayCardGroup items={cardsItems} />
            <IngredientsFilters />
            <TableIngredients
                sorting={sorting}
                columnFilters={columnFilters}
                data={data}
                isFetching={isFetching}
                setSorting={setSorting}
                setColumnFilters={setColumnFilters}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                onEditIngredient={handleEditIngredient}
                onDeleteIngredient={handleDeleteIngredient}
                onViewDetails={handleViewDetails}
            />
            <IngredientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={(formData) =>
                    createIngredientMutation.mutateAsync(formData)
                }
                mode="create"
            />
            <IngredientModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={async (formData) => {
                    if (editingIngredientId !== null) {
                        await updateIngredientMutation.mutateAsync({
                            id: editingIngredientId,
                            data: formData,
                        });
                    }
                }}
                mode="edit"
                ingredientId={editingIngredientId ?? undefined}
            />
            <DeleteIngredientModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={async () => {
                    if (deletingIngredientId !== null) {
                        await deleteIngredientMutation.mutateAsync(deletingIngredientId);
                    }
                }}
                ingredientName={deletingIngredientName}
                ingredientId={deletingIngredientId ?? 0}
            />
        </div>
    );
}