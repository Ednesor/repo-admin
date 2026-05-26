import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { RoleCode } from "@/types/user.types";

interface ProtectedRouteProps {
    allowedRoles?: RoleCode[];
    redirectTo?: string;
}

export function ProtectedRoute({
    allowedRoles,
    redirectTo = "/",
}: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isLoadingInitial = useAuthStore((s) => s.isLoadingInitial);
    const userRoles = useAuthStore((s) => s.roles);

    console.log("[ProtectedRoute] allowedRoles:", allowedRoles);
    console.log("[ProtectedRoute] userRoles:", userRoles);

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

export function RequirePermission({ children, canDo, fallback = null }: RequirePermissionProps) {
    const hasPermission = canDo ? canDo() : false;

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}