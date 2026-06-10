import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { Branch } from "./types";
import { MdOutlineDashboard, MdOutlineListAlt } from "react-icons/md";
import { ImStack } from "react-icons/im";
import { TbBottle } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";
import NavBarAdmin from "./NavBarAdmin";
import NavBarUp from "./NavBarUp";
import { RiAdminLine } from "react-icons/ri";

const navItems = [
    { path: "/panel", label: "Panel", icon: <MdOutlineDashboard /> },
    { path: "/pedidos", label: "Pedidos", icon: <MdOutlineListAlt /> },
    { path: "/productos", label: "Productos", icon: <ImStack /> },
    { path: "/ingredientes", label: "Ingredientes", icon: <TbBottle /> },
    { path: "/categorias", label: "Categorías", icon: <BiCategoryAlt /> },
    { path: "/clientes", label: "Clientes", icon: <LuUsers /> },
    { path: "/usuarios", label: "Usuarios", icon: <RiAdminLine /> },
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
    return (
        <div className="min-h-screen flex">
            <NavBarAdmin
                mockBranches={mockBranches}
                user={user}
                roles={roles}
                systemNavItems={systemNavItems}
                navItems={navItems}
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
