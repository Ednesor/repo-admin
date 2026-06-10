import type { ProductsPublic } from "./products.types";
import type { UserPublicAdminPanel } from "./user.types";

export interface CategoriaCreatePayload {
    nombre: string;
    descripcion?: string;
}

export interface GetProductsResponse {
    data: ProductsPublic[];
    total: number;
}

export interface GetUsersResponse {
    data: UserPublicAdminPanel[];
    total: number;
}

export interface CategoriaUpdatePayload {
    nombre?: string;
    descripcion?: string;
}

export interface ApiListResponseMultiple<T> {
    data: T[];
    total: number;
}