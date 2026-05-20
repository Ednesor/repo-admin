import { create } from "zustand";
import type {
    UserPublic,
    UserRole,
    UserRegisterPayload,
} from "@/types/api.types";
import * as authApi from "@/shared/services/api/authApi"

interface AuthState {
    user: UserPublic | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    hasRole: (...roles: UserRole[]) => boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (payload: UserRegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearSession: () => void;
    setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    setError: (msg) => set({ error: msg }),

    hasRole: (...roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
    },

    clearSession: () =>
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        }),

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await authApi.requestMe();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (username, password) => {
        set({ isLoading: true, error: null });
        set({ isLoading: true, error: null });
        try {
            await authApi.requestLogin(username, password);
            // El backend setea la cookie httpOnly en la respuesta del login.
            // Acto seguido pedimos /me para traer los datos del usuario.
            const user = await authApi.requestMe();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Error de inicio de sesión";
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: msg,
            });
            throw e;
        }
    },

    register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.requestRegister(payload);
            set({ isLoading: false });
            await get().login(payload.username, payload.password);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Error al registrarse";
            set({ isLoading: false, error: msg });
            throw e;
        }
    },

    logout: async () => {
        try {
            await authApi.requestLogout();
        } catch {
            // Aun si falla la red, limpiamos el estado local: el usuario
            // dejará de ver contenido protegido y un eventual 401 posterior
            // terminará de sincronizar la cookie.
        }
        set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
        });
    },
}));
