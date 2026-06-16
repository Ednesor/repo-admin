import { useState, useEffect, useRef } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import type { CreateIngredientInput } from "@/types/ingredients.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateIngredientInput) => Promise<unknown>;
    mode: "create" | "edit";
    ingredientId?: number;
}

const defaultForm: CreateIngredientInput = {
    nombre: "",
    es_alergeno: false,
    descripcion: "",
};

export default function IngredientModal({
    isOpen,
    onClose,
    onSubmit,
    mode,
    ingredientId,
}: Props) {
    const [form, setForm] = useState<CreateIngredientInput>(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const lastLoadedIngredientId = useRef<number | null>(null);

    const { singleData: ingredientData, isLoading: isLoadingIngredient } = useIngredients({
        id: ingredientId ?? 0,
        enabled: isOpen && mode === "edit" && ingredientId !== undefined,
    });

    useEffect(() => {
        if (mode === "edit" && ingredientData && ingredientData.id !== lastLoadedIngredientId.current) {
            lastLoadedIngredientId.current = ingredientData.id;
            setForm({
                nombre: ingredientData.nombre,
                es_alergeno: ingredientData.es_alergeno,
                descripcion: ingredientData.descripcion ?? "",
            });
        }
    }, [mode, ingredientData]);

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

        setIsSubmitting(true);
        try {
            await onSubmit(form);
            resetForm();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { mensaje?: string } } })?.response
                    ?.data?.mensaje ?? "Error al guardar el ingrediente";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm(defaultForm);
        setError(null);
        setMissingFields([]);
        lastLoadedIngredientId.current = null;
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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "create" ? "Nuevo ingrediente" : "Editar ingrediente"}
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
                    {mode === "edit" && isLoadingIngredient ? (
                        <div className="flex items-center justify-center py-12">
                            <FiLoader className="w-8 h-8 text-amber-600 animate-spin" />
                            <span className="ml-3 text-gray-500">
                                Cargando ingrediente...
                            </span>
                        </div>
                    ) : (
                        <form id="ingredient-form" onSubmit={handleSubmit}>
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
                                        placeholder="Nombre del ingrediente"
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
                                        placeholder="Descripción del ingrediente"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    es_alergeno: !prev.es_alergeno,
                                                }))
                                            }
                                            className={`w-11 h-6 rounded-full transition-colors relative ${
                                                form.es_alergeno
                                                    ? "bg-red-500"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                                    form.es_alergeno
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                }`}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-700">
                                            Es alérgeno
                                        </span>
                                    </label>
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
                        form="ingredient-form"
                        disabled={isSubmitting || !form.nombre.trim() || isLoadingIngredient}
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
                                {mode === "create" ? "Creando..." : "Guardando..."}
                            </>
                        ) : mode === "create" ? (
                            "Crear ingrediente"
                        ) : (
                            "Guardar cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}