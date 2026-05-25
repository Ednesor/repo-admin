import SearchFilter from "./SearchFilter";
import CategoriesFilters from "./CategoriesFilters";
import IngredientsFilters from "./IngredientsFilters";

interface Props {
    selectedCategories: number[];
    selectedIngredients: number[];

    onCategoriesChange: (ids: number[]) => void;
    onIngredientsChange: (ids: number[]) => void;
}

export default function ProductsFilters({
    selectedCategories,
    selectedIngredients,
    onCategoriesChange,
    onIngredientsChange,
}: Props) {
    return (
        <div className="flex flex-col xl:flex-row gap-3 mb-6">
            <SearchFilter />
            <CategoriesFilters
                selectedCategories={selectedCategories}
                onChange={onCategoriesChange}
            />
            <IngredientsFilters
                selectedIngredients={selectedIngredients}
                onChange={onIngredientsChange}
            />
        </div>
    );
}
