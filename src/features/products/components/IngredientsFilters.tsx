import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import type { IngredientsPublic } from "@/types/ingredients.types";

interface Props {
    selectedIngredients: number[];

    onChange: (ids: number[]) => void;
}

export default function IngredientsFilters({
    selectedIngredients,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    const { allData: data } = useIngredients({ fetchAll: true });

    const toggleIngredient = (id: number) => {
        if (selectedIngredients.includes(id)) {
            onChange(
                selectedIngredients.filter((ingredientId) => ingredientId !== id),
            );

            return;
        }

        onChange([...selectedIngredients, id]);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className=" h-11 min-w-60 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors
                "
            >
                <span>
                    {selectedIngredients.length > 0
                        ? `${selectedIngredients.length} ingredientes`
                        : "Todos los ingredientes"}
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
                        Todos los ingredientes
                    </button>

                    {data?.items?.map((ingredient: IngredientsPublic) => (
                        <button
                            key={ingredient.id}
                            onClick={() => toggleIngredient(ingredient.id)}
                            className={` w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1
                                ${
                                    selectedIngredients.includes(ingredient.id)
                                        ? "bg-amber-100 text-amber-700"
                                        : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <div
                                className={` w-4 h-4 rounded border flex items-center justify-center
                                    ${
                                        selectedIngredients.includes(
                                            ingredient.id,
                                        )
                                            ? "bg-amber-500 border-amber-500"
                                            : "border-gray-300"
                                    }
                                `}
                            >
                                {selectedIngredients.includes(
                                    ingredient.id,
                                ) && (
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                            </div>

                            <span className="font-medium">
                                {ingredient.nombre}
                            </span>
                            {ingredient.es_alergeno && (
                                <span className="ml-auto text-xs text-red-500">
                                    alérgeno
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
