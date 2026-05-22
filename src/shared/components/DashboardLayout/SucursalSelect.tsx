import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { Branch } from "./types";

interface Props {
    mockBranches: Branch[];
}

export default function SucursalSelect({ mockBranches }: Props) {
    const [selectedBranch, setSelectedBranch] = useState<Branch>(
        mockBranches[0],
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full px-4" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-2 w-full px-3 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors text-sm"
            >
                <div className="flex gap-2 items-center">
                    <div>
                        <p className="font-bold text-gray-200 bg-cyan-600 rounded-md w-8 h-8 flex items-center justify-center">
                            {selectedBranch.name.slice(0, 2).toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-200 text-left">
                            {selectedBranch.name.slice(0, 20)}
                        </p>
                        <p className="text-xs text-gray-500 text-left">
                            {mockBranches.length} sucursales
                        </p>
                    </div>
                </div>
                <FiChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isDropdownOpen && (
                <div className="absolute top-full left-5 mt-1 w-54 bg-neutral-800 rounded-lg shadow-lg border border-neutral-600 py-1 z-50">
                    {mockBranches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => {
                                setSelectedBranch(branch);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-600 transition-colors ${
                                selectedBranch.id === branch.id
                                    ? "bg-neutral-700 text-amber-500 font-medium"
                                    : "text-neutral-300"
                            }`}
                        >
                            {branch.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
