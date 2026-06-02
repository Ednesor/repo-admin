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
    //TODO : Deuda técnica - Seguridad: Nunca se debe inferir roles visuales basándose en un string como el email ("admin"). Si un usuario se registra con "admin_trucho@gmail.com", automáticamente ganará la interfaz de Administrador (aunque el backend luego le bloquee las peticiones por no tener el JWT correcto). El rol DEBE venir desde el backend.
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

    // Valida la sesión al cargar la página (ej: cuando apretás F5). 
    // Intenta traer el usuario del back y restaurar sus roles visuales.
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

            /* 
            Obtiene la clave de cada rol y lo guardamos en sessionstorage
            para no tener que hacer peticiones cada vez que cambiamos de pagina
            */
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
            // intenta ver si llega el rol de parte del back
            if ("roles" in user && Array.isArray((user as unknown as { roles: RolPublic[] }).roles)) {
                roles.push(...((user as unknown as { roles: RolPublic[] }).roles));
            }

            if (roles.length === 0) {
                const inferredRole = getDefaultRoleForUser(user);
                if (inferredRole) {
                    roles = [inferredRole];
                }
            }

            // obtiene los codigos de los roles
            const roleCodes = roles.map((r) => r.codigo);
            const hasAdminRole = roleCodes.some((code) =>
                ["ADMIN", "STOCK", "PEDIDOS"].includes(code)
            );

            // si no tiene rol de administrador, cerrar sesion
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

            /*
            Guardamos los roles en el sessionstorage
            para no tener que hacer peticiones cada vez que cambiamos de pagina
            y actualiza el estado global de zustand para que sepa que estamos logueado 
            y renderice las vistas
            */
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

    // Verifica si el usuario tiene TODOS los roles especificados
    hasRole: (...roles) => {
        const { roles: userRoles } = get();
        const userRoleCodes = userRoles.map((r) => r.codigo);
        return roles.every((role) => userRoleCodes.includes(role));
    },

    // Verifica si el usuario tiene AL MENOS UNO de los roles especificados
    hasAnyRole: (roles) => {
        const { roles: userRoles } = get();
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
        return roleCodes.includes("ADMIN") || roleCodes.includes("PEDIDOS");
    },

    // Puerta de entrada principal: Quién puede renderizar la vista del Panel
    canAccessAdmin: () => {
        const { roles } = get();
        const roleCodes = roles.map((r) => r.codigo);
        return roleCodes.includes("ADMIN") ||
               roleCodes.includes("STOCK") ||
               roleCodes.includes("PEDIDOS");
    },
}));