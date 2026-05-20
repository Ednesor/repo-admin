import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/api.types";

interface Props {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
    // const {user, hasRole, isLoading} = useAuthStore();

    //TODO: Implementar auth
    // if (isLoading) {
    //   return <div className="p-6">Loading...</div>;//TODO: Mejorar esto con un spinner o algo más visual
    // }

    // if (!user) {
    //     return <Navigate to="/" replace />;
    // }
    //TODO: Implementar pagina forbidden
    // if(!hasRole(...allowedRoles)){
    //   return <Navigate to="forbidden" replace />;
    // }

    return <Outlet />;
}
