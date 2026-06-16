import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { useProducts } from "../hooks/useProducts";
import { useAuthStore } from "@/store/useAuthStore";

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const role = useAuthStore((state) =>
        state.hasRole("ADMIN") ? "Admin" : "User",
    );

    const productId = id ? parseInt(id, 10) : 0;
    const { singleData: product, isLoading, isError } = useProducts({
        id: productId,
        enabled: !isNaN(productId),
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

    if (isError || !product) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-red-500 mb-4">Error al cargar el producto</p>
                    <button
                        onClick={() => navigate("/productos")}
                        className="text-amber-600 hover:underline"
                    >
                        Volver a productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/productos")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span>Volver a productos</span>
                </button>
                {role !== "Admin" && (
                    <button
                        onClick={() => navigate(`/productos/${product.id}/editar`)}
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        <FiEdit2 size={16} />
                        Editar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {product.imagenes_url && product.imagenes_url.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1">
                            {product.imagenes_url.map((url: string, index: number) => (
                                <div
                                    key={index}
                                    className={`${
                                        index === 0 ? "col-span-2 aspect-video" : "aspect-square"
                                    }`}
                                >
                                    <img
                                        src={url}
                                        alt={`${product.nombre} - imagen ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-video bg-amber-100 flex items-center justify-center">
                            <span className="text-4xl font-bold text-amber-700">
                                {product.nombre.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {product.nombre}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    ID: {product.id}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    product.disponible
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {product.disponible ? (
                                    <>
                                        <FiCheck size={14} />
                                        Disponible
                                    </>
                                ) : (
                                    <>
                                        <FiX size={14} />
                                        No disponible
                                    </>
                                )}
                            </span>
                        </div>

                        {product.descripcion && (
                            <p className="text-gray-600 mb-4">{product.descripcion}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-blue-600 mb-1">Precio base</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    ${parseFloat(product.precio_base).toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4">
                                <p className="text-sm text-orange-600 mb-1">Stock</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {product.stock_cantidad}
                                </p>
                                <p className="text-xs text-orange-500">unidades</p>
                            </div>
                        </div>
                    </div>

                    {product.categorias && product.categorias.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Categorías
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.categorias.map((cat: { id: number; nombre: string }) => (
                                    <span
                                        key={cat.id}
                                        className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                                    >
                                        • {cat.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.ingredientes && product.ingredientes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Ingredientes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.ingredientes.map((ing: { id: number; nombre: string; es_alergeno: boolean }) => (
                                    <span
                                        key={ing.id}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                            ing.es_alergeno
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {ing.nombre}
                                        {ing.es_alergeno && " ⚠️"}
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