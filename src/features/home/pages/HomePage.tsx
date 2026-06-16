import { useMemo, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_LABELS, type RoleCode } from "@/types/user.types";
import { MdOutlineListAlt, MdSoupKitchen } from "react-icons/md";
import { ImStack } from "react-icons/im";
import { TbBottle } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { RiAdminLine } from "react-icons/ri";
import { FiArrowRight } from "react-icons/fi";

interface QuickAction {
    label: string;
    description: string;
    path: string;
    icon: ReactNode;
    iconColor: string;
    roles: RoleCode[];
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        label: "Pedidos",
        description: "Ver y gestionar todos los pedidos",
        path: "/pedidos",
        icon: <MdOutlineListAlt />,
        iconColor: "bg-orange-200 text-orange-700",
        roles: ["ADMIN", "PEDIDOS"],
    },
    {
        label: "Cocina",
        description: "Tablero de pedidos en preparación",
        path: "/cocina",
        icon: <MdSoupKitchen />,
        iconColor: "bg-blue-200 text-blue-700",
        roles: ["ADMIN", "COCINA"],
    },
    {
        label: "Productos",
        description: "Catálogo de productos del menú",
        path: "/productos",
        icon: <ImStack />,
        iconColor: "bg-green-200 text-green-700",
        roles: ["ADMIN", "STOCK"],
    },
    {
        label: "Ingredientes",
        description: "Administrar stock de ingredientes",
        path: "/ingredientes",
        icon: <TbBottle />,
        iconColor: "bg-yellow-200 text-yellow-700",
        roles: ["ADMIN"],
    },
    {
        label: "Categorías",
        description: "Gestionar categorías del menú",
        path: "/categorias",
        icon: <BiCategoryAlt />,
        iconColor: "bg-purple-200 text-purple-700",
        roles: ["ADMIN"],
    },
    {
        label: "Clientes",
        description: "Ver lista de clientes",
        path: "/clientes",
        icon: <LuUsers />,
        iconColor: "bg-pink-200 text-pink-700",
        roles: ["ADMIN"],
    },
    {
        label: "Usuarios",
        description: "Administrar usuarios del sistema",
        path: "/usuarios",
        icon: <RiAdminLine />,
        iconColor: "bg-red-200 text-red-700",
        roles: ["ADMIN"],
    },
];

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
}

export function HomePage() {
    const user = useAuthStore((s) => s.user);
    const roles = useAuthStore((s) => s.roles);

    const roleCodes = useMemo<RoleCode[]>(
        () => roles.map((r) => r.codigo),
        [roles],
    );

    const visibleActions = useMemo(
        () =>
            QUICK_ACTIONS.filter((action) =>
                action.roles.some((role) => roleCodes.includes(role)),
            ),
        [roleCodes],
    );

    const primaryRole: RoleCode | undefined = roles[0]?.codigo;
    const roleLabel = primaryRole ? ROLE_LABELS[primaryRole] : "Sin rol";
    const displayName = user ? `${user.nombre} ${user.apellido}` : "Usuario";

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {getGreeting()}, {displayName}
                </h1>
                <p className="text-gray-500 mt-1">
                    Rol actual:{" "}
                    <span className="font-semibold text-amber-600">{roleLabel}</span>
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Accesos rápidos</h2>
                {visibleActions.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400">
                        No tenés acciones disponibles con tu rol actual.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {visibleActions.map((action) => (
                            <NavLink
                                key={action.path}
                                to={action.path}
                                className="group block"
                            >
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${action.iconColor}`}
                                    >
                                        {action.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-gray-800 truncate">
                                            {action.label}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                                            {action.description}
                                        </p>
                                    </div>
                                    <FiArrowRight className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
                                </div>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
