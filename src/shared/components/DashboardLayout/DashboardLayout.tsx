import { useMemo, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { RoleCode } from "@/types/user.types";
import type { Branch } from "./types";
import { MdOutlineListAlt, MdSoupKitchen, MdSpaceDashboard } from "react-icons/md";
import { ImStack } from "react-icons/im";
import { TbBottle } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";
import NavBarAdmin from "./NavBarAdmin";
import NavBarUp from "./NavBarUp";
import { RiAdminLine } from "react-icons/ri";

interface NavItem {
    path: string;
    label: string;
    icon: ReactNode;
    allowedRoles: RoleCode[];
}

const navItems: NavItem[] = [
    { path: "/inicio", label: "Inicio", icon: <MdSpaceDashboard />, allowedRoles: ["ADMIN", "STOCK", "PEDIDOS", "COCINA"] },
    { path: "/pedidos", label: "Pedidos", icon: <MdOutlineListAlt />, allowedRoles: ["ADMIN", "PEDIDOS"] },
    { path: "/cocina", label: "Cocina", icon: <MdSoupKitchen />, allowedRoles: ["ADMIN", "COCINA"] },
    { path: "/productos", label: "Productos", icon: <ImStack />, allowedRoles: ["ADMIN", "STOCK"] },
    { path: "/ingredientes", label: "Ingredientes", icon: <TbBottle />, allowedRoles: ["ADMIN"] },
    { path: "/categorias", label: "Categorías", icon: <BiCategoryAlt />, allowedRoles: ["ADMIN"] },
    { path: "/clientes", label: "Clientes", icon: <LuUsers />, allowedRoles: ["ADMIN"] },
    { path: "/usuarios", label: "Usuarios", icon: <RiAdminLine />, allowedRoles: ["ADMIN"] },
];
const systemNavItems = [
    { path: "/ayuda", label: "Ayuda", icon: <FaRegQuestionCircle /> },
];

const mockBranches: Branch[] = [
    { id: "1", name: "Sucursal Principal" },
    { id: "2", name: "Sucursal Norte" },
    { id: "3", name: "Sucursal Sur" },
];



export function DashboardLayout() {
    const { user, roles } = useAuthStore();
    console.log(roles)

    const visibleNavItems = useMemo(
        () => {
            const roleCodes = roles.map((r) => r.codigo);
            return navItems.filter((item) =>
                item.allowedRoles.some((role) => roleCodes.includes(role)),
            );
        },
        [roles],
    );

    return (
        <div className="min-h-screen flex">
            <NavBarAdmin
                mockBranches={mockBranches}
                user={user}
                roles={roles}
                systemNavItems={systemNavItems}
                navItems={visibleNavItems}
            />

            <div className="flex-1 flex flex-col bg-[#fafaf7]">
                <NavBarUp user={user} />

                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
