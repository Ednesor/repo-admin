import { useState, useEffect, useRef } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { CreateCategoryInput, CategoriaPublic } from "@/types/categoria.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCategoryInput) => Promise<unknown>;
    mode: "create" | "edit";
    categoryId?: number;
}

const defaultForm: CreateCategoryInput = {
    parent_id: null,
    nombre: "",
    descripcion: "",
    imagen_url: "",
};

export default function CategoryModal({
    isOpen,
    onClose,
    onSubmit,
    mode,
    categoryId,
}: Props) {
    const [form, setForm] = useState<CreateCategoryInput>(defaultForm);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [parentOpen, setParentOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const lastLoadedCategoryId = useRef<number | null>(null);

    const { singleData: categoryData, isLoading: isLoadingCategory } = useCategories({
        id: categoryId ?? 0,
        enabled: isOpen && mode === "edit" && categoryId !== undefined,
    });

    const { treeData: categoriesTree } = useCategories();

    useEffect(() => {
        if (mode === "edit" && categoryData && categoryData.id !== lastLoadedCategoryId.current) {
            lastLoadedCategoryId.current = categoryData.id;
            setForm({
                parent_id: categoryData.parent_id,
                nombre: categoryData.nombre,
                descripcion: categoryData.descripcion ?? "",
                imagen_url: categoryData.imagen_url ?? "",
            });
        }
    }, [mode, categoryData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMissingFields([]);

        const missing: string[] = [];
        if (!form.nombre.trim()) missing.push("Nombre");

        if (missing.length > 0) {
            setMissingFields(missing);
            return;
        }

        if (newImageUrl.trim()) {
            setForm((prev) => ({ ...prev, imagen_url: newImageUrl.trim() }));
        }

        setIsSubmitting(true);
        try {
            await onSubmit(form);
            resetForm();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { mensaje?: string } } })?.response
                    ?.data?.mensaje ?? "Error al guardar la categoría";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm(defaultForm);
        setNewImageUrl("");
        setError(null);
        setMissingFields([]);
        lastLoadedCategoryId.current = null;
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const flattenCategories = (cats: CategoriaPublic[], depth = 0): { id: number; nombre: string; depth: number }[] => {
        const result: { id: number; nombre: string; depth: number }[] = [];
        for (const cat of cats) {
            result.push({ id: cat.id, nombre: cat.nombre, depth });
            if (cat.subcategorias?.length) {
                result.push(...flattenCategories(cat.subcategorias, depth + 1));
            }
        }
        return result;
    };

    const getParentName = (parentId: number | null): string => {
        if (parentId === null) return "Categoría principal";
        if (!categoriesTree?.data) return "Categoría principal";
        const allCats = flattenCategories(categoriesTree.data);
        const found = allCats.find((c) => c.id === parentId);
        return found ? found.nombre : "Categoría principal";
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "create" ? "Nueva categoría" : "Editar categoría"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {missingFields.length > 0 && (
                    <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 font-medium mb-1">
                            Completá los siguientes campos:
                        </p>
                        <ul className="text-sm text-amber-600">
                            {missingFields.map((field) => (
                                <li key={field}>• {field}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="overflow-y-auto flex-1 p-6">
                    {mode === "edit" && isLoadingCategory ? (
                        <div className="flex items-center justify-center py-12">
                            <FiLoader className="w-8 h-8 text-amber-600 animate-spin" />
                            <span className="ml-3 text-gray-500">
                                Cargando categoría...
                            </span>
                        </div>
                    ) : (
                        <form id="category-form" onSubmit={handleSubmit}>
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
                                        placeholder="Nombre de la categoría"
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
                                        placeholder="Descripción de la categoría"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría padre
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setParentOpen((prev) => !prev)}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                        >
                                            <span>{getParentName(form.parent_id)}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform ${parentOpen ? "rotate-180" : ""}`}
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

                                        {parentOpen && categoriesTree && (
                                            <div className="absolute top-14 left-0 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50 p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm((prev) => ({ ...prev, parent_id: null }));
                                                        setParentOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 ${
                                                        form.parent_id === null
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                                    }`}
                                                >
                                                    Categoría principal
                                                </button>

                                                {flattenCategories(categoriesTree.data).map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (cat.id !== categoryId) {
                                                                setForm((prev) => ({ ...prev, parent_id: cat.id }));
                                                            }
                                                            setParentOpen(false);
                                                        }}
                                                        disabled={cat.id === categoryId}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                            cat.id === categoryId
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : form.parent_id === cat.id
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "hover:bg-gray-100 text-gray-700"
                                                        }`}
                                                        style={{ marginLeft: `${cat.depth * 16}px` }}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                form.parent_id === cat.id
                                                                    ? "bg-amber-500 border-amber-500"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {form.parent_id === cat.id && (
                                                                <div className="w-2 h-2 bg-white rounded-sm" />
                                                            )}
                                                        </div>
                                                        {cat.nombre}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL de imagen
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="url"
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (newImageUrl.trim()) {
                                                        setForm((prev) => ({ ...prev, imagen_url: newImageUrl.trim() }));
                                                        setNewImageUrl("");
                                                    }
                                                }
                                            }}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    {form.imagen_url && (
                                        <div className="mt-2">
                                            <img
                                                src={form.imagen_url}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-xl"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
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
                        form="category-form"
                        disabled={isSubmitting || !form.nombre.trim() || isLoadingCategory}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-sm font-medium text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {mode === "create" ? "Creando..." : "Guardando..."}
                            </>
                        ) : mode === "create" ? (
                            "Crear categoría"
                        ) : (
                            "Guardar cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}