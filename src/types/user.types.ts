export type RoleCode = "ADMIN" | "STOCK" | "PEDIDOS" | "CLIENT" | "COCINA";

export interface RolPublic {
    codigo: RoleCode;
    nombre: string;
}

export interface UserPublic {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    celular: string | null;
    roles?: RolPublic[];
}

export interface UserPublicAdminPanel extends UserPublic {
    roles: RolPublic[];
}

export interface UserPaginationResponse {
    data: UserPublicAdminPanel[];
    total: number;
}

export const ROLE_LABELS: Record<RoleCode, string> = {
    ADMIN: "Administrador",
    STOCK: "Gestor de Stock",
    PEDIDOS: "Gestor de Pedidos",
    CLIENT: "Cliente",
    COCINA: "Cocina",
};

export const ROLE_DESCRIPTIONS: Record<RoleCode, string> = {
    ADMIN: "Acceso total sin restricciones",
    STOCK: "Actualiza stock y disponible",
    PEDIDOS: "Avanza estados CONFIRMADO->ENTREGADO",
    CLIENT: "Opera solo sus propios datos",
};

export interface CreateUserInput {
    nombre: string;
    apellido: string;
    email: string;
    celular: string;
    password: string;
    roles_codigos: RoleCode[];
}

export interface UpdateUserInput {
    nombre: string;
    apellido: string;
    celular: string;
    roles_codigos: RoleCode[];
}

export interface UserFilters {
    offset?: number;
    limit?: number;
    rol_codigo?: RoleCode;
}
