import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { RoleCode } from "@/types/user.types";

interface ProtectedRouteProps {
    allowedRoles?: RoleCode[];
    redirectTo?: string;
}

// COMPONENTE 1: Guardián de Rutas Completas
// Se usa en AppRouter.tsx. Envuelve las páginas enteras.
// Si no estás logueado te patea al login. Si no tenés el rol, te patea al panel principal.
// Si tenés acceso, renderiza <Outlet /> (es decir, deja pasar a los componentes hijos de la ruta).
export function ProtectedRoute({
    allowedRoles,
    redirectTo = "/",
}: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isLoadingInitial = useAuthStore((s) => s.isLoadingInitial);
    const userRoles = useAuthStore((s) => s.roles);

    if (isLoadingInitial) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafaf7]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRoleCodes = userRoles.map((r) => r.codigo);
        const hasAccess = allowedRoles.some((role) => userRoleCodes.includes(role));
        if (!hasAccess) {
            return <Navigate to="/panel" replace />;
        }
    }

    return <Outlet />;
}

interface RequireRoleProps {
    roles: RoleCode[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// COMPONENTE 2: Ocultador de UI por Rol (Array de strings)
// Se usa envolviendo pedazos de HTML (ej: un botón).
// Le pasás un array de roles ej: roles={['ADMIN']}. Si el usuario lo tiene, dibuja el botón.
// Si no lo tiene, dibuja el fallback (por defecto nada).
export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
    const userRoles = useAuthStore((s) => s.roles);
    const userRoleCodes = userRoles.map((r) => r.codigo);
    const hasRole = roles.some((role) => userRoleCodes.includes(role));

    if (!hasRole) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

interface RequirePermissionProps {
    children: React.ReactNode;
    canDo?: () => boolean;
    fallback?: React.ReactNode;
}

// COMPONENTE 3: Ocultador de UI por Función de Permiso (El más limpio)
// En vez de pasarle strings duros, le pasás las funciones de Zustand (ej: canDo={canEditProducts})
// Es mucho mejor porque si cambia la lógica de quién puede editar, solo tocás Zustand y esto sigue andando.
export function RequirePermission({ children, canDo, fallback = null }: RequirePermissionProps) {
    const hasPermission = canDo ? canDo() : false;

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}