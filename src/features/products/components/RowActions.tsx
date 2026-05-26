import { useState, useRef, useEffect } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { useAuthStore } from "@/store/useAuthStore";

interface RowActionsProps {
    productId: number;
    productName?: string;
    onEdit?: (id: number) => void;
    onDetails?: (id: number) => void;
    onDelete?: (id: number, name: string) => void;
}

export default function RowActions({
    productId,
    productName,
    onEdit,
    onDetails,
    onDelete,
}: RowActionsProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const canEdit = useAuthStore((state) => state.canEditProducts);
    const canDelete = useAuthStore((state) => state.canDeleteProducts);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
                <SlOptions size={18} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                    <button
                        onClick={() => {
                            onDetails?.(productId);
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FiEye size={16} />
                        Detalles
                    </button>
                    {canEdit() && (
                        <button
                            onClick={() => {
                                onEdit?.(productId);
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiEdit2 size={16} />
                            Editar
                        </button>
                    )}
                    {canDelete() && (
                        <button
                            onClick={() => {
                                onDelete?.(productId, productName ?? "");
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FiTrash2 size={16} />
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}