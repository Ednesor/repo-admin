import { FiSearch } from "react-icons/fi";

export default function SearchFilter() {
    return (
        <div className="relative flex-1">
            <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />

            <input
                type="text"
                placeholder="Buscar usuario por nombre, apellido o email"
                className=" w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-amber-200 focus:border-amber-400 placeholder:text-gray-400
                    "
            />
        </div>
    );
}
