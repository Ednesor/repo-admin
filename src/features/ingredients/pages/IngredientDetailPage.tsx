import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { useIngredient } from "../hooks/useIngredients";
import { useAuthStore } from "@/store/useAuthStore";

export default function IngredientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const role = useAuthStore((state) =>
        state.hasRole("ADMIN") ? "Admin" : "User",
    );

    const ingredientId = id ? parseInt(id, 10) : 0;
    const { data: ingredient, isLoading, isError } = useIngredient({
        id: ingredientId,
        enabled: !isNaN(ingredientId),
    });

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

    if (isError || !ingredient) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-red-500 mb-4">Error al cargar el ingrediente</p>
                    <button
                        onClick={() => navigate("/ingredientes")}
                        className="text-amber-600 hover:underline"
                    >
                        Volver a ingredientes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/ingredientes")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span>Volver a ingredientes</span>
                </button>
                {role !== "Admin" && (
                    <button
                        onClick={() => navigate(`/ingredientes/${ingredient.id}/editar`)}
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        <FiEdit2 size={16} />
                        Editar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="aspect-video bg-amber-100 flex items-center justify-center">
                        <span className="text-6xl font-bold text-amber-700">
                            {ingredient.nombre.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {ingredient.nombre}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    ID: {ingredient.id}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    ingredient.es_alergeno
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {ingredient.es_alergeno ? (
                                    <>
                                        <FiAlertTriangle size={14} />
                                        Alérgeno
                                    </>
                                ) : (
                                    <>
                                        <FiCheck size={14} />
                                        No alergénico
                                    </>
                                )}
                            </span>
                        </div>

                        {ingredient.descripcion && (
                            <p className="text-gray-600 mb-4">{ingredient.descripcion}</p>
                        )}
                    </div>

                    {ingredient.productos && ingredient.productos.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Productos que contienen este ingrediente
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ingredient.productos.map((prod) => (
                                    <span
                                        key={prod.id}
                                        className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        {prod.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}