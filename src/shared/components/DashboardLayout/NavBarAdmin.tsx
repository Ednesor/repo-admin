import { FaBowlFood } from "react-icons/fa6";
import SucursalSelect from "./SucursalSelect";
import type { Branch } from "./types";
import { NavLink } from "react-router-dom";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import type { UserPublic, RolPublic } from "@/types/user.types";
import { useState } from "react";
import { ROLE_LABELS } from "@/types/user.types";

interface Props {
    mockBranches: Branch[];
    user: UserPublic | null;
    roles: RolPublic[];
    systemNavItems: { path: string; label: string; icon: React.ReactNode }[];
    navItems: { path: string; label: string; icon: React.ReactNode }[];
}

export default function NavBarAdmin({
    mockBranches,
    user,
    roles,
    systemNavItems,
    navItems,
}: Props) {
    const [isMenuHidden] = useState(false);

    const displayName = user ? `${user.nombre} ${user.apellido}` : "Usuario";
    const displayRole: string = roles.length > 0 ? ROLE_LABELS[roles[0].codigo] : "Sin rol";
    const initials = user ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}` : "U";

    return (
        <aside className={`bg-mauve-950 text-white flex flex-col ${isMenuHidden ? "w-20" : "w-64"}`}>
            <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-800 mb-4">
                <div className="bg-amber-600 rounded-md w-10 h-10 flex items-center justify-center">
                    <FaBowlFood className="text-md text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-medium">Food Store</h1>
                    <p className="text-sm text-slate-400">Admin Panel</p>
                </div>
            </div>
            <SucursalSelect mockBranches={mockBranches} />
            <nav className="flex-1 p-4 border-b border-gray-800">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    OPERACIÓN
                </p>
                <ul className="space-y-2 mb-4 border-b-2 border-neutral-800 pb-4">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-neutral-800 text-white after:content-[''] after:absolute after:left-5 after:h-8 after:border-2 break-after-all after:border-amber-500 after:rounded-full"
                                            : "text-neutral-400 hover:bg-neutral-800"
                                    }`
                                }
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-lg">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    SISTEMA
                </p>
                <ul className="space-y-2 mb-4 border-b-2 border-neutral-800 pb-4">
                    {systemNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-neutral-800 text-white after:content-[''] after:absolute after:left-5 after:h-8 after:border-2 break-after-all after:border-amber-500 after:rounded-full"
                                            : "text-neutral-400 hover:bg-neutral-800"
                                    }`
                                }
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-lg">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="grid grid-cols-4 px-4 py-2">
                <div className="flex items-center gap-3 py-2 col-span-3">
                    <div className="bg-blue-200 text-neutral-800 font-medium rounded-full w-10 h-10 flex items-center justify-center">
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm font-medium truncate max-w-35">{displayName}</p>
                        <p className="text-xs text-neutral-400">{displayRole}</p>
                    </div>
                </div>
                <button className="flex items-center justify-center">
                    <BsLayoutSidebarInsetReverse className="text-xl text-neutral-400 hover:text-white cursor-pointer transition-colors duration-100" />
                </button>
            </div>
        </aside>
    );
}
