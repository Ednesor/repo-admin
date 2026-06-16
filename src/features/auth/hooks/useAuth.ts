import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginCredentials } from "@/shared/services/api/authApi";

interface Props {
    enabled?: boolean;
}

export function useAuth({ enabled = true }: Props = {}) {
    const navigate = useNavigate();
    
    // Zustand State (Global)
    const loginAction = useAuthStore((state) => state.login);
    const logoutAction = useAuthStore((state) => state.logout);
    const setError = useAuthStore((state) => state.setError);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoadingInitial = useAuthStore((state) => state.isLoadingInitial);

    // --- QUERIES (GET) ---
    const currentUserQuery = useQuery({
        queryKey: ["currentUser"],
        queryFn: checkAuth,
        retry: false,
        staleTime: 5 * 60 * 1000,
        enabled, // El salvavidas para evitar chequear sesión si no hace falta
    });

    // --- MUTATIONS (POST/PUT/DELETE) ---
    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            await loginAction(credentials.username, credentials.password);
        },
        onSuccess: () => {
            navigate("/inicio");
        },
        onError: (error: Error) => {
            setError(error.message || "Credenciales inválidas");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await logoutAction();
        },
        onSuccess: () => {
            navigate("/");
        },
        onError: () => {
            navigate("/");
        },
    });

    return {
        // Datos y estado de sesión
        data: currentUserQuery.data,
        isAuthenticated,
        
        // Carga y errores combinando React Query + Zustand
        isLoading: currentUserQuery.isLoading || isLoadingInitial,
        isError: currentUserQuery.isError,
        isFetching: currentUserQuery.isFetching,
        
        // Acciones
        refetch: currentUserQuery.refetch,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        
        // Mutaciones state
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
    };
}