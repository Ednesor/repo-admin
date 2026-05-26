export type RoleCode = "ADMIN" | "STOCK" | "PEDIDOS" | "CLIENT";

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
};

export const ROLE_DESCRIPTIONS: Record<RoleCode, string> = {
    ADMIN: "Acceso total sin restricciones",
    STOCK: "Actualiza stock y disponible",
    PEDIDOS: "Avanza estados CONFIRMADO->ENTREGADO",
    CLIENT: "Opera solo sus propios datos",
};