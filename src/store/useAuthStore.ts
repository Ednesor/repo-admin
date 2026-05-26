import { create } from "zustand";
import type { UserPublic, RoleCode, RolPublic } from "@/types/user.types";
import * as authApi from "@/shared/services/api/authApi";

interface AuthState {
    user: UserPublic | null;
    roles: RolPublic[];
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoadingInitial: boolean;
    error: string | null;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearSession: () => void;
    setError: (msg: string | null) => void;

    hasRole: (...roles: RoleCode[]) => boolean;
    hasAnyRole: (roles: RoleCode[]) => boolean;
    getRoleCodes: () => RoleCode[];
    canEditProducts: () => boolean;
    canDeleteProducts: () => boolean;
    canCreateProducts: () => boolean;
    canEditStock: () => boolean;
    canManageOrders: () => boolean;
    canAccessAdmin: () => boolean;
}

const SESSION_STORAGE_KEY = "foodstore_auth_roles";

function getStoredRoles(): RolPublic[] {
    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function setStoredRoles(roles: RolPublic[]) {
    try {
        if (roles.length > 0) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(roles));
        } else {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
    } catch {
        // sessionStorage not available
    }
}

function getDefaultRoleForUser(user: UserPublic | null): RolPublic | null {
    if (!user) return null;
    const email = user.email.toLowerCase();
    if (email.includes("admin")) {
        return { codigo: "ADMIN", nombre: "Administrador" };
    }
    if (email.includes("stock")) {
        return { codigo: "STOCK", nombre: "Gestor de Stock" };
    }
    if (email.includes("pedido")) {
        return { codigo: "PEDIDOS", nombre: "Gestor de Pedidos" };
    }
    return null;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    roles: [],
    isAuthenticated: false,
    isLoading: false,
    isLoadingInitial: true,
    error: null,

    setError: (msg) => set({ error: msg }),

    clearSession: () => {
        setStoredRoles([]);
        set({
            user: null,
            roles: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    },

    checkAuth: async () => {
        set({ isLoadingInitial: true, error: null });
        try {
            const user = await authApi.getCurrentUser();
            let storedRoles = getStoredRoles();
            if (storedRoles.length === 0) {
                const defaultRole = getDefaultRoleForUser(user);
                if (defaultRole) {
                    storedRoles = [defaultRole];
                    setStoredRoles(storedRoles);
                }
            }

            const roleCodes = storedRoles.map((r) => r.codigo);
            const hasAdminRole = roleCodes.some((code) =>
                ["ADMIN", "STOCK", "PEDIDOS"].includes(code)
            );

            if (!hasAdminRole) {
                try { await authApi.logout(); } catch { /* ignore */ }
                setStoredRoles([]);
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    isLoadingInitial: false,
                });
                return;
            }

            set({
                user,
                roles: storedRoles,
                isAuthenticated: true,
                isLoadingInitial: false,
            });
        } catch {
            setStoredRoles([]);
            set({
                user: null,
                roles: [],
                isAuthenticated: false,
                isLoadingInitial: false,
            });
        }
    },

    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.login({ username, password });
            const user = await authApi.getCurrentUser();
            let roles: RolPublic[] = [];
            if ("roles" in user && Array.isArray((user as unknown as { roles: RolPublic[] }).roles)) {
                roles.push(...((user as unknown as { roles: RolPublic[] }).roles));
            }

            if (roles.length === 0) {
                const inferredRole = getDefaultRoleForUser(user);
                if (inferredRole) {
                    roles = [inferredRole];
                }
            }

            const roleCodes = roles.map((r) => r.codigo);
            const hasAdminRole = roleCodes.some((code) =>
                ["ADMIN", "STOCK", "PEDIDOS"].includes(code)
            );

            if (!hasAdminRole) {
                try { await authApi.logout(); } catch { /* ignore */ }
                setStoredRoles([]);
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    isLoading: false,
                    error: "No tenés permisos para acceder al panel de administración",
                });
                throw new Error("INSUFFICIENT_PERMISSIONS");
            }

            setStoredRoles(roles);
            set({
                user,
                roles,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (e: unknown) {
            if ((e as Error).message === "INSUFFICIENT_PERMISSIONS") {
                throw e;
            }
            const msg =
                e instanceof Error ? e.message : "Error de inicio de sesión";
            setStoredRoles([]);
            set({
                user: null,
                roles: [],
                isAuthenticated: false,
                isLoading: false,
                error: msg,
            });
            throw e;
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // Even if network fails, clean local state
        }
        setStoredRoles([]);
        set({
            user: null,
            roles: [],
            isAuthenticated: false,
            error: null,
            isLoading: false,
        });
    },

    hasRole: (...roles) => {
        const { roles: userRoles } = get();
        const userRoleCodes = userRoles.map((r) => r.codigo);
        return roles.every((role) => userRoleCodes.includes(role));
    },

    hasAnyRole: (roles) => {
        const { roles: userRoles } = get();
        console.log(userRoles, roles)
        const userRoleCodes = userRoles.map((r) => r.codigo);
        return roles.some((role) => userRoleCodes.includes(role));
    },

    getRoleCodes: () => {
        const { roles } = get();
        return roles.map((r) => r.codigo);
    },

    canEditProducts: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN") || roleCodes.includes("STOCK");
    },

    canDeleteProducts: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN");
    },

    canCreateProducts: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN");
    },

    canEditStock: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN") || roleCodes.includes("STOCK");
    },

    canManageOrders: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN") || roleCodes.includes("PEDIDOS");
    },

    canAccessAdmin: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN") ||
               roleCodes.includes("STOCK") ||
               roleCodes.includes("PEDIDOS");
    },
}));