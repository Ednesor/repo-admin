import SearchFilter from "./SearchFilter";
import CategoriesFilters from "./CategoriesFilters";
import IngredientsFilters from "./IngredientsFilters";

interface Props {
    selectedCategories: number[];

    onChange: (ids: number[]) => void;
}

export default function ProductsFilters({
    selectedCategories,
    onChange,
}: Props) {
    return (
        <div className="flex flex-col xl:flex-row gap-3 mb-6">
            <SearchFilter />
            <CategoriesFilters
                selectedCategories={selectedCategories}
                onChange={onChange}
            />
            <IngredientsFilters />
        </div>
    );
}
