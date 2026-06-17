import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useAuthStore } from "@/store/useAuthStore";
import type { CategoriaPublic } from "@/types/categoria.types";
import CategoryModal from "@/shared/components/CategoryModal";

export default function CategoryDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // FIX (intencional): antes el botón "Editar" se mostraba con `role !== "Admin"`, lógica invertida que lo exponía a NO-admins y se lo ocultaba al admin. Se corrige gateando con la capability canManageCategories() (reemplaza el `hasRole("admin") ? "Admin" : "User"` viejo).
    const canManageCategories = useAuthStore((state) => state.canManageCategories);

    const categoryId = id ? parseInt(id, 10) : 0;
    const { singleData: category, isLoading, isError, updateCategory } = useCategories({
        id: categoryId,
        enabled: !isNaN(categoryId),
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 bg-gray-200 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-200 rounded-xl" />
                            <div className="h-24 bg-gray-200 rounded-xl" />
                            <div className="h-10 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !category) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-red-500 mb-4">Error al cargar la categoría</p>
                    <button
                        onClick={() => navigate("/categorias")}
                        className="text-amber-600 hover:underline"
                    >
                        Volver a categorías
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/categorias")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span>Volver a categorías</span>
                </button>
                {canManageCategories() && (
                    <button
                        // Editar abre el modal en la misma página en vez de navegar a /categorias/:id/editar como antes.
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        <FiEdit2 size={16} />
                        Editar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {category.imagen_url ? (
                        <img
                            src={category.imagen_url}
                            alt={category.nombre}
                            className="w-full h-80 object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }}
                        />
                    ) : null}
                    <div className={`aspect-video bg-orange-100 flex items-center justify-center ${category.imagen_url ? "hidden" : ""}`}>
                        <span className="text-6xl font-bold text-orange-700">
                            {category.nombre.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {category.nombre}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    ID: {category.id}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    category.parent_id === null
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-purple-100 text-purple-700"
                                }`}
                            >
                                {category.parent_id === null
                                    ? "Categoría principal"
                                    : "Subcategoría"}
                            </span>
                        </div>

                        {category.descripcion && (
                            <p className="text-gray-600 mb-4">{category.descripcion}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-blue-600 mb-1">Subcategorías</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {category.subcategorias?.length ?? 0}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-sm text-green-600 mb-1">Productos</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {category.productos?.length ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {category.parent_id !== null && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Categoría padre
                            </h3>
                            <button
                                onClick={() => navigate(`/categorias/${category.parent_id}`)}
                                className="text-amber-600 hover:underline"
                            >
                                Ver categoría padre
                            </button>
                        </div>
                    )}

                    {category.subcategorias && category.subcategorias.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Subcategorías
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.subcategorias.map((sub: CategoriaPublic) => (
                                    <span
                                        key={sub.id}
                                        className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        {sub.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {category.productos && category.productos.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Productos en esta categoría
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.productos.map((prod: { id: number; nombre: string }) => (
                                    <span
                                        key={prod.id}
                                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        {prod.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={async (formData) => {
                    await updateCategory({ id: categoryId, data: formData });
                }}
                mode="edit"
                categoryId={categoryId}
            />
        </div>
    );
}