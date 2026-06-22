// TODO: Cloudinary - Integración de ImageUploader y uploadImage para subir imágenes del producto.
import { useState, useEffect, useRef } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useAuthStore } from "@/store/useAuthStore";
import type { CategoriaPublic } from "@/types/categoria.types";
import type { IngredientsPublic } from "@/types/ingredients.types";
import type { CreateProductInput } from "@/types/products.types";
import ImageUploader from "@/features/products/components/ImageUploader";
import ImageCard from "@/features/products/components/ImageCard";
import { uploadImage } from "@/features/products/services/imageService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductInput) => Promise<void>;
    mode: "create" | "edit";
    productId?: number;
}

const defaultForm: CreateProductInput = {
    nombre: "",
    descripcion: "",
    precio_base: 0,
    imagenes_url: [],
    imagenes_public_id: [],
    stock_cantidad: 0,
    disponible: true,
    categoria_ids: [],
    ingredientes: [],
};

export default function ProductModal({
    isOpen,
    onClose,
    onSubmit,
    mode,
    productId,
}: Props) {
    const [form, setForm] = useState<CreateProductInput>(defaultForm);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [ingredientsOpen, setIngredientsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    // TODO: Cloudinary - Imágenes elegidas pero AÚN no subidas. El upload se difiere hasta el submit para no dejar archivos huérfanos en Cloudinary si el usuario cancela. `url` es un blob local (createObjectURL) sólo para previsualizar.
    const [pendingImages, setPendingImages] = useState<{ file: File; url: string }[]>([]);
    const lastLoadedProductId = useRef<number | null>(null);

    // TODO: Cloudinary - URL.createObjectURL reserva memoria del navegador que no se libera sola; este cleanup revoca los blobs al cambiar/desmontar para evitar memory leaks.
    useEffect(() => {
        return () => {
            pendingImages.forEach((img) => URL.revokeObjectURL(img.url));
        };
    }, [pendingImages]);

    const { treeData: categoriesData } = useCategories();
    const { allData: ingredientsData } = useIngredients({ fetchAll: true });

    // Se desabilita todos los inputs menos el de stock
    const isOnlyStock = useAuthStore((s) => {
        const codes = s.getRoleCodes();
        return codes.includes("STOCK") && !codes.includes("ADMIN");
    });

    const { singleData: productData, isLoading: isLoadingProduct } = useProducts({
        id: productId ?? 0,
        enabled: isOpen && mode === "edit" && productId !== undefined,
    });

    useEffect(() => {
        console.log("ProductModal productData:", productData);
        if (mode === "edit" && productData && productData.id !== lastLoadedProductId.current) {
            lastLoadedProductId.current = productData.id;
            console.log("Setting form with images:", productData.imagenes_url);
            setForm({
                nombre: productData.nombre,
                descripcion: productData.descripcion,
                precio_base: parseFloat(productData.precio_base) || 0,
                imagenes_url: productData.imagenes_url ?? [],
                imagenes_public_id: productData.imagenes_public_id ?? [],
                stock_cantidad: productData.stock_cantidad,
                disponible: productData.disponible,
                categoria_ids: productData.categorias?.map((c) => c.id) ?? [],
                ingredientes: productData.ingredientes?.map((i) => ({ ingrediente_id: i.id, es_removible: true })) ?? [],
            });
        }
    }, [mode, productData]);

    const toggleCategory = (id: number) => {
        setForm((prev: CreateProductInput) => ({
            ...prev,
            categoria_ids: prev.categoria_ids.includes(id)
                ? prev.categoria_ids.filter((cid: number) => cid !== id)
                : [...prev.categoria_ids, id],
        }));
    };

    const toggleIngredient = (id: number) => {
        setForm((prev: CreateProductInput) => {
            const currentIngredientes = prev.ingredientes ?? [];
            const exists = currentIngredientes.some((i) => i.ingrediente_id === id);
            return {
                ...prev,
                ingredientes: exists
                    ? currentIngredientes.filter((i) => i.ingrediente_id !== id)
                    : [...currentIngredientes, { ingrediente_id: id, es_removible: true }],
            };
        });
    };

    // TODO: Cloudinary - No sube nada todavía: sólo guarda el File y un blob URL local para previsualizar. El upload real ocurre en handleSubmit.
    const handleFileSelect = (file: File) => {
        const url = URL.createObjectURL(file);
        setPendingImages((prev) => [...prev, { file, url }]);
    };

    // TODO: Cloudinary - Quita una imagen YA subida. Filtra imagenes_url e imagenes_public_id por el MISMO índice para mantener ambos arrays alineados (el public_id es lo que el backend usa para borrarla de Cloudinary).
    const handleRemoveImage = (index: number) => {
        setForm((prev) => ({
            ...prev,
            imagenes_url: (prev.imagenes_url ?? []).filter((_, i) => i !== index),
            imagenes_public_id: (prev.imagenes_public_id ?? []).filter((_, i) => i !== index),
        }));
    };

    // TODO: Cloudinary - Quita una imagen PENDIENTE (aún no subida). Revoca su blob URL antes de sacarla del array para liberar memoria.
    const handleRemovePendingImage = (index: number) => {
        setPendingImages((prev) => {
            const newPending = [...prev];
            URL.revokeObjectURL(newPending[index].url);
            newPending.splice(index, 1);
            return newPending;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMissingFields([]);

        const missing: string[] = [];
        if (!form.nombre.trim()) missing.push("Nombre");
        if (form.precio_base <= 0) missing.push("Precio base");
        if ((form.stock_cantidad ?? 0) < 0) missing.push("Stock");
        if (form.categoria_ids.length === 0) missing.push("Categorías");
        if (!form.ingredientes || form.ingredientes.length === 0) missing.push("Ingredientes");

        if (missing.length > 0) {
            setMissingFields(missing);
            return;
        }

        setIsSubmitting(true);
        try {
            let dataToSubmit = { ...form };

            // TODO: Cloudinary - Recién acá se suben las pendientes a Cloudinary (vía backend), de forma secuencial. Por cada archivo guardamos su imagen_url + imagen_public_id y los concatenamos a las imágenes ya existentes.
            if (pendingImages.length > 0) {
                const uploadedUrls: string[] = [];
                const uploadedPublicIds: string[] = [];
                
                for (const pending of pendingImages) {
                    const result = await uploadImage(pending.file, "producto");
                    uploadedUrls.push(result.imagen_url);
                    uploadedPublicIds.push(result.imagen_public_id);
                }
                
                dataToSubmit.imagenes_url = [...(dataToSubmit.imagenes_url ?? []), ...uploadedUrls];
                dataToSubmit.imagenes_public_id = [...(dataToSubmit.imagenes_public_id ?? []), ...uploadedPublicIds];
            }

            if (isOnlyStock && mode === "edit") {
                dataToSubmit = { stock_cantidad: form.stock_cantidad } as CreateProductInput;
            }
            await onSubmit(dataToSubmit);
            resetForm();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { mensaje?: string } } })?.response
                    ?.data?.mensaje ?? "Error al guardar el producto";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm(defaultForm);
        setError(null);
        setMissingFields([]);
        pendingImages.forEach((img) => URL.revokeObjectURL(img.url));
        setPendingImages([]);
        lastLoadedProductId.current = null;
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
                        {mode === "create" ? "Nuevo producto" : "Editar producto"}
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
                    {mode === "edit" && isLoadingProduct ? (
                        <div className="flex items-center justify-center py-12">
                            <FiLoader className="w-8 h-8 text-amber-600 animate-spin" />
                            <span className="ml-3 text-gray-500">
                                Cargando producto...
                            </span>
                        </div>
                    ) : (
                        <form id="product-form" onSubmit={handleSubmit}>
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
                                        disabled={isOnlyStock}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
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
                                        disabled={isOnlyStock}
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
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
                                                    precio_base:
                                                        parseFloat(e.target.value) || 0,
                                                }))
                                            }
                                            disabled={isOnlyStock}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
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
                                                        parseInt(e.target.value) || 0,
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
                                            onClick={() => {
                                                if (isOnlyStock) return;
                                                setForm((prev) => ({
                                                    ...prev,
                                                    disponible: !prev.disponible,
                                                }));
                                            }}
                                            className={`w-11 h-6 rounded-full transition-colors relative ${
                                                form.disponible
                                                    ? "bg-amber-500"
                                                    : "bg-gray-200"
                                            } ${isOnlyStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                                            disabled={isOnlyStock}
                                            onClick={() =>
                                                setCategoriesOpen((prev) => !prev)
                                            }
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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

                                                {categoriesData?.items?.map(
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

                                                            {category.subcategorias && category.subcategorias.length > 0 && (
                                                                <div className="ml-5 flex flex-col gap-1">
                                                                    {category.subcategorias.map(
                                                                        (
                                                                            sub: CategoriaPublic,
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
                                            disabled={isOnlyStock}
                                            onClick={() =>
                                                setIngredientsOpen((prev) => !prev)
                                            }
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        >
                                            <span>
                                                {(form.ingredientes ?? []).length > 0
                                                    ? `${(form.ingredientes ?? []).length} ingredientes`
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
                                                            ingredientes: [],
                                                        }))
                                                    }
                                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 mb-2"
                                                >
                                                    Todos los ingredientes
                                                </button>

                                                {ingredientsData?.items?.map(
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
                                                                (form.ingredientes ?? []).some(i => i.ingrediente_id === ingredient.id)
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : "hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                    (form.ingredientes ?? []).some(i => i.ingrediente_id === ingredient.id)
                                                                        ? "bg-amber-500 border-amber-500"
                                                                        : "border-gray-300"
                                                                }`}
                                                            >
                                                                {(form.ingredientes ?? []).some(i => i.ingrediente_id === ingredient.id) && (
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Imágenes
                                    </label>
                                    
                                    <div className="mb-4">
                                        <ImageUploader 
                                            onFileSelect={handleFileSelect} 
                                            disabled={isOnlyStock} 
                                        />
                                    </div>

                                    {((form.imagenes_url ?? []).length > 0 || pendingImages.length > 0) && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                            {(form.imagenes_url ?? []).map(
                                                (url: string, index: number) => (
                                                    <ImageCard
                                                        key={`uploaded-${index}`}
                                                        url={url}
                                                        onRemove={() => handleRemoveImage(index)}
                                                        disabled={isOnlyStock}
                                                    />
                                                ),
                                            )}
                                            {pendingImages.map((img, index) => (
                                                <div key={`pending-${index}`} className="relative">
                                                    <ImageCard
                                                        url={img.url}
                                                        onRemove={() => handleRemovePendingImage(index)}
                                                        disabled={isOnlyStock}
                                                    />
                                                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                                                        Pendiente
                                                    </div>
                                                </div>
                                            ))}
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
                        form="product-form"
                        disabled={isSubmitting || !form.nombre.trim() || isLoadingProduct}
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
                            "Crear producto"
                        ) : (
                            "Guardar cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}