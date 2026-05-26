import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BsLayoutSidebarInsetReverse, BsSearch, BsBell, BsGear, BsBoxArrowRight, BsPerson } from "react-icons/bs";
import type { UserPublic } from "@/types/user.types";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_LABELS } from "@/types/user.types";
import { useQueryClient } from "@tanstack/react-query";
interface Props {
    user: UserPublic | null;
}
export default function NavBarUp({ user }: Props) {
    const location = useLocation();
    const currentPage = location.pathname.slice(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const logoutMutation = useLogout();
    const clearSession = useAuthStore((state) => state.clearSession);
    const roles = useAuthStore((state) => state.roles);
    const queryClient = useQueryClient();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch {
            clearSession();
            queryClient.clear();
        }
        setDropdownOpen(false);
    };

    const displayName = user ? `${user.nombre} ${user.apellido}` : "Usuario";
    const displayRole = roles.length > 0 ? ROLE_LABELS[roles[0].codigo] : "Sin rol";
    const initials = user ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}` : "U";
    return (
        <header className="shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <BsLayoutSidebarInsetReverse className="text-xl text-gray-600" />
                </button>
                <nav className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Inicio</span>
                    <span className="text-gray-400">›</span>
                    <span className="font-medium text-gray-900 capitalize">
                        {currentPage}
                    </span>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Buscar pedidos, productos, clientes..."
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <BsBell className="text-xl text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                    + Nuevo pedido
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    >
                        <div className="bg-blue-200 text-neutral-800 font-medium rounded-full w-10 h-10 flex items-center justify-center">
                            {initials}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-neutral-500">{displayRole}</p>
                        </div>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <BsPerson className="text-gray-500" />
                                Mi perfil
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <BsGear className="text-gray-500" />
                                Configuración
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <BsBoxArrowRight className="text-red-500" />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}