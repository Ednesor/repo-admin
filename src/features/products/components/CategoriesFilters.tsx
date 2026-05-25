import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { useCategoriesTree } from "../hooks/useCategoriesTree";
import type { CategoriaPublic } from "@/types/categoria.types";

interface Props {
    selectedCategories: number[];

    onChange: (ids: number[]) => void;
}

export default function ProductsFilters({
    selectedCategories,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    const { data } = useCategoriesTree();

    const toggleCategory = (id: number) => {
        if (selectedCategories.includes(id)) {
            onChange(
                selectedCategories.filter((categoryId) => categoryId !== id),
            );

            return;
        }

        onChange([...selectedCategories, id]);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className=" h-11 min-w-60 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors
                "
            >
                <span>
                    {selectedCategories.length > 0
                        ? `${selectedCategories.length} categorías`
                        : "Todas las categorías"}
                </span>

                <FiChevronDown
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    className=" absolute top-14 left-0 w-[320px] max-h-105 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl z-50 p-2
                    "
                >
                    <button
                        onClick={() => onChange([])}
                        className=" w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 mb-2
                        "
                    >
                        Todas las categorías
                    </button>

                    {data?.data.map((category: CategoriaPublic) => (
                        <div key={category.id} className="mb-3">
                            {/* CATEGORY */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className={` w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                    ${
                                        selectedCategories.includes(category.id)
                                            ? "bg-amber-100 text-amber-700"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }
                                `}
                            >
                                <div
                                    className={` w-4 h-4 rounded border flex items-center justify-center
                                        ${
                                            selectedCategories.includes(
                                                category.id,
                                            )
                                                ? "bg-amber-500 border-amber-500"
                                                : "border-gray-300"
                                        }
                                    `}
                                >
                                    {selectedCategories.includes(
                                        category.id,
                                    ) && (
                                        <div className="w-2 h-2 bg-white rounded-sm" />
                                    )}
                                </div>

                                <span className="font-medium">
                                    {category.nombre}
                                </span>
                            </button>

                            {/* SUBCATEGORIES */}
                            {category.subcategorias?.length > 0 && (
                                <div className="ml-6 mt-1 flex flex-col gap-1">
                                    {category.subcategorias.map(
                                        (subcategory: CategoriaPublic) => (
                                            <button
                                                key={subcategory.id}
                                                onClick={() =>
                                                    toggleCategory(
                                                        subcategory.id,
                                                    )
                                                }
                                                className={` flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                                    ${
                                                        selectedCategories.includes(
                                                            subcategory.id,
                                                        )
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "hover:bg-gray-100 text-gray-600"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={` w-4 h-4 rounded border flex items-center justify-center
                                                        ${
                                                            selectedCategories.includes(
                                                                subcategory.id,
                                                            )
                                                                ? "bg-amber-500 border-amber-500"
                                                                : "border-gray-300"
                                                        }
                                                    `}
                                                >
                                                    {selectedCategories.includes(
                                                        subcategory.id,
                                                    ) && (
                                                        <div className="w-2 h-2 bg-white rounded-sm" />
                                                    )}
                                                </div>

                                                <span>
                                                    {subcategory.nombre}
                                                </span>
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
