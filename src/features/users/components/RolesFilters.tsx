import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { RoleCode } from "@/types/user.types";
import { ROLE_LABELS } from "@/types/user.types";

interface Props {
    selectedRoles: RoleCode[];
    onChange: (roles: RoleCode[]) => void;
}

const ROLES: RoleCode[] = ["ADMIN", "STOCK", "PEDIDOS"];

export default function RolesFilters({ selectedRoles, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const toggleRole = (codigo: RoleCode) => {
        if (selectedRoles.includes(codigo)) {
            onChange(selectedRoles.filter((r) => r !== codigo));
        } else {
            onChange([...selectedRoles, codigo]);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className=" h-11 min-w-60 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors
                "
            >
                <span>
                    {selectedRoles.length > 0
                        ? `${selectedRoles.length} roles`
                        : "Todos los roles"}
                </span>

                <FiChevronDown
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    className=" absolute top-14 left-0 w-[320px] max-h-64 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl z-50 p-2
                    "
                >
                    <button
                        onClick={() => onChange([])}
                        className=" w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 mb-2
                        "
                    >
                        Todos los roles
                    </button>

                    {ROLES.map((codigo) => (
                        <button
                            key={codigo}
                            onClick={() => toggleRole(codigo)}
                            className={` w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1
                                ${
                                    selectedRoles.includes(codigo)
                                        ? "bg-amber-100 text-amber-700"
                                        : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            <div
                                className={` w-4 h-4 rounded border flex items-center justify-center
                                    ${
                                        selectedRoles.includes(codigo)
                                            ? "bg-amber-500 border-amber-500"
                                            : "border-gray-300"
                                    }
                                `}
                            >
                                {selectedRoles.includes(codigo) && (
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                            </div>

                            <span className="font-medium">
                                {ROLE_LABELS[codigo]}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
