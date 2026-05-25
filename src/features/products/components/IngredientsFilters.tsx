import { FiChevronDown } from "react-icons/fi";

export default function IngredientsFilters() {
    return (
        <button
            className=" h-11 min-w-55 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors
                "
        >
            <div className="flex items-center gap-2">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-400"
                >
                    <path
                        d="M4 5H20L14 12V18L10 20V12L4 5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <span>Todos los ingredientes</span>
            </div>

            <FiChevronDown className="text-gray-400" size={16} />
        </button>
    );
}
