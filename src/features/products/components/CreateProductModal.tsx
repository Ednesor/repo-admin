import { useState } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCategoriesTree } from "../hooks/useCategoriesTree";
import { useIngredients } from "../hooks/useIngredients";
import type { CategoriaPublic } from "@/types/categoria.types";
import type { IngredientsPublic } from "@/types/ingredients.types";
import type { CreateProductInput } from "@/types/products.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductInput) => Promise<void>;
}

export default function CreateProductModal({
    isOpen,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<CreateProductInput>({
        nombre: "",
        descripcion: "",
        precio_base: 0,
        imagenes_url: [],
        stock_cantidad: 0,
        disponible: true,
        categoria_ids: [],
        ingrediente_ids: [],
    });
    const [newImageUrl, setNewImageUrl] = useState("");
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [ingredientsOpen, setIngredientsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categoriesData } = useCategoriesTree();
    const { data: ingredientsData } = useIngredients();

    const toggleCategory = (id: number) => {
        setForm((prev) => ({
            ...prev,
            categoria_ids: prev.categoria_ids.includes(id)
                ? prev.categoria_ids.filter((cid) => cid !== id)
                : [...prev.categoria_ids, id],
        }));
    };

    const toggleIngredient = (id: number) => {
        setForm((prev) => ({
            ...prev,
            ingrediente_ids: prev.ingrediente_ids.includes(id)
                ? prev.ingrediente_ids.filter((iid) => iid !== id)
                : [...prev.ingrediente_ids, id],
        }));
    };

    const addImageUrl = () => {
        if (newImageUrl.trim()) {
            setForm((prev) => ({
                ...prev,
                imagenes_url: [...prev.imagenes_url, newImageUrl.trim()],
            }));
            setNewImageUrl("");
        }
    };

    const removeImageUrl = (index: number) => {
        setForm((prev) => ({
            ...prev,
            imagenes_url: prev.imagenes_url.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;

        if (newImageUrl.trim()) {
            addImageUrl();
        }

        setIsSubmitting(true);
        try {
            await onSubmit(form);
            resetForm();
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({
            nombre: "",
            descripcion: "",
            precio_base: 0,
            imagenes_url: [],
            stock_cantidad: 0,
            disponible: true,
            categoria_ids: [],
            ingrediente_ids: [],
        });
        setNewImageUrl("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Nuevo producto
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="create-product-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            nombre: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Nombre del producto"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            descripcion: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                    placeholder="Descripción del producto"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio base *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.precio_base || ""}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                precio_base: parseFloat(
                                                    e.target.value,
                                                ) || 0,
                                            }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock_cantidad || ""}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                stock_cantidad:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                disponible: !prev.disponible,
                                            }))
                                        }
                                        className={`w-11 h-6 rounded-full transition-colors relative ${
                                            form.disponible
                                                ? "bg-amber-500"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                                form.disponible
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Disponible
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categorías
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCategoriesOpen((prev) => !prev)
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                    >
                                        <span>
                                            {form.categoria_ids.length > 0
                                                ? `${form.categoria_ids.length} categorías`
                                                : "Seleccionar categorías"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${
                                                categoriesOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {categoriesOpen && (
                                        <div className="absolute top-14 left-0 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50 p-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        categoria_ids: [],
                                                    }))
                                                }
                                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 mb-2"
                                            >
                                                Todas las categorías
                                            </button>

                                            {categoriesData?.data.map(
                                                (category: CategoriaPublic) => (
                                                    <div key={category.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCategory(
                                                                    category.id,
                                                                )
                                                            }
                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                                form.categoria_ids.includes(
                                                                    category.id,
                                                                )
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : "hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                    form.categoria_ids.includes(
                                                                        category.id,
                                                                    )
                                                                        ? "bg-amber-500 border-amber-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                            >
                                                                {form.categoria_ids.includes(
                                                                    category.id,
                                                                ) && (
                                                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                                                )}
                                                            </div>
                                                            {category.nombre}
                                                        </button>

                                                        {category.subcategorias
                                                            ?.length > 0 && (
                                                            <div className="ml-5 flex flex-col gap-1">
                                                                {category.subcategorias.map(
                                                                    (
                                                                        sub,
                                                                    ) => (
                                                                        <button
                                                                            type="button"
                                                                            key={
                                                                                sub.id
                                                                            }
                                                                            onClick={() =>
                                                                                toggleCategory(
                                                                                    sub.id,
                                                                                )
                                                                            }
                                                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                                                form.categoria_ids.includes(
                                                                                    sub.id,
                                                                                )
                                                                                    ? "bg-amber-100 text-amber-700"
                                                                                    : "hover:bg-gray-100 text-gray-600"
                                                                            }`}
                                                                        >
                                                                            <div
                                                                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                                    form.categoria_ids.includes(
                                                                                        sub.id,
                                                                                    )
                                                                                        ? "bg-amber-500 border-amber-500"
                                                                                        : "border-gray-300"
                                                                                }`}
                                                                            >
                                                                                {form.categoria_ids.includes(
                                                                                    sub.id,
                                                                                ) && (
                                                                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                                                                )}
                                                                            </div>
                                                                            {
                                                                                sub.nombre
                                                                            }
                                                                        </button>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ingredientes
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIngredientsOpen((prev) => !prev)
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                    >
                                        <span>
                                            {form.ingrediente_ids.length > 0
                                                ? `${form.ingrediente_ids.length} ingredientes`
                                                : "Seleccionar ingredientes"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${
                                                ingredientsOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {ingredientsOpen && (
                                        <div className="absolute top-14 left-0 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50 p-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        ingrediente_ids: [],
                                                    }))
                                                }
                                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 mb-2"
                                            >
                                                Todos los ingredientes
                                            </button>

                                            {ingredientsData?.map(
                                                (ingredient: IngredientsPublic) => (
                                                    <button
                                                        key={ingredient.id}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleIngredient(
                                                                ingredient.id,
                                                            )
                                                        }
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                            form.ingrediente_ids.includes(
                                                                ingredient.id,
                                                            )
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "hover:bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                form.ingrediente_ids.includes(
                                                                    ingredient.id,
                                                                )
                                                                    ? "bg-amber-500 border-amber-500"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {form.ingrediente_ids.includes(
                                                                ingredient.id,
                                                            ) && (
                                                                <div className="w-2 h-2 bg-white rounded-sm" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium">
                                                            {
                                                                ingredient.nombre
                                                            }
                                                        </span>
                                                        {ingredient.es_alergeno && (
                                                            <span className="ml-auto text-xs text-red-500">
                                                                alérgeno
                                                            </span>
                                                        )}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URLs de imágenes
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) =>
                                            setNewImageUrl(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addImageUrl();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImageUrl}
                                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        <FiPlus className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {form.imagenes_url.length > 0 && (
                                    <div className="space-y-2">
                                        {form.imagenes_url.map(
                                            (url, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                                                >
                                                    <span className="flex-1 text-sm text-gray-600 truncate">
                                                        {url}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImageUrl(index)
                                                        }
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        <FiTrash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="create-product-form"
                        disabled={isSubmitting || !form.nombre.trim()}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-sm font-medium text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Creando...
                            </>
                        ) : (
                            "Crear producto"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}