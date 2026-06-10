import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserPublicAdminPanel, RoleCode, RolPublic } from "@/types/user.types";
import * as authApi from "@/shared/services/api/authApi";

interface AuthState {
    user: UserPublicAdminPanel | null;
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


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            roles: [],
            isAuthenticated: false,
            isLoading: false,
            isLoadingInitial: true,
            error: null,

            setError: (msg) => set({ error: msg }),

            clearSession: () => {
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            },

            // Valida la sesión al cargar la página (ej: cuando apretás F5). 
            // Intenta traer el usuario del back y restaurar sus roles visuales.
            checkAuth: async () => {
                set({ isLoadingInitial: true, error: null });
                try {
                    const user = await authApi.getCurrentUser();

                    // Validar si el usuario tiene un rol permitido
                    const roleCodes = user.roles.map((r) => r.codigo);
                    const hasAdminRole = roleCodes.some((code) =>
                        ["ADMIN", "STOCK", "PEDIDOS", "COCINA"].includes(code)
                    );

                    if (!hasAdminRole) {
                        try { await authApi.logout(); } catch { /* ignore */ }
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
                        roles: user.roles,
                        isAuthenticated: true,
                        isLoadingInitial: false,
                    });
                } catch {
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
                    const roles = user.roles;
                    // obtiene los codigos de los roles
                    const roleCodes = roles.map((r) => r.codigo);
                    const hasAdminRole = roleCodes.some((code) =>
                        ["ADMIN", "STOCK", "PEDIDOS", "COCINA"].includes(code)
                    );

                    // si no tiene rol de administrador, cerrar sesion
                    if (!hasAdminRole) {
                        try { await authApi.logout(); } catch { /* ignore */ }
                        set({
                            user: null,
                            roles: [],
                            isAuthenticated: false,
                            isLoading: false,
                            error: "No tenés permisos para acceder al panel de administración",
                        });
                        throw new Error("INSUFFICIENT_PERMISSIONS");
                    }

                    // Guardamos el usuario y sus roles en el store (y persist se encarga del storage)
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
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    error: null,
                    isLoading: false,
                });
            },

            // Verifica si el usuario tiene TODOS los roles especificados
            hasRole: (...roles) => {
                const { roles: userRoles } = get();
                const userRoleCodes = userRoles.map((r) => r.codigo);
                return roles.every((role) => userRoleCodes.includes(role));
            },

            // Verifica si el usuario tiene AL MENOS UNO de los roles especificados
            hasAnyRole: (roles) => {
                const { roles: userRoles } = get();
                //TODO : Deuda técnica - console.log de información de roles del usuario en producción, debe eliminarse.
                console.log(userRoles, roles)
                const userRoleCodes = userRoles.map((r) => r.codigo);
                return roles.some((role) => userRoleCodes.includes(role));
            },

            // Devuelve un array con los códigos de rol en formato string puro
            getRoleCodes: () => {
                const { roles } = get();
                return roles.map((r) => r.codigo);
            },

            // Lógica de negocio: Quién puede editar productos
            canEditProducts: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN") || roleCodes.includes("STOCK");
            },

            // Lógica de negocio: Quién puede borrar productos
            canDeleteProducts: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN");
            },

            // Lógica de negocio: Quién puede crear productos
            canCreateProducts: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN");
            },

            // Lógica de negocio: Quién puede modificar stock
            canEditStock: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN") || roleCodes.includes("STOCK");
            },

            // Lógica de negocio: Quién puede ver y cambiar estados de pedidos
            canManageOrders: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN") || roleCodes.includes("PEDIDOS") || roleCodes.includes("COCINA");
            },

            // Puerta de entrada principal: Quién puede renderizar la vista del Panel
            canAccessAdmin: () => {
                const { roles } = get();
                const roleCodes = roles.map((r) => r.codigo);
                return roleCodes.includes("ADMIN") ||
                    roleCodes.includes("STOCK") ||
                    roleCodes.includes("PEDIDOS") ||
                    roleCodes.includes("COCINA");
            },
        }),
        {
            name: "admin_foodstore",
            storage: createJSONStorage(() => sessionStorage),
        }
    ));