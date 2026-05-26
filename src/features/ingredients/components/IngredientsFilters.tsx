import SearchFilter from "@/features/products/components/SearchFilter";



export default function IngredientsFilters() {
    return (
        <div className="flex flex-col xl:flex-row gap-3 mb-6">
            <SearchFilter />
        </div>
    );
}