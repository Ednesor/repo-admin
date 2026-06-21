import type { ProductsPublic } from "./products.types";
import type { UserPublicAdminPanel } from "./user.types";

export interface CategoriaCreatePayload {
    nombre: string;
    descripcion?: string;
}

export interface GetProductsResponse {
    items: ProductsPublic[];
    total: number;
    page: number;
    size: number;
    pages: number;
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