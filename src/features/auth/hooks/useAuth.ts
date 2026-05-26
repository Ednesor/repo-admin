import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginCredentials } from "@/shared/services/api/authApi";

export function useLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const setError = useAuthStore((state) => state.setError);

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            await login(credentials.username, credentials.password);
        },
        onSuccess: () => {
            navigate("/panel");
        },
        onError: (error: Error) => {
            setError(error.message || "Credenciales inválidas");
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: async () => {
            await logout();
        },
        onSuccess: () => {
            navigate("/");
        },
        onError: () => {
            navigate("/");
        },
    });
}

export function useCurrentUser() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: checkAuth,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useRequireAuth() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoadingInitial = useAuthStore((state) => state.isLoadingInitial);

    return {
        isAuthenticated,
        isLoading: isLoadingInitial,
    };
}