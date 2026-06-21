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

    // Se persiste porque el interceptor lo necesita para recuperar la sesión
    // cuando el backend responde 401 por access_token vencido.
    refreshToken: string | null;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearSession: () => void;
    setError: (msg: string | null) => void;

    // Permite actualizar el refresh token rotado por el bac
    setRefreshToken: (token: string | null) => void;

    hasRole: (...roles: RoleCode[]) => boolean;
    hasAnyRole: (roles: RoleCode[]) => boolean;
    getRoleCodes: () => RoleCode[];
    canEditProducts: () => boolean;
    canDeleteProducts: () => boolean;
    canCreateProducts: () => boolean;
    canEditStock: () => boolean;
    canManageOrders: () => boolean;
    canAccessAdmin: () => boolean;
    canManageUsers: () => boolean;
    canManageCategories: () => boolean;
    isOnlyKitchen: () => boolean;
}


export const useAuthStore = create<AuthState>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (set: any, get: any) => ({
            user: null as UserPublicAdminPanel | null,
            roles: [] as RolPublic[],
            isAuthenticated: false as boolean,
            isLoading: false as boolean,
            isLoadingInitial: true as boolean,
            error: null as string | null,
            refreshToken: null as string | null,

            setError: (msg: string | null) => set({ error: msg }),

            setRefreshToken: (token: string | null) => set({ refreshToken: token }),


            // Limpiamos también el refreshToken para evitar reintentos con credenciales expiradas
            // o sesiones inconsistentes después de logout / refresh fallido.
            clearSession: () => {
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    refreshToken: null,
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

                    // Si la sesión existe pero el usuario no tiene rol válido para el panel,
                    // revocamos el refresh token si está disponible y limpiamos el estado local
                    if (!hasAdminRole) {
                        const refreshToken = get().refreshToken;
                        try {
                            if (refreshToken) {
                                await authApi.logout({ refresh_token: refreshToken });
                            }
                        } catch {
                            // ignore
                        }
                        // Si no pudimos restaurar la sesión desde backend, descartamos también
                        // el refreshToken persistido para no intentar recuperaciones inválidas después.
                        set({
                            user: null,
                            roles: [],
                            isAuthenticated: false,
                            isLoadingInitial: false,
                            refreshToken: null,
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
                        refreshToken: null,
                    });
                }
            },

            login: async (username: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    // El backend devuelve el refresh_token en el body.
                    // Lo necesitamos para poder renovar la sesión más adelante desde el interceptor
                    const tokenData = await authApi.login({ username, password });
                    const user = await authApi.getCurrentUser();
                    const roles = user.roles;
                    // obtiene los codigos de los roles
                    const roleCodes = roles.map((r) => r.codigo);
                    const hasAdminRole = roleCodes.some((code) =>
                        ["ADMIN", "STOCK", "PEDIDOS", "COCINA"].includes(code)
                    );

                    // si no tiene rol de administrador, cerrar sesion
                    if (!hasAdminRole) {
                        get().clearSession();
                        set({
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
                        refreshToken: tokenData.refresh_token,
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
                const refreshToken = get().refreshToken;

                try {
                    if (refreshToken) {
                        await authApi.logout({ refresh_token: refreshToken });
                    }
                } catch {
                    // Even if network fails, clean local state
                }
                set({
                    user: null,
                    roles: [],
                    isAuthenticated: false,
                    error: null,
                    isLoading: false,
                    refreshToken: null,
                });
            },

            // Verifica si el usuario tiene TODOS los roles especificados
            hasRole: (...roles: RoleCode[]) => {
                const userRoles = get().roles;
                return roles.every((role) => userRoles.some((r: RolPublic) => r.codigo === role));
            },

            // Verifica si el usuario tiene AL MENOS UNO de los roles especificados
            hasAnyRole: (roles: RoleCode[]) => {
                const userRoles = get().roles;
                return roles.some((role) => userRoles.some((r: RolPublic) => r.codigo === role));
            },

            // Devuelve un array con los códigos de rol en formato string puro
            getRoleCodes: () => {
                const { roles } = get();
                return roles.map((r: RolPublic) => r.codigo);
            },

            // Lógica de negocio: Quién puede gestionar usuarios
            canManageUsers: () => {
                const roles = get().roles;
                return roles.some((r: RolPublic) => r.codigo === "ADMIN");
            },

            // Lógica de negocio: Quién puede gestionar categorias
            canManageCategories: () => {
                const roles = get().roles;
                return roles.some((r: RolPublic) => ["ADMIN", "STOCK"].includes(r.codigo));
            },

            // Lógica de negocio: Quién puede editar productos
            canEditProducts: () => {
                const roles = get().roles;
                return roles.some((r: RolPublic) => ["ADMIN", "STOCK"].includes(r.codigo));
            },

            // Lógica de negocio: Quién puede borrar productos
            canDeleteProducts: () => {
                const { roles } = get();
                const roleCodes = roles.map((r: RolPublic) => r.codigo);
                return roleCodes.includes("ADMIN");
            },

            // Lógica de negocio: Quién puede crear productos
            canCreateProducts: () => {
                const { roles } = get();
                const roleCodes = roles.map((r: RolPublic) => r.codigo);
                return roleCodes.includes("ADMIN");
            },

            // Lógica de negocio: Quién puede modificar stock
            canEditStock: () => {
                const { roles } = get();
                const roleCodes = roles.map((r: RolPublic) => r.codigo);
                return roleCodes.includes("ADMIN") || roleCodes.includes("STOCK");
            },

            // Lógica de negocio: Comprobar si es solo cocina
            isOnlyKitchen: () => {
                const roles = get().roles;
                return roles.length === 1 && roles.some((r: RolPublic) => r.codigo === "COCINA");
            },

            // Lógica de negocio: Quién puede ver y cambiar estados de pedidos
            canManageOrders: () => {
                const roles = get().roles;
                return roles.some((r: RolPublic) => ["ADMIN", "PEDIDOS", "COCINA"].includes(r.codigo));
            },

            // Puerta de entrada principal: Quién puede renderizar la vista del Panel
            canAccessAdmin: () => {
                const { roles } = get();
                const roleCodes = roles.map((r: RolPublic) => r.codigo);
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